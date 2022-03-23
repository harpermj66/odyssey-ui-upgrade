import { Component, OnInit } from '@angular/core';
import {RestPinRemoteService} from "../../../../odyssey-service-library/src/lib/administration/rest-pin-remote.service";
import {RouteParameterSelectionEvent} from "../../../../odyssey-route-finder-library/src/lib/component/route-finder/schedule-search-parameter/schedule-search-parameter.component";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";

@Component({
  selector: 'app-route-finder',
  templateUrl: './route-finder.component.html',
  styleUrls: ['./route-finder.component.scss'],
  providers: [RestPinRemoteService]
})
export class RouteFinderComponent implements OnInit {

  routeParameterSelectionEvent: RouteParameterSelectionEvent;

  restPins: Map<string,string>;
  portsPin: string;
  schedulesPin: string;

  constructor(private restPinRemoteService: RestPinRemoteService, private themeService: ThemeService) { }

  ngOnInit(): void {
    this.loadPins();
  }

  loadPins() {
    this.restPinRemoteService.loadRestPins().subscribe(
      (restPins: any) => {
       this.restPins = restPins;
       this.portsPin = restPins['PORTS'];
       this.schedulesPin = restPins['SCHEDULE_SEARCH'];
      }, (error: any) => {
      }
    );
  }

  onRoutesRequested(event: RouteParameterSelectionEvent) {
    this.routeParameterSelectionEvent = event;
  }

}
