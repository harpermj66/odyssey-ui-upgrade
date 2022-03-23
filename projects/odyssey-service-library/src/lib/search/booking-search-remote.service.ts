import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {FindModel} from "../api/find-model";
import {SavedSearchProvider} from "./saved-search.provider";
import {Observable} from "rxjs";
import {SavedSearchModel} from "./rule/model/saved-search.model";
import {FindModelHelper} from "./helper/find-model.helper";

@Injectable()
export class BookingSearchRemoteService implements SavedSearchProvider<any> {

  public static readonly URL = 'search-service/api/booking/search';
  public static readonly URL_SAVED_SEARCH = 'search-service/api/booking/search/savedsearch';

  constructor(private httpClient: HttpClient) {}

  findBookings(findModel: FindModel): Observable<any> {
    const params: HttpParams = FindModelHelper.buildHttpParams(findModel);
    return this.httpClient.get(BookingSearchRemoteService.URL , {params});
  }

  findBookingsAdvanced(findModel: FindModel, ruleName: string): Observable<any> {
    return this.httpClient.post(BookingSearchRemoteService.URL_SAVED_SEARCH + "/" + ruleName, findModel);
  }

  findBySearchId(id: string, findModel: FindModel): Observable<any> {
    return this.httpClient.post(BookingSearchRemoteService.URL_SAVED_SEARCH + '/' + id, findModel);
  }

  findBySearchObject(savedSearch: SavedSearchModel): Observable<any> {
    return this.httpClient.post(BookingSearchRemoteService.URL_SAVED_SEARCH, savedSearch + '/try');
  }

  // tslint:disable-next-line:typedef
  public isDuplicateRuleName(name: string) {
    return this.httpClient.get( BookingSearchRemoteService.URL_SAVED_SEARCH + '/' + name + '/exists');
  }
}
