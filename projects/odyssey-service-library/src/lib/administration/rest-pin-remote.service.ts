import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FindModel} from "../api/find-model";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RestPinRemoteService {

  constructor(private httpClient: HttpClient) { }

  loadRestPins(): Observable<any> {
    return this.httpClient.get('administration-service/api/restpin');
  }

  loadRestPinsByCarrier(carrier: string): Observable<any> {
    return this.httpClient.get('administration-service/api/restpin/' + carrier);
  }

}
