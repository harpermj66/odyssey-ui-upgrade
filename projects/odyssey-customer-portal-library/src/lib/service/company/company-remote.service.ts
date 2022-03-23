import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CompanyRemoteService {

  constructor(private httpClient: HttpClient) { }

  findCompanyById(companyId: number): Observable<any> {
    const url = `customer-portal-administration-service/api/company/${companyId}`;
    return this.httpClient.get(url);
  }
}
