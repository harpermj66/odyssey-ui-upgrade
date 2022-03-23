import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FindModel} from "../../../../odyssey-service-library/src/lib/api/find-model";
import {Observable} from "rxjs";
import {FindModelHelper} from "../../../../odyssey-service-library/src/lib/search/helper/find-model.helper";
import {SavedSearchModel} from "../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";

@Injectable()
export class SearchServiceRemote {

  public static readonly SEARCH_SERVICE_ROOT_URL = 'search-service/api';

  constructor(private httpClient: HttpClient) {}

  quickSearch(area: string, findModel: FindModel): Observable<any> {
    const params: HttpParams = FindModelHelper.buildHttpParams(findModel);
    return this.httpClient.get(SearchServiceRemote.SEARCH_SERVICE_ROOT_URL + '/' + area + '/search', {params});
  }

  advancedSearchByName(area: string, findModel: FindModel, ruleName: string): Observable<any> {
    return this.httpClient.post(SearchServiceRemote.SEARCH_SERVICE_ROOT_URL + '/' + area + '/search/advanced/' + ruleName, findModel);
  }

  tryAdvancedSearch(area: string, savedSearch: SavedSearchModel): Observable<any> {
    return this.httpClient.post(SearchServiceRemote.SEARCH_SERVICE_ROOT_URL + '/' + area + '/search/advanced/try', savedSearch);
  }

  isDuplicateRuleName(area: string, name: string): Observable<any> {
    return this.httpClient.get( SearchServiceRemote.SEARCH_SERVICE_ROOT_URL + '/' + area + '/search/advanced/' + name + '/exists');
  }
}
