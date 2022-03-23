import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';

import {FilterItem} from "../list-filter/list-filter.component";
import {ResourceTypeModel} from "../../../../../odyssey-service-library/src/lib/model/resource-type.model";

@Component({
  selector: 'lib-standard-list-page-header',
  templateUrl: './standard-list-page-header.component.html',
  styleUrls: ['./standard-list-page-header.component.scss']
})
export class StandardListPageHeaderComponent implements OnInit, OnChanges {

  @Output() columnVisibilityChanged: EventEmitter<FilterItem[]> = new EventEmitter<FilterItem[]>();
  @Output() columnsReset: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() searchTypeChanged: EventEmitter<string> = new EventEmitter<string>();
  @Output() sortCleared = new EventEmitter<void>();


  @Input()
  title = '';
  @Input()
  addLabel = '';
  @Input()
  selectColumnsAvailable = false;

  /**
   * The current state of the displayable columns.
   */
  @Input()
  displayableFields: FilterItem[];

  /**
   * The default state of the displayable columns (after a reset).
   */
  @Input()
  displayableFieldsDefault: FilterItem[];

  @Input()
  showSearchOptions = false;
  @Input()
  searchType = '';
  @Input()
  sort = 'Sort';

  _resourceType: ResourceTypeModel;

  visibilityNotifyTimeout?: number;

  changes = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  @Input()
  set resourceType(value: ResourceTypeModel) {
    this._resourceType = value;
    if (value != null) {

    }
  }

  get resourceType(): ResourceTypeModel {
    return this._resourceType;
  }

  onOpen(): void {
    this.changes = false;
  }

  onClose(): void {
    if (this.changes) {
      this.columnVisibilityChanged.emit(this.displayableFields);
    }
    this.changes = false;
  }

  onColumnsChangedVisibility(): void {
    this.changes = true;

    if (this.visibilityNotifyTimeout) {
      clearTimeout(this.visibilityNotifyTimeout);
    }

    this.visibilityNotifyTimeout = setTimeout(() => {
      this.columnVisibilityChanged.emit(this.displayableFields);
    }, 1000);
  }

  onToggleColumnVisibility(fi: FilterItem, visible: boolean): void {
    fi.visible = visible;
    this.onColumnsChangedVisibility();
  }

  onSearchTypeChange(value: string): void {
    this.searchTypeChanged.emit(value);
  }

  onClearSort(): void {
    this.sortCleared.emit();
  }

  onResetColumns(): void {
    const columnsVisibilityDefault = this.displayableFieldsDefault;
    if(columnsVisibilityDefault) {
      const defaultFieldNames = this.displayableFieldsDefault.map(a => a.fieldName);
      this.displayableFields.forEach(filterItem => {
        filterItem.visible = defaultFieldNames.includes(filterItem.fieldName);
      });

      this.columnsReset.emit(defaultFieldNames);
      this.columnVisibilityChanged.emit(this.displayableFields);
    }
  }
}
