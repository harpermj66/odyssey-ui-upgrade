import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {ResourceTypeModel} from "../../model/resource-type.model";
import {FilterItem} from "../../utils/rsql-utils";
import {LinkedLookupModel, LookupModel} from "../../model/lookup.model";
import {map} from "rxjs/operators";

class LookupParams {
  readonly hasNonLinkedLookups: boolean;
  readonly hasLinkedLookups: boolean;
  readonly hasValidLinkedLookups: boolean;

  constructor(public readonly field: string,
              public readonly resourceType: ResourceTypeModel,
              public readonly lookupFilter: any,
              public readonly filterValues: { [fieldName: string]: any },
              public readonly linkedLookups: LinkedLookupModel[],
              public readonly validLinkedLookups: LinkedLookupModel[],
              public readonly nonLinkedLookups: LookupModel[]) {
    this.hasNonLinkedLookups = this.nonLinkedLookups.length > 0;
    this.hasLinkedLookups = this.linkedLookups.length > 0;
    this.hasValidLinkedLookups = this.validLinkedLookups.length > 0;
  }
}

/**
 * Indicates the status of lookups for a field.
 */
class LookupStatus {
  /**
   * @param validLookups Whether any lookups the field has are currently valid (eg. linked filters have their dependecies met).
   * @param lookups Whether there are any lookups configured, even ones that are currenty not valid.
   */
  constructor(public readonly validLookups: boolean, readonly lookups: boolean, public readonly unlinkedLookups: boolean) {
  }
}

export class LookupResult {
  constructor(public content: { [field: string]: any }[], public lookup?: LookupModel) {
  }
}

@Injectable()
export class LookupService {
  private static readonly REGEX_FILTER = RegExp(/(\{filter\})/g);
  private static readonly REGEX_DEPENDENCY_FILTER = RegExp(/(\{field\})/g);
  private static readonly REGEX_PAGE = RegExp(/(\{page\})/g);
  private static readonly REGEX_PAGE_INDEX_0 = RegExp(/(\{page@0\})/g);
  private static readonly REGEX_PAGE_SIZE = RegExp(/(\{page[Ss]ize\})/g);

  constructor(private http: HttpClient) {
  }

  /**
   * Checks whether a field in a resource type has any lookups.
   * If filters are specified, it will also check if any of the linked lookups are valid for the given filters.
   *
   * @param field The field in the resource type.
   * @param resourceType The resource type.
   * @param filters The currently applied filters.
   */
  public static hasLookups(field: string, resourceType: ResourceTypeModel, filters?: FilterItem[]): LookupStatus {
    const lookupParams = LookupService.buildLookupParams(field, resourceType, filters);
    return new LookupStatus(
        lookupParams.hasNonLinkedLookups || lookupParams.hasValidLinkedLookups,
        lookupParams.hasNonLinkedLookups || lookupParams.hasValidLinkedLookups,
        lookupParams.hasNonLinkedLookups);
  }

  private static buildLookupParams(field: string, resourceType: ResourceTypeModel, lookupFilter: any, otherFilters?: FilterItem[]): LookupParams {
    const fieldName = field;
    const lookups = resourceType.lookups[fieldName] ? resourceType.lookups[fieldName] : [];
    // The list of fields that have filters.
    const filterFields: string[] = [];
    // Map of filter fields to their values.
    const filterValues: { [fieldName: string]: any } = {};

    // Populate the filter variables.
    if (otherFilters) {
      otherFilters.forEach(f => {
        if (f.fieldValue) {
          filterFields.push(f.fieldName);
          filterValues[f.fieldName] = f.fieldValue;
        }
      });
    }

    const linkedLookups = LookupModel.getLinkedLookups(lookups);
    const validlinkedLookups = linkedLookups.filter(l => filterFields.includes(l.dependentMappedField));
    const nonLinkedLookups = LookupModel.getNonLinkedLookups(lookups);

    return new LookupParams(fieldName, resourceType, lookupFilter, filterValues, linkedLookups, validlinkedLookups, nonLinkedLookups);
  }

