import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../../model/user";

@Injectable({
  providedIn: 'root'
})
export class UserRegistrationService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user: User): Observable<any> {
    const url = `customer-portal-administration-service/api/user`;
    return this.httpClient.post(url, user);
  }
}
