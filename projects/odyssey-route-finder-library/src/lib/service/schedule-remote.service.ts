import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {getDefaultSortOption, getDefaultSortOrder, sortOrders} from "../model/sort";

@Injectable({
  providedIn: 'root'
})
export class ScheduleRemoteService {

  constructor(private httpClient: HttpClient) { }

  findPorts(pin: string) {
    const url = 'routefinder-service/api/port?pin=' + pin
    return this.httpClient.get(url);
  }

  findSchedules(
      pin: string,
      loadPort: string,
      dischargePort: string,
      departing: Date,
      days: number,
      sortOption: string = getDefaultSortOption().value,
      sortOrder: string = getDefaultSortOrder().value,
  ) {
    const date = this.toAnsiDate(departing);
    const url = `routefinder-service/api/route?pin=${pin}&originPort=${loadPort}&destinationPort=${dischargePort}&searchDate=${date}&duration=${days}&sortOption=${sortOption}&sortOrder=${sortOrder}`;

    return this.httpClient.get(url);
  }

  toAnsiDate(date: Date): string {
    return date.getFullYear() + '-' + (date.getMonth() < 9 ? ('0' + (date.getMonth() + 1) ) : date.getMonth() + 1) + '-' + date.getDate()
  }
}
