import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  getDefaultSortOption,
  getDefaultSortOrder,
  SortOption,
  sortOptions,
  SortOrder,
  sortOrders
} from "../../../model/sort";
import {RouteParameterSelectionEvent} from "../schedule-search-parameter/schedule-search-parameter.component";

@Component({
  selector: 'lib-schedule-result-sort',
  templateUrl: './schedule-result-sort.component.html',
  styleUrls: ['./schedule-result-sort.component.css']
})
export class ScheduleResultSortComponent implements OnInit {

  @Output() sortOptionChanged = new EventEmitter<SortOption>();
  @Output() sortOrderChanged = new EventEmitter<SortOrder>();
  @Output() someEvent = new EventEmitter<RouteParameterSelectionEvent>();

  sortOptions = sortOptions;
  sortOrders = sortOrders;
  selectedSortOption: SortOption;
  selectedSortOrder: SortOrder;

  constructor() { }

  ngOnInit(): void {
    this.selectedSortOption = getDefaultSortOption();
    this.selectedSortOrder = getDefaultSortOrder();
  }

  emit(event: RouteParameterSelectionEvent): void {
    this.someEvent.emit(event);
  }

  emitSortOption(option: SortOption): void {
    this.sortOptionChanged.emit(option);
  }

  emitSortOrder(order: SortOrder): void {
    this.sortOrderChanged.emit(order);
  }

}
