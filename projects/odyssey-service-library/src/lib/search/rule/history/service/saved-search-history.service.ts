import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {PageableModel} from "../../../../model/pageable.model";
import {PageModel} from "../../../../model/page.model";
import {SavedSearchHistoryModel} from "../model/saved-search-history.model";
import {Observable} from "rxjs";
import {SavedSearchModel} from "../../model/saved-search.model";

@Injectable()
export class SavedSearchHistoryService {
  public static readonly PATH = 'search-service/api/savedsearch/user-history';
  public static readonly PATH_FAVOURITES = SavedSearchHistoryService.PATH + '/favourites';
  public static readonly PATH_HISTORY = SavedSearchHistoryService.PATH + '/history';

  constructor(private http: HttpClient) {
  }

  public getFavouriteSavedSearches(resourceType: string, pageable?: PageableModel): Observable<PageModel<SavedSearchModel>> {
    const params = PageableModel.toHttpParams(pageable);
    return this.http.get<PageModel<SavedSearchModel>>(SavedSearchHistoryService.PATH_FAVOURITES + '/' + resourceType, {params});
  }

  public getSavedSearchHistoryEntries(resourceType: string, pageable?: PageableModel): Observable<PageModel<SavedSearchModel>> {
    const params = PageableModel.toHttpParams(pageable);
    return this.http.get<PageModel<SavedSearchModel>>(SavedSearchHistoryService.PATH_HISTORY + '/' + resourceType, {params});
  }

  public addToHistory(savedSearch: SavedSearchModel): Observable<SavedSearchHistoryModel> {
    const params = new HttpParams();

    const model = new SavedSearchHistoryModel();
    model.resourceType = savedSearch.resourceTypeName;
    model.savedSearchId = savedSearch.id;
    model.lastAccessed = new Date().toISOString();

    return this.http.post<SavedSearchHistoryModel>(SavedSearchHistoryService.PATH, model, {params});
  }

  public favourite(savedSearch: SavedSearchModel): Observable<SavedSearchHistoryModel> {
    return this.setFavourite(savedSearch, true);
  }

  public unfavourite(savedSearch: SavedSearchModel): Observable<SavedSearchHistoryModel> {
    return this.setFavourite(savedSearch, false);
  }

  protected setFavourite(savedSearch: SavedSearchModel, favourite: boolean): Observable<SavedSearchHistoryModel> {
    const params = new HttpParams();

    const model = new SavedSearchHistoryModel();
    model.resourceType = savedSearch.resourceTypeName;
    model.savedSearchId = savedSearch.id;
    model.favourite = favourite;

    return this.http.post<SavedSearchHistoryModel>(SavedSearchHistoryService.PATH, model);
  }
}
