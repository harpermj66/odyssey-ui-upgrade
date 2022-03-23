import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyLookupRemoteService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Gets a list of place prediction objects to be used in the autocomplete component.
   * These object contain very basic information about a place (e.g. place_id, description).
   * To get more details for a place (e.g. address) use the place_id in getPlaceDetail.
   * @param filter
   */
  findPlacePredictions(filter: string): Observable<any> {
    const url = `lookup-service/api/place/autocomplete?filter=${filter}`;
    return this.httpClient.get(url);
  }

  /**
   * Gets place details (e.g. address, phone number etc.) for a given place_id.
   * @param placeId
   */
  getPlaceDetails(placeId: string): Observable<any> {
    const url = `lookup-service/api/place/detail?placeId=${placeId}`;
    return this.httpClient.get(url);
  }
}
