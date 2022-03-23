import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {delay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class UnlocodeLookupRemoteService {

  constructor(private httpClient: HttpClient) { }

  findUnLocodes(filter: string): Observable<any> {
    const url = `lookup-service/api/unlocode/?filter=${filter}`;
    return this.httpClient.get(url);
  }
}
