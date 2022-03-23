import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {CedexCodeModel} from "../model/cedex-code.model";
import {AsyncCache} from "../../../utils/async-cache";
import {map} from "rxjs/operators";
import {ContTypeVoModel} from "../../container/model/cont-type-vo.model";

class CacheKey {
  constructor(public readonly type: string, public readonly subtype?: string | null) {
  }

  public toString(): string {
    let key = this.type;
    if(this.subtype && this.subtype.trim() !== '') {
      key += '::' + this.subtype;
    }
    return key;
  }
}

/**
 * Service for retrieving CEDEX codes from the Odyssey M&R microservice.
 * CEDEX codes are cached on the UI side as they are unlikely to change.
 */
@Injectable()
export class CedexCodeService {

  /**
   * The cache key for the code description map that contains the combined description for the combinations
   * of the two location characters.
   */
  public static readonly KEY_LOCATION_COMBINED = 'locationCombined';

  public static readonly PATH = 'mandr-service/api/cedex';

  private codesListCache: AsyncCache<CedexCodeModel[], CacheKey> = new AsyncCache<CedexCodeModel[], CacheKey>(
    key => this.loadAllCodes(key), 600);

  private codeMap: CodeMap = new CodeMap();
  private codeDescriptionMap: CodeDescriptionMap = new CodeDescriptionMap();

  constructor(private http: HttpClient) {
  }

  /**
   * Search codes by type.
   *
   * @param type The CEDEX code type.
   * @param subtype The CEDEX code subtype.
   * @param filter Optional filter, searches the code and description.
   */
  public getCodes(type: string, subtype?: string | null, filter?: string | null): Observable<CedexCodeModel[]> {
    return this.getAllCodes(type, subtype)
      .pipe(
        map(
          codes => {
            let filtered: CedexCodeModel[];
            if(filter && filter.trim().length > 0) {
              const filterLower: string  = filter.toLowerCase();
              filtered = codes.filter( code => {
                return code.code.toLowerCase().includes(filterLower) || code.description.toLowerCase().includes(filterLower);
              });
            } else {
              filtered = codes;
            }
            return filtered;
          }
        )
      );
  }

  public getCode(code: string | null | undefined, type: string, subtype?: string | null): Observable<CedexCodeModel | null> {
    return this.getCodes(type, subtype, code).pipe(
      map(
        (codes: CedexCodeModel[]) => {
          let foundCode: CedexCodeModel | null = null;
          codes.forEach( cedexCode => {
            if(cedexCode.code === code) {
              foundCode = cedexCode;
            }
            });
          return foundCode;
        }
      )
    );
  }

  public getCodeDescription(code: string | null | undefined, type: string, subtype?: string | null): Observable<string> {
    return this.getCode(code, type, subtype).pipe(
      map(
        cedexCode => {
          let desc = '';
          if(cedexCode && cedexCode.description) {
            desc = cedexCode.description;
          }
          return desc;
        }
      )
    );
  }

  public getLocation1CodeDescription(code: string | null | undefined, contType?: ContTypeVoModel | null): Observable<string> {
    return this.getCodeDescription(code, CedexCodeModel.getLocation1CodeType(contType));
  }

  public getLocation2CodeDescription(code: string | null | undefined,
                                     contType?: ContTypeVoModel | null,
                                     machinery?: boolean | null): Observable<string> {
    return this.getCodeDescription(code, CedexCodeModel.getLocation2CodeType(contType, machinery));
  }

  public getLocation3CodeDescription(code: string | null | undefined, contType?: ContTypeVoModel | null): Observable<string> {
    return this.getCodeDescription(code, CedexCodeModel.getLocation3CodeType(contType));
  }

  public getLocation4CodeDescription(code: string | null | undefined, contType?: ContTypeVoModel | null): Observable<string> {
    return this.getCodeDescription(code, CedexCodeModel.getLocation4CodeType(contType));
  }

  public getComponentCodeDescription(code: string | null | undefined,
                                     contType?: ContTypeVoModel | null,
                                     machinery?: boolean | null,
                                     location?: string | null): Observable<string> {
    return this.getCodeDescription(code, CedexCodeModel.getComponentCodeType(contType, machinery), location);
  }

  public getDamageCodeDescription(code: string | null | undefined, contType?: ContTypeVoModel | null): Observable<string> {
    return this.getCodeDescription(code, CedexCodeModel.getDamageCodeType(contType));
  }

  public getRepairCodeDescription(code: string | null | undefined, contType?: ContTypeVoModel | null): Observable<string> {
    return this.getCodeDescription(code, CedexCodeModel.getRepairCodeType(contType));
  }

  /**
   * Returns the list of all CEDEX codes for the given CEDEX code type.
   *
   * @param type The CEDEX code type.
   * @param subtype The CEDEX code subtype.
   */
  public getAllCodes(type: string, subtype?: string | null): Observable<CedexCodeModel[]> {
    return type && type.trim() !== '' ? this.codesListCache.get(new CacheKey(type, subtype)) : of([]);
  }

  /**
   * Build a map of combined descriptions for the possible two character location combinations.
   * @private
   */
  private buildCombinedLocationDescriptionMap(): void {
    const codesToDescription = new CodeToDescription();
    const charOneCodes = this.codeMap[CedexCodeModel.TYPE_LOCATION];
    const charTwoCodes = this.codeMap[CedexCodeModel.TYPE_LOCATION_SECONDCHAR];

    if(charOneCodes && charTwoCodes) {
      Object.getOwnPropertyNames(charOneCodes).forEach(
        code => {
          codesToDescription[code] = code + ' : ' + charOneCodes[code].description;
          Object.getOwnPropertyNames(charTwoCodes).forEach(
            code2 => {
              const combinedCode = code + code2;
              const combinedDesc = charOneCodes[code].description + ', ' + charTwoCodes[code2].description;
              codesToDescription[combinedCode] = combinedCode + ' : ' + combinedDesc;
            }
          );
        }
      );
      this.codeDescriptionMap.locationCombined = codesToDescription;
    }
  }

  /**
   * Loads all codes for the given type from the remote service.
   * Also builds the various related code maps.
   *
   * @param key The CEDEX cache key.
   * @private
   */
  private loadAllCodes(key: CacheKey): Observable<CedexCodeModel[]> {
    const type = key.type;
    const subtype = key.subtype;

    let url = CedexCodeService.PATH + '/by-type/' + type;
    if(subtype && subtype.trim() !== '') {
      url += '/by-subtype/' + subtype;
    }

    return this.http.get(url).pipe(
      map(
        values => {
          const codes = values as CedexCodeModel[];

          // Add the codes as entries in the code map.
          const codesToModel = new CodeToModel();
          const codesToDescription = new CodeToDescription();

          codes.forEach(code => {
            codesToModel[code.code] = code;
            codesToDescription[code.code] = code.code + ' : ' + code.description;
          });

          if(type === CedexCodeModel.TYPE_LOCATION || type === CedexCodeModel.TYPE_LOCATION_SECONDCHAR) {
            // Clear the cached combined description entries so they get rebuilt next time they are requested.
            this.buildCombinedLocationDescriptionMap();
          }

          this.codeMap[type] = codesToModel;
          this.codeDescriptionMap [type] = codesToDescription;

          return codes;
        }
      )
    );
  }
}

export class CodeMap {
  [type: string]: CodeToModel
}

export class CodeDescriptionMap {
  [type: string]: CodeToDescription;
  locationCombined: CodeToDescription;
}

export class CodeToModel {
  [code: string]: CedexCodeModel
}

export class CodeToDescription {
  [code: string]: string
}
