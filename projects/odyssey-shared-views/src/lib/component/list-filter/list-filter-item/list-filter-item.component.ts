import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FilterItem} from "../list-filter.component";
import {ResourceTypeModel} from "../../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {LookupService} from '../../../../../../odyssey-service-library/src/lib/lookup/service/lookup.service';


@Component({
  selector: 'lib-list-filter-item',
  templateUrl: './list-filter-item.component.html',
  styleUrls: ['./list-filter-item.component.scss']
})
export class ListFilterItemComponent implements OnInit {

  @Input() resourceType?: ResourceTypeModel;
  @Input() filterValues?: FilterItem[];

  @Output() filterClosed: EventEmitter<FilterItem> = new EventEmitter<FilterItem>();
  @Output() filterUpdated: EventEmitter<FilterItem> = new EventEmitter<FilterItem>();

  @ViewChild('inputElement') inputElement: any;

  editingFilter = false;

  constructor() {
  }

  _filterItem: FilterItem;

  ngOnInit(): void {
  }

  @Input()
  set filterItem(value: FilterItem) {
    this._filterItem = value;
  }

  get filterItem(): FilterItem {
    return this._filterItem;
  }

  onCloseItem(): void {
    this.filterClosed.emit(this.filterItem);
  }

  onFilterClick(): void {
    this.editingFilter = true;
  }

  onFilterEditComplete(event: any): void {
    this.filterItem.fieldValue = event.target.value;
    this.filterUpdated.emit(this.filterItem);
  }

  onLookupFilterEditComplete(): void {
    this.filterUpdated.emit(this.filterItem);
  }

  onLookupSelect(selected?: { [field: string]: any } | null): void {
    const filterFieldName = this.filterItem.fieldName;
    this.filterItem.fieldValue = selected ? selected[filterFieldName] : '';
    this.filterUpdated.emit(this.filterItem);
    this.editingFilter = false;
  }

  hasLookup(): boolean {
    return !!this.filterItem.fieldName
        && !!this.resourceType
        && LookupService.hasLookups(this.filterItem.fieldName, this.resourceType, this.filterValues).validLookups;
  }
}
