import {Component, Input, OnInit} from '@angular/core';
import {ContainerTimeline} from "../model/container-timeline";
import {getIconForContainerEvent} from "../model/container-event-icon";

@Component({
  selector: 'lib-container-timeline',
  templateUrl: './container-timeline.component.html',
  styleUrls: ['./container-timeline.component.css']
})
export class ContainerTimelineComponent implements OnInit {

  @Input() timeline: ContainerTimeline;
  @Input() timelines: ContainerTimeline[] = [];

  ngOnInit(): void {}

  preventExpand(event: any): void {
    event.stopPropagation();
  }

  getTextAlignment(index: number): string{
    return index % 2 === 0 ? 'left' : 'right';
  }

  getIcon(eventType: string): string{
    return getIconForContainerEvent(eventType);
  }
}