  /**
   * Perform a lookup for the given field in the given Resource type.
   * Assumes that a lookup is available, if none is, then an empty set of results is returned.
   *
   * @param field The name of the field in the resource type.
   * @param resourceType The resource type.
   * @param lookupFilter The filter to apply to the lookup.
   * @param filters The applied filters for all fields in the resource type.
   * @param page The page number, indexed from 1. Defaults to 1.
   * @param pageSize The pageSize. Defaults to 100.
   */
  public lookup(field: string,
                resourceType: ResourceTypeModel,
                lookupFilter: any,
                filters?: FilterItem[],
                page?: number,
                pageSize?: number): Observable<LookupResult> {
    const fieldName = field;
    const lookups = resourceType.lookups[fieldName];
    if (lookups) {
      const lookupParams = LookupService.buildLookupParams(fieldName, resourceType, lookupFilter, filters);

      if (lookupParams.hasValidLinkedLookups || lookupParams.hasNonLinkedLookups) {
        return this.buildAndMakeRequest(lookupParams, page, pageSize);
      } else {
        console.error("No valid lookups for field " + fieldName + " on resource type " + resourceType.resourceName);
        return of(new LookupResult([]));
      }
    } else {
      console.error("No lookups for field " + fieldName + " on resource type " + resourceType.resourceName);
      return of(new LookupResult([]));
    }
  }

  /**
   * Builds the request parameters and makes the request.
   *
   * @param lookupParams The lookup parameter object.
   * @param page The page number, indexed from 1. Defaults to 1.
   * @param pageSize The pageSize. Defaults to 100.
   * @private
   */
  private buildAndMakeRequest(lookupParams: LookupParams,
                              page?: number,
                              pageSize?: number): Observable<LookupResult> {
    let path = '';
    let params: HttpParams;
    let lookup: LookupModel;

    page = page !== null && page !== undefined && page > 0 ? page : 1;
    pageSize = pageSize !== null && pageSize !== undefined && pageSize > 0 ? pageSize : 100;

    if (lookupParams.hasValidLinkedLookups) {
      lookup = lookupParams.validLinkedLookups[0];
      const asLinked = lookup as LinkedLookupModel;
      path = this.buildLinkedPath(asLinked, lookupParams.lookupFilter, lookupParams.filterValues[asLinked.dependentMappedField], page, pageSize);
      params = this.buildLinkedParams(asLinked, lookupParams.lookupFilter, lookupParams.filterValues[asLinked.dependentMappedField], page, pageSize);
    } else {
      lookup = lookupParams.nonLinkedLookups[0];
      path = this.buildPath(lookup, lookupParams.lookupFilter, page, pageSize);
      params = this.buildParams(lookup, lookupParams.lookupFilter, page, pageSize);
    }

    return this.makeRequest(path, params, lookup, lookupParams.field, lookupParams.resourceType);
  }

  /**
   * Make the request and convert the result to a LookupResult.
   * @param path The converted path string.
   * @param params The parameters.
   * @param lookup The lookup model used to build the path and params.
   * @param field The field the lookup is to populate.
   * @param resourceType The resource type.
   * @private
   */
  private makeRequest(path: string,
                      params: HttpParams,
                      lookup: LookupModel,
                      field: string,
                      resourceType: ResourceTypeModel): Observable<LookupResult> {
    return this.http.get(path, {params})
        .pipe(
            map(results => {
              if (Array.isArray(results)) {
                return new LookupResult(results, lookup);
              } else {
                // Attempt to handle spring paged results.
                const resultObj = results as { [field: string]: any };
                if (resultObj.content && Array.isArray(resultObj.content)) {
                  return new LookupResult(resultObj.content, lookup);
                } else {
                  console.error("Failed to process lookup result for field "
                      + field + " on resource type "
                      + resourceType.resourceName + " unknown response type", results);
                  return new LookupResult([], lookup);
                }
              }
            })
        );
  }

