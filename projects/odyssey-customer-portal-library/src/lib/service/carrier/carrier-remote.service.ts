import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {User} from "../../model/user";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CarrierRemoteService {

  constructor(private httpClient: HttpClient) { }

  findCarrierByName(name: string): Observable<any> {
    const url = `customer-portal-administration-service/api/carrier?name=${encodeURIComponent(name)}`;

    return this.httpClient.get(url);
  }

}
