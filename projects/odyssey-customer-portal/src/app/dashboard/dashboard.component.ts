import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {RestPinRemoteService} from "../../../../odyssey-service-library/src/lib/administration/rest-pin-remote.service";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {BreakpointObserver} from "@angular/cdk/layout";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit  {

  restPins: Map<string,string>;
  portsPin: string;
  schedulesPin: string;
  trackingPin: string;
  dashboardLayout = 'row';

  constructor(private route: ActivatedRoute, private router: Router,
              private restPinRemoteService: RestPinRemoteService, public themeService: ThemeService,
              private observer: BreakpointObserver) { }

  ngOnInit(): void {
    this.loadPins();
  }

  ngAfterViewInit(): void {
    this.modifyDashboardLayout();
  }

  modifyDashboardLayout(): void {
     this.observer.observe(['(max-width: 1000px)']).subscribe((res) => {
        if (res.matches) {
          this.dashboardLayout = "column";
        } else {
            this.dashboardLayout = "row";
        }
      });
  }

  loadPins(): void {

    this.restPinRemoteService.loadRestPinsByCarrier(this.themeService.getCurrentCarrier()).subscribe(
        (restPins: any) => {
          this.restPins = restPins;
          this.portsPin = restPins.PORTS;
          this.schedulesPin = restPins.SCHEDULE_SEARCH;
          this.trackingPin = restPins.TRACKING;
        }, (error: any) => {
        }
    );
  }

  onFindRoute(): void {
    this.router.navigate(['/cover-page/route-finder']);
  }

  passDataToContainerTrackingPage(requestData: any): void{
      this.router.navigate(['/cover-page/container-tracking', requestData]);
  }
}
