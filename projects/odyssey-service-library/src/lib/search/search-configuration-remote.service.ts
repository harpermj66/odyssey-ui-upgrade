import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {SearchPageConfiguration} from "./search-page-configuration.model";
import {Observable} from "rxjs";

@Injectable()
export class SearchConfigurationRemoteService {

  constructor(private httpClient: HttpClient) {}

  findConfiguration(resourceTypeName: string): Observable<any> {
    const url = 'search-service/api/searchpageconfiguration/user/' +  resourceTypeName;
    return this.httpClient.get(url);
  }

  updateConfiguration(searchConfiguration: SearchPageConfiguration): Observable<any>  {
    const url = 'search-service/api/searchpageconfiguration';
    return this.httpClient.put(url,searchConfiguration);
  }

  findType(resourceType: string): Observable<any>  {
    const url = 'search-service/api/resource/' + resourceType;
    return this.httpClient.get(url);
  }
}
