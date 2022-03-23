import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {ContTypeGroupVoModel} from "../model/cont-type-group-vo.model";
import {AsyncCacheLoader} from "../../../utils/async-cache-loader";
import {PageModel} from "../../../model/page.model";
import {map} from "rxjs/operators";
import {PageableModel} from "../../../model/pageable.model";


@Injectable()
export class ContTypeGroupService{
  public static readonly GROUP_TYPE_CONTAINER = 'CONTAINER';
  public static readonly GROUP_TYPE_LCL = 'LCL';
  public static readonly GROUP_TYPE_BREAK_BULK = 'BREAK_BULK';
  public static readonly GROUP_TYPE_RORO = 'RORO';
  public static readonly PATH = 'mandr-service/api/cont-type-group';

  private cache = new AsyncCacheLoader<ContTypeGroupVoModel[]>(() => this.loadTypeGroups(), 120);

  private groupNameToObj?: {[groupName: string]: ContTypeGroupVoModel};

  constructor(private http: HttpClient) {

  }

  public findContTypeGroupByGroupName(groupName: string): Observable<ContTypeGroupVoModel | undefined> {
    // Make sure the cache is loaded then try and get the mapped value;
    return this.cache.get().pipe(
      map(() => {
        if(this.groupNameToObj) {
          return this.groupNameToObj[groupName];
        }
        return undefined;
      })
    );
  }

  public getContTypeGroups(): Observable<ContTypeGroupVoModel[]> {
    return this.cache.get().pipe(
      map(all => {
        return all.slice();
      })
    );
  }

  public getContTypeGroupsByType(groupType: string): Observable<ContTypeGroupVoModel[]> {
    // Make sure the cache is loaded then try and get the mapped value;
    return this.cache.get().pipe(
      map(all => {
        return all.filter(g => g.groupType === groupType);
      })
    );
  }

  private loadTypeGroups(): Observable<ContTypeGroupVoModel[]> {
    const page = new PageableModel();
    page.pageSize = PageableModel.PAGE_SIZE_MAX;
    const params: HttpParams = PageableModel.toHttpParams(page);
    return (this.http.get(ContTypeGroupService.PATH + '/search', {params}) as Observable<PageModel<ContTypeGroupVoModel>>).pipe(
      map((results: PageModel<ContTypeGroupVoModel>) => {
        const groupNameToObj: {[groupName: string]: ContTypeGroupVoModel} = {};

        if(results.content) {
          // Map the groups to names for the by name lookup
          results.content.forEach(
            contTypeGroup => {
              groupNameToObj[contTypeGroup.groupName] = contTypeGroup;
            }
          );

          this.groupNameToObj = groupNameToObj;
          return results.content;
        } else {
          return [];
        }
      })
    );
  }
}
