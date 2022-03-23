import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContainerTimeline} from "../model/container-timeline";
import {MatButtonToggleChange} from "@angular/material/button-toggle";

@Component({
  selector: 'lib-timeline-toggle',
  templateUrl: './timeline-toggle.component.html',
  styleUrls: ['./timeline-toggle.component.css']
})
export class TimelineToggleComponent implements OnInit {

  @Output() timelineSelectionChanged: EventEmitter<ContainerTimeline> = new EventEmitter<ContainerTimeline>();

  @Input() timelines: ContainerTimeline[];

  selectedTimeline: ContainerTimeline[];

  constructor() { }

  ngOnInit(): void { }

  onTimelineSelectionChange(event: MatButtonToggleChange): void {
    console.log('MatButtonToggleChange: ', event);
    console.log('selectedTimeline: ', this.selectedTimeline);
    this.timelineSelectionChanged.emit(event.value);
  }

}
