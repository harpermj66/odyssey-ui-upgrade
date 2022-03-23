import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserListRemoteService {

  constructor(private httpClient: HttpClient) { }

  findUsers(searchValue = ""): Observable<any> {
    const url = `customer-portal-administration-service/api/admin/user?filter=${searchValue}`;
    return this.httpClient.get(url);
  }

  findActiveUsers(): Observable<any> {
    const url = `customer-portal-administration-service/api/admin/active-user`;
    return this.httpClient.get(url);
  }

  findPortalUserByEmail(email: string): Observable<any> {
    const url = `customer-portal-administration-service/api/user/portal?email=${email}`;
    return this.httpClient.get(url);
  }

}
