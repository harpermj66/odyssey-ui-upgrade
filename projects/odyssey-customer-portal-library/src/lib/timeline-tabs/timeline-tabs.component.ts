import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ContainerTimeline} from "../model/container-timeline";

@Component({
  selector: 'lib-timeline-tabs',
  templateUrl: './timeline-tabs.component.html',
  styleUrls: ['./timeline-tabs.component.css']
})
export class TimelineTabsComponent implements OnInit {

  @Output() onTabClick: EventEmitter<ContainerTimeline> = new EventEmitter<ContainerTimeline>();

  @Input() timelines: ContainerTimeline[];

  selectedTimeline: ContainerTimeline[];

  constructor() { }

  ngOnInit(): void { }

  /*
  * This is temporary as the backend model will need minor adjustments.
  * TODO fix me next time
  * */
  getTabLabel(timeline: ContainerTimeline): string{
    let label = '';

    if(timeline.containerNumber){
      label = timeline.containerNumber;
    }
    else if(timeline.bookingNumber){
      label = timeline.bookingNumber;
    }
    else if(timeline.blNumbers && timeline.blNumbers[0]){
      label = timeline.blNumbers[0]
    }
    else if(timeline.siNumbers && timeline.siNumbers[0]){
      label = timeline.siNumbers[0]
    }

    return label;
  }

}
