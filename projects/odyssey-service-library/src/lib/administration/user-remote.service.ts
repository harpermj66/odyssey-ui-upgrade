import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FindModel} from "../api/find-model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserRemoteService {

  constructor(private httpClient: HttpClient) { }

  findUsers(findModel: FindModel): Observable<any> {
    const url = 'administration-service/api/user?search=' + findModel.search + '&fields=' + findModel.fields +
      '&sort=' + findModel.sort + '&page=' + findModel.page + '&size=' + findModel.size;
    return this.httpClient.get(url);
  }

}
