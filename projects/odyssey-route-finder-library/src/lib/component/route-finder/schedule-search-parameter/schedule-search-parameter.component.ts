import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {ScheduleRemoteService} from "../../../service/schedule-remote.service";
import {RouteFinderService} from "../route-finder.service";
import {getDefaultSortOption, getDefaultSortOrder, SortOption, SortOrder} from "../../../model/sort";

export class RouteParameterSelectionEvent {
  constructor(
      public loadPort: string,
      public dischargePort: string,
      public direction: string,
      public departing: Date,
      public days: number,
      public sortOption: SortOption = getDefaultSortOption(),
      public sortOrder: SortOrder = getDefaultSortOrder(),
  ) {}
}

@Component({
  selector: 'lib-schedule-search-parameter',
  templateUrl: './schedule-search-parameter.component.html',
  styleUrls: ['./schedule-search-parameter.component.scss']
})
export class ScheduleSearchParameterComponent implements OnInit {

  @Output() routesRequested = new EventEmitter<RouteParameterSelectionEvent>();

  _pin = '';

  constructor(private scheduleRemoteService: ScheduleRemoteService,
              private formBuilder: FormBuilder,
              public routeFinderService: RouteFinderService) {
  }

  ngOnInit() {
    if (!this.routeFinderService.routePreselected) {
      this.routeFinderService.prepareForm();
    }
  }

  get pin(): string {
    return this._pin;
  }

  @Input()
  set pin(value: string) {
    this._pin = value;
    if (value != null) {
      console.log('is preselected ' + this.routeFinderService.routePreselected)
      if (!this.routeFinderService.routePreselected) {
        this.routeFinderService.prepareFilters();
        this.routeFinderService.findPorts(value);
      } else {
        this.onRouteRequested();
        this.routeFinderService.routePreselected = false;
      }
    }
  }

  onRouteRequested(): void {
    this.routesRequested.emit(
        new RouteParameterSelectionEvent(
            this.routeFinderService.loadPort.code,
            this.routeFinderService.dispatchPort.code,
            this.routeFinderService.directionControl.value,
            this.routeFinderService.departingControl.value,
            this.routeFinderService.daysControl.value,
        )
    );
  }

  public flag(value: string): string {
    return "https://www.countryflags.io/" + value.toLowerCase() + "/flat/32.png";
  }
}
