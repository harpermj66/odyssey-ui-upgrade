import {Component, Input, OnInit} from '@angular/core';
import {RestPinRemoteService} from "../../../../odyssey-service-library/src/lib/administration/rest-pin-remote.service";
import {ThemeService} from "../../../../odyssey-service-library/src/lib/theme/theme.service";
import {ActivatedRoute} from "@angular/router";


@Component({
    selector: 'lib-container-tracking-page',
    templateUrl: './container-tracking-page.component.html',
    styleUrls: ['./container-tracking-page.component.css']
})
export class ContainerTrackingPageComponent implements OnInit {

    restPins: Map<string,string>;
    isLoading = false;

    trackingPin: string;
    searchString?: string | null;
    selectedOption?: string | null;

    constructor(
        private restPinRemoteService: RestPinRemoteService,
        private themeService: ThemeService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.loadPins();
        console.log('pin?', this.trackingPin)

        const paramMap = this.route.snapshot.paramMap;
        this.searchString = paramMap.get('values');
        this.selectedOption = paramMap.get('option');
    }

    loadPins(): void {
        this.isLoading = true;
        this.restPinRemoteService.loadRestPinsByCarrier(this.themeService.getCurrentCarrier()).subscribe(
            (restPins: any) => {
                console.log(restPins)
                this.restPins = restPins;
                this.trackingPin = restPins.TRACKING;
                this.isLoading = false;
                console.log('loaded pins:', restPins);
            }, (error: any) => {
                // TODO handle errors
                this.isLoading = false;
                console.log('failed to load pins: ', error);
            }
        );
    }

}
