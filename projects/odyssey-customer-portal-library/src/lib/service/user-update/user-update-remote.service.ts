import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User, UserStatus} from "../../model/user";

@Injectable({
  providedIn: 'root'
})
export class UserUpdateRemoteService {

  constructor(private httpClient: HttpClient) { }

  adminUpdateUser(user: User): Observable<any> {
    const url = `customer-portal-administration-service/api/admin/user`;
    return this.httpClient.put(url, user);
  }

  updateUser(user: User): Observable<any> {
    const url = `customer-portal-administration-service/api/user`;
    return this.httpClient.put(url, user);
  }

}
