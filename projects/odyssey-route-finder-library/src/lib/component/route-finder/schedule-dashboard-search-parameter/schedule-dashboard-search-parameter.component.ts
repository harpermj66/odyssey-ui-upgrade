import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {RouteParameterSelectionEvent} from "../schedule-search-parameter/schedule-search-parameter.component";
import {RouteFinderService} from "../route-finder.service";

@Component({
  selector: 'lib-schedule-dashboard-search-parameter',
  templateUrl: './schedule-dashboard-search-parameter.component.html',
  styleUrls: ['./schedule-dashboard-search-parameter.component.scss']
})
export class ScheduleDashboardSearchParameterComponent implements OnInit {

  @Output() findRouteExecuted = new EventEmitter<void>();
  @Output() routesRequested = new EventEmitter<RouteParameterSelectionEvent>();

  _pin = '';

  constructor(public routeFinderService: RouteFinderService) { }

  ngOnInit(): void {
    this.routeFinderService.prepareForm();
  }

  onFindRoute(): void {
    // Open the route finder page pre-populated with data.
    this.routeFinderService.routePreselected = true;
    this.findRouteExecuted.emit();
  }

  get pin(): string {
    return this._pin;
  }

  @Input()
  set pin(value: string) {
    this._pin = value;
    if (value != null) {
      // Ports filters
      this.routeFinderService.prepareFilters();
      this.routeFinderService.findPorts(value);
    }
  }


  public flag(value: string): string {
    return "https://www.countryflags.io/" + value.toLowerCase() + "/flat/32.png";
  }


}
