import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'lib-data-grid-navigator',
  templateUrl: './data-grid-navigator.component.html',
  styleUrls: ['./data-grid-navigator.component.scss']
})
export class DataGridNavigatorComponent implements OnInit {

  @Output() pageChanged: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  @Input() totalRecords = 0;
  @Input() page = 0;
  @Input() size = 100;
  @Input() pageSizes = [15,20,50,100];
  @Input() navigatorEnabled = true;

  constructor() { }

  ngOnInit(): void {
  }

  onPageChange(pageEvent: PageEvent): void {
    this.pageChanged.emit(pageEvent);
  }
}
