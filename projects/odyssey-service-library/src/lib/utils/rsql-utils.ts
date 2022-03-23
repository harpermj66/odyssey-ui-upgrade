export interface FilterItem {
  fieldName: string;
  type: string;
  fieldValue: any;
}

/**
 * Utility class for building RSQL queries.
 */
export class RsqlUtils {
  public static readonly JOIN_OR = ',';
  public static readonly JOIN_AND = ';';
  public static readonly QUOTE = '\'';
  public static readonly EMPTY_QUERY = '';
  public static readonly EMPTY_FIELD_VALUE = '';
  public static readonly OPERATOR_EQ = '==';

  /**
   * Builds an RSQL AND filter from the given list of filters.
   *
   * @param filterItems
   */
  public static buildAndFilter(filterItems?: FilterItem[]): string {
    const filters: string[] = [];
    filterItems?.forEach( fi => filters.push(fi.fieldName + RsqlUtils.OPERATOR_EQ + RsqlUtils.quoteValue(fi.fieldValue)));
    return this.buildQuery(filters, true);
  }

  /**
   * Builds and RSQL query by ORing all the given filters.
   *
   * @param filterItems
   */
  public static buildOrFilter(filterItems?: FilterItem[]): string {
    const filters: string[] = [];
    if (filterItems) {
      filterItems.forEach(fi => filters.push(fi.fieldName + RsqlUtils.OPERATOR_EQ + RsqlUtils.quoteValue(fi.fieldValue)));
    }
    return this.buildQuery(filters, false);
  }

  /**
   * Builds a joint query from a list of RSQL query strings.
   *
   * @param queries The RSQL queries.
   * @param andQuery Whether this is an AND query, defaults to an OR query.
   */
  public static buildQuery(queries: string[], andQuery?: boolean): string {
    if (queries.length > 0) {
      return "(" + queries.join(andQuery ? RsqlUtils.JOIN_AND : RsqlUtils.JOIN_OR) + ")";
    } else {
      return RsqlUtils.EMPTY_QUERY;
    }
  }

  /**
   * Encloses a filter value in RSQL quotes.
   *
   * @param value
   */
  public static quoteValue(value?: any): string {
    return '"' + (value ? value : RsqlUtils.EMPTY_FIELD_VALUE) + '"';
  }

  /**
   * Maps filter items to their field names.
   * Supports having multiple filter items for each field name.
   *
   * @param filterItems
   * @private
   */
  private static buildFilterMap(filterItems?: FilterItem[]): { [fieldName: string]: FilterItem[] } {
    const filterMap: { [fieldName: string]: FilterItem[] } = {};

    if (filterItems) {
      filterItems.forEach(fi => {
        let filterList = filterMap[fi.fieldName];
        if (!filterList) {
          filterList = [];
          filterMap[fi.fieldName] = filterList;
        }
        filterList.push(fi);
      });
    }

    return filterMap;
  }
}