  /**
   * Build the path from a non-linked lookup model.
   * Replaces any special tokens in the path.
   *
   * @param lookup The lookup to use.
   * @param lookupFilter The value of the filter for the lookup.
   * @param page The page number, indexed from 1.
   * @param pageSize The pageSize.
   * @private
   */
  private buildPath(lookup: LookupModel, lookupFilter: any, page: number, pageSize: number): string {
    // Replace {filter} token with the filter value
    return this.replaceCommonTokens(lookup.path, lookupFilter, page, pageSize);
  }

  /**
   * Build the path from a linked lookup model.
   * Replaces any special tokens in the path.
   *
   * @param lookup The linked lookup to use,
   * @param lookupFilter The value of the filter for the lookup.
   * @param dependencyFilterValue
   * @param page The page number, indexed from 1.
   * @param pageSize The pageSize.
   * @private
   */
  private buildLinkedPath(lookup: LinkedLookupModel, lookupFilter: any, dependencyFilterValue: any, page: number, pageSize: number): string {
    // Replace both {filter} and {field} tokens.
    return this.replaceCommonTokens(lookup.path, lookupFilter, page, pageSize)
        .replace(LookupService.REGEX_DEPENDENCY_FILTER, dependencyFilterValue ? dependencyFilterValue.toString() : '');
  }

  /**
   * Build the HttpParams from a non-linked lookup model.
   * Replaces any special tokens in the param values.
   *
   * @param lookup The lookup to use.
   * @param lookupFilter The value of the filter for the lookup.
   * @param page The page number, indexed from 1.
   * @param pageSize The pageSize.
   * @private
   */
  private buildParams(lookup: LookupModel, lookupFilter: any, page: number, pageSize: number): HttpParams {
    let params = new HttpParams();
    if (lookup.params) {
      Object.getOwnPropertyNames(lookup.params).forEach(paramName => {
        // Replace {filter} token with the filter value
        params = params.set(paramName, this.replaceCommonTokens(lookup.params[paramName], lookupFilter, page, pageSize));
      });
    }
    return params;
  }

  /**
   * Build the HttpParams from a linked lookup model.
   * Replaces any special tokens in the param values.
   *
   * @param lookup The lookup to use.
   * @param lookupFilter The value of the filter for the lookup.
   * @param dependencyFilterValue The value of the filter on the dependency field.
   * @param page The page number, indexed from 1.
   * @param pageSize The pageSize.
   * @private
   */
  private buildLinkedParams(lookup: LinkedLookupModel,
                            lookupFilter: any,
                            dependencyFilterValue: any,
                            page: number,
                            pageSize: number): HttpParams {
    let params = new HttpParams();
    if (lookup.params) {
      const dependencyFilterValueString = dependencyFilterValue ? dependencyFilterValue.toString() : '';

      Object.getOwnPropertyNames(lookup.params).forEach(paramName => {
        // Replace common and {field} tokens.
        const paramValue = this.replaceCommonTokens(lookup.params[paramName], lookupFilter, page, pageSize)
            .replace(LookupService.REGEX_DEPENDENCY_FILTER, dependencyFilterValueString);
        params = params.set(paramName, paramValue);
      });
    }
    return params;
  }

  /**
   * Replaces any tokens common to linked and non-linked lookups.
   *
   * @param toModify The string to replace tokens in.
   * @param lookupFilter The value of the filter.
   * @param page The page number, indexed from 1.
   * @param pageSize The pageSize.
   * @private
   */
  private replaceCommonTokens(toModify: string, lookupFilter: any, page: number, pageSize: number): string {
    const filterValueString = lookupFilter ? lookupFilter.toString() : '';

    // Replace {filter} token with the filter value
    let paramValue = toModify.replace(LookupService.REGEX_FILTER, filterValueString);

    // Replace page tokens
    if (page !== undefined && page !== null) {
      paramValue = paramValue.replace(LookupService.REGEX_PAGE, page.toString())
          .replace(LookupService.REGEX_PAGE_INDEX_0, (page - 1).toString());
    }
    if (pageSize !== undefined && pageSize !== null) {
      paramValue = paramValue.replace(LookupService.REGEX_PAGE_SIZE, pageSize.toString());
    }
    return paramValue;
  }
}
