import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrencyLookupRemoteService {

  constructor(private httpClient: HttpClient) { }

  findCurrencies(filter: string): Observable<any> {
    const url = `lookup-service/api/currency/filter?filter=${filter}`;
    return this.httpClient.get(url);
  }

  getCurrencies(): Observable<any> {
    const url = `lookup-service/api/currency`;
    return this.httpClient.get(url);
  }
}
