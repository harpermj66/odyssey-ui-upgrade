import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LanguageRemoteService {

  constructor(private httpClient: HttpClient) { }

  getLanguages(): Observable<any> {
    const url = `lookup-service/api/language`;
    return this.httpClient.get(url);
  }

}
