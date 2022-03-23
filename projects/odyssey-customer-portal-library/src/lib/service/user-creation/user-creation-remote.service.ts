import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserCreationRemoteService {

  constructor(private httpClient: HttpClient) { }

  createUser(user: User): Observable<any> {
    const url = `customer-portal-administration-service/api/admin/user`;
    return this.httpClient.post(url, user);
  }

  updateUser(user: User): Observable<any> {
    const url = `customer-portal-administration-service/api/admin/user`;
    return this.httpClient.put(url, user);
  }

}
