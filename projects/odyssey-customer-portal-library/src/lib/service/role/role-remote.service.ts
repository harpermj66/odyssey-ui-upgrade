import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RoleRemoteService {

  constructor(private httpClient: HttpClient) { }

  findRoles(): Observable<any> {
    const url = `customer-portal-administration-service/api/role`;
    return this.httpClient.get(url);
  }

}
