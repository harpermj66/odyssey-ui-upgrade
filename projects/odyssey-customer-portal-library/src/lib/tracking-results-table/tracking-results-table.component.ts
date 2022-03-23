import {Component, Input, OnInit} from '@angular/core';
import {ContainerEvent} from "../model/container-event";

@Component({
  selector: 'lib-tracking-results-table',
  templateUrl: './tracking-results-table.component.html',
  styleUrls: ['./tracking-results-table.component.css']
})
export class TrackingResultsTableComponent implements OnInit {

  @Input() data: ContainerEvent[];

  columnsToDisplay = [
    'containerNumber',
    'date',
    'eventType',
    'location',
    'voyage'
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
