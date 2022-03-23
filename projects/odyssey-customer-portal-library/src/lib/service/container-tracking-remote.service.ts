import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ContainerTrackingRemoteService {

  constructor(private httpClient: HttpClient) { }

  findContainer(option = 'container', num: string, pin: string): Observable<any> {
    const url = `containertracking-service/api/container-tracking/timeline/${option}?number=${num}&pin=${pin}`;
    return this.httpClient.get(url);
  }
}
