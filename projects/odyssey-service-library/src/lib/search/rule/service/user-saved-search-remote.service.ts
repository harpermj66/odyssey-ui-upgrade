import {Injectable} from "@angular/core";
import {SavedSearchModel} from "../model/saved-search.model";
import {map} from "rxjs/operators";
import {PageModel} from "../../../model/page.model";
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {SavedSearchCopier} from "../model/saved-search-copier";

@Injectable()
export class UserSavedSearchRemoteService {

  public static readonly PATH = 'search-service/api/savedsearch/user';

  changed: Subject<void> = new Subject<void>();

  constructor(protected http: HttpClient) {
  }

  public save(savedSearch: SavedSearchModel): Observable<SavedSearchModel> {
    return this.http.post(UserSavedSearchRemoteService.PATH, savedSearch)
      .pipe(
        map(obj => {
          const copied = SavedSearchCopier.copySavedSearch(obj);
          if(copied) {
            this.changed.next();
            return copied;
          }
          throw new Error("Failed to parse SavedSearch response");
        })
      );
  }

  prepareAdvancedSearch(savedSearch: SavedSearchModel): Observable<any> {
    return this.http.post(UserSavedSearchRemoteService.PATH + '/prepare', savedSearch );
  }

  public loadPage(page: number, pageSize: number): Observable<PageModel<SavedSearchModel>> {
    return this.http.get(UserSavedSearchRemoteService.PATH)
      .pipe(
        map(result => {
          const pageResult = result as PageModel<SavedSearchModel>;

          const copiedList: SavedSearchModel[] = [];
          if(pageResult.content) {
            pageResult.content.forEach(obj=> {
              const copied = SavedSearchCopier.copySavedSearch(obj);
              if(copied) {
                copiedList.push(copied);
              }
              throw new Error("Failed to parse SavedSearch response");
            });
          }
          pageResult.content = copiedList;

          return pageResult;
        })
      );
  }

  public load(searchId: string): Observable<SavedSearchModel> {
    return this.http.get(UserSavedSearchRemoteService.PATH + '/' + searchId)
      .pipe(
        map(obj => {
          const copied = SavedSearchCopier.copySavedSearch(obj);
          if(copied) {
            return copied;
          }
          throw new Error("Failed to parse SavedSearch response");
        })
      );
  }

  public loadAdvancedSearches(resourceTypeName: string)  {
    return this.http.get( UserSavedSearchRemoteService.PATH + '/' + resourceTypeName);
  }


}
