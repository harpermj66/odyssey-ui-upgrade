import { Component, OnInit } from '@angular/core';
import {RouteParameterSelectionEvent} from "../../../../odyssey-route-finder-library/src/lib/component/route-finder/schedule-search-parameter/schedule-search-parameter.component";
import {RestPinRemoteService} from "../../../../odyssey-service-library/src/lib/administration/rest-pin-remote.service";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {
  getDefaultSortOption,
  getDefaultSortOrder,
  SortOption,
  SortOrder,
} from "../../../../odyssey-route-finder-library/src/lib/model/sort";

@Component({
  selector: 'lib-route-finder-page',
  templateUrl: './route-finder-page.component.html',
  styleUrls: ['./route-finder-page.component.css']
})
export class RouteFinderPageComponent implements OnInit {

  routeParameterSelectionEvent: RouteParameterSelectionEvent;

  restPins: Map<string,string>;
  portsPin: string;
  schedulesPin: string;

  selectedSortOption: SortOption;
  selectedSortOrder: SortOrder;

  constructor(private restPinRemoteService: RestPinRemoteService, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.selectedSortOption = getDefaultSortOption();
    this.selectedSortOrder = getDefaultSortOrder();
    this.loadPins();
  }

  loadPins(): void {
    this.restPinRemoteService.loadRestPinsByCarrier(this.themeService.getCurrentCarrier()).subscribe(
      (restPins: any) => {
        this.restPins = restPins;
        this.portsPin = restPins['PORTS'];
        this.schedulesPin = restPins['SCHEDULE_SEARCH'];
      }, (error: any) => {
      }
    );
  }

  onRoutesRequested(event: RouteParameterSelectionEvent): void {
    this.routeParameterSelectionEvent = event;
    this.routeParameterSelectionEvent.sortOption = this.selectedSortOption;
    this.routeParameterSelectionEvent.sortOrder = this.selectedSortOrder;
  }

}
