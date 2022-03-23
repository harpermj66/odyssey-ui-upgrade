import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TimeZoneRemoteService {

  constructor(private httpClient: HttpClient) { }

  getTimeZones(): Observable<any> {
    const url = `lookup-service/api/timezone`;
    return this.httpClient.get(url);
  }

}
