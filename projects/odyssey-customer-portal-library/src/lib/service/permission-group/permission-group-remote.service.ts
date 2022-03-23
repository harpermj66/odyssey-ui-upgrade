import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {PermissionGroup} from "../../model/permission-group";
import {PermissionGroupWrapper} from "../../model/permission-group-wrapper";

@Injectable({
  providedIn: 'root'
})
export class PermissionGroupRemoteService {

  constructor(private httpClient: HttpClient) { }

  findPermissionGroupsByCompanyId(
      odysseyCompanyId: number,
      searchValue = "",
  ): Observable<any> {
    const url = `customer-portal-administration-service/api/role/permission-group/company/${odysseyCompanyId}?filter=${searchValue}`;
    return this.httpClient.get(url);
  }

  addPermissionGroup(permissionGroup: PermissionGroup): Observable<any> {
    const url = `customer-portal-administration-service/api/role/portal-permission-group`;
    return this.httpClient.post(url, permissionGroup);
  }

  updatePermissionGroup(permissionGroupWrapper: PermissionGroupWrapper): Observable<any> {
    const url = `customer-portal-administration-service/api/role/portal-permission-group`;
    return this.httpClient.put(url, permissionGroupWrapper);
  }

  deletePermissionGroup(odysseyCompanyId: number, name: string): Observable<any> {
    const url = `customer-portal-administration-service/api/role/permission-group/${name}/company/${odysseyCompanyId}`;
    return this.httpClient.delete(url);
  }

}
