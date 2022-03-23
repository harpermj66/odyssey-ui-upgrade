import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RouteParameterSelectionEvent} from "../schedule-search-parameter/schedule-search-parameter.component";
import {ScheduleRemoteService} from "../../../service/schedule-remote.service";
import {Solution} from "../../../model/solution";
import {
  getDefaultSortOption,
  getDefaultSortOrder,
  SortOption,
  sortOptions,
  SortOrder,
  sortOrders
} from "../../../model/sort";

@Component({
  selector: 'lib-schedule-result',
  templateUrl: './schedule-result.component.html',
  styleUrls: ['./schedule-result.component.scss']
})
export class ScheduleResultComponent implements OnInit {

  loadingSolutions = true;
  routesFound = false;
  solutions: Solution[];

  _routeParameterSelectionEvent: RouteParameterSelectionEvent;

  selectedSortOption: SortOption;
  selectedSortOrder: SortOrder;
  sortOptions = sortOptions;
  sortOrders = sortOrders;

  timeout: any;
  debounce = 1000;

  @Input() pin = '';


  constructor(private scheduleRemoteService: ScheduleRemoteService) {
    this.selectedSortOption = getDefaultSortOption();
    this.selectedSortOrder = getDefaultSortOrder();
    console.log("constructor");
  }

  ngOnInit(): void { }

  @Input()
  set routeParameterSelectionEvent(value: RouteParameterSelectionEvent) {
    this._routeParameterSelectionEvent = value;
    if (value != null) {
      this.loadSchedules(
          value.loadPort,
          value.dischargePort,
          value.direction,
          value.departing,
          value.days,
          value.sortOption.value,
          value.sortOrder.value,
      );
    }
  }

  get routeParameterSelectionEvent(): RouteParameterSelectionEvent {
    return this._routeParameterSelectionEvent;
  }

  loadSchedules(
      loadPort: string,
      dischargePort: string,
      direction: string,
      departing: Date,
      days: number,
      sortOption: string = getDefaultSortOption().value,
      sortOrder: string = getDefaultSortOrder().value,
  ): void  {
    const parent = this;
    this.loadingSolutions = true;
    this.routesFound = false;
    this.scheduleRemoteService.findSchedules(this.pin, loadPort, dischargePort, departing, days, sortOption, sortOrder).subscribe(
      (solutions: any) => {
        parent.loadingSolutions = false;
        if (solutions.length > 0) {
          parent.routesFound = true;
          parent.solutions = solutions;
        }
      }, (error: any) => {
        parent.loadingSolutions = false;
      }
    );
  }

  sort(): void {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      const value = this._routeParameterSelectionEvent;
      if (value != null) {
        this.loadSchedules(
            value.loadPort,
            value.dischargePort,
            value.direction,
            value.departing,
            value.days,
            this.selectedSortOption.value,
            this.selectedSortOrder.value,
        );
      }
    }, this.debounce);
  }
}
