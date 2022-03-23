import {Component, Input, OnInit} from '@angular/core';
import {COMMA, SPACE, ENTER} from '@angular/cdk/keycodes';
import {ContainerTrackingRemoteService} from "../service/container-tracking-remote.service";
import {SearchOption, searchOptions, getDefaultSearchOption, getSearchOptionByValue} from "../model/tracking-option";
import {TrackingResponse} from "../model/tracking-response";
import {ContainerTimeline} from "../model/container-timeline";
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
    selector: 'lib-container-tracker',
    templateUrl: './container-tracker.component.html',
    styleUrls: ['./container-tracker.component.css']
})
export class ContainerTrackerComponent implements OnInit {

    @Input() pin: string;
    @Input() searchString?: string | null | undefined;
    @Input() selectedOption?: string | null | undefined;

    // CHIPS
    selectable = true;
    removable = true;
    addOnBlur = true;
    readonly separatorKeysCodes = [COMMA, SPACE, ENTER] as const;
    searchValues: string[] = [];

    // OPTION DROPDOWN
    searchOptions = searchOptions;
    selectedSearchOption: SearchOption;

    // API
    fetchingData = false;
    errorMessage = '';
    trackingResponse?: TrackingResponse;
    containerTimelines?: ContainerTimeline[];
    selectedTimeline?: ContainerTimeline;

    constructor(private trackingRemoteService: ContainerTrackingRemoteService) {}

    ngOnInit(): void {
        this.selectedSearchOption = getDefaultSearchOption();

        if(this.searchString && this.selectedOption){
            this.setSearchValues(this.searchString.split(','));
            this.setSelectedSearchOption(getSearchOptionByValue(this.selectedOption))
            this.findContainer(this.selectedOption, this.searchString, this.pin);
        }
    }

    setSearchValues(values: string[]): void{
        this.searchValues = values;
    }

    setSelectedSearchOption(selectedOption: SearchOption): void{
        this.selectedSearchOption = selectedOption;
    }

    setSelectedTimeline(timeline: ContainerTimeline): void{
        console.log('selected timeline contNo', timeline.containerNumber);
        this.selectedTimeline = timeline;
        console.log('this selected timeline', this.selectedTimeline);
    }

    onSubmit(): void{
        console.log('option', this.selectedSearchOption?.value);
        console.log('values', this.searchValues.join());
        this.containerTimelines = undefined;
        this.findContainer(this.selectedSearchOption.value, this.searchValues.join(), this.pin);
    }

    findContainer(option = 'container', values: string, pin: string): void {
        this.fetchingData = true;
        const parent = this;

        this.trackingRemoteService.findContainer(option, values, pin).subscribe(
            (response: any) => {
                console.log("response: ", response);

                parent.trackingResponse = response;
                parent.containerTimelines = parent.trackingResponse?.containerTimelines;

                if(parent.containerTimelines){
                    parent.selectedTimeline = parent.containerTimelines[0];
                    parent.errorMessage = '';
                }
                else {
                    // TODO
                    parent.selectedTimeline = undefined;
                    parent.errorMessage = 'Not found';
                }
            },
            (error: any) => {
                parent.fetchingData = false;
                console.log(error);
                // TODO handle error
                // TODO should get message from response
                parent.errorMessage = 'Not found';
            },
            () => {
                parent.fetchingData = false;
            },
        );
    }
}
