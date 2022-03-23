import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Observable} from "rxjs";
import {FormControl} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {UUID} from "uuid-generator-ts";
import {MatDialog} from "@angular/material/dialog";
import {FavouritesComponent} from "../../favourites/favourites.component";
import {RsqlUtils} from "../../../../../odyssey-service-library/src/lib/utils/rsql-utils";
import {ResourceTypeModel} from "../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {LookupService} from '../../../../../odyssey-service-library/src/lib/lookup/service/lookup.service';

export class FilterItem {

  constructor(
      public displayName: string,
      public fieldName: string,
      public type: string,
      public fieldValue: any,
      public visible = true,
      public editing = false,
      public guid?: string,
      public collection = false,
      public nestedFilterItems?: FilterItem[]
  ) {
  }

  static copy(field: FilterItem): FilterItem {
    // tslint:disable-next-line:max-line-length
    return new FilterItem(field.displayName, field.fieldName, field.type, field.fieldValue, field.visible, field.editing, field.guid, field.collection);
  }

  static flattenNestedFilterItems(items: FilterItem[]): FilterItem[] {
    return items
        .map(item => { if (!item.nestedFilterItems) { return [item] as FilterItem[]; } else { return item.nestedFilterItems; } })
        .reduce((prev, cur) => prev.concat(cur), [] as FilterItem[]);
  }
}

export class FilterItemValues {
  filterItems: FilterItem[] = [];
  filter = '';
  filterMatchAll = false;

}

export class QuickSearchHistoryItem {
  constructor(public title: string,
              public filter: FilterItemValues) {
  }
}

const FILTERABLE_TYPES: Set<string> = new Set(['String', 'String?', 'List<String>']);

@Component({
             selector: 'lib-list-filter',
             templateUrl: './list-filter.component.html',
             styleUrls: ['./list-filter.component.scss']
           })
export class ListFilterComponent implements OnInit {

  static readonly SEARCH = 'search';
  static readonly EDITING_FILTER = 'enterFilter';

  @Input() value = '';
  @Input() type = 'header';
  @Input() filterValues: FilterItem[] = [];

  @Input() filterMatchAll = false;
  @Input() favourites: QuickSearchHistoryItem[] = [];
  @Input() history: QuickSearchHistoryItem[] = [];

  @Input() resourceTypeModel?: ResourceTypeModel;

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterChanged: EventEmitter<FilterItemValues> = new EventEmitter<FilterItemValues>();
  @Output() saveFavourite: EventEmitter<string> = new EventEmitter<string>();
  @Output() manageFavourites: EventEmitter<void> = new EventEmitter<void>();
  @Output() manageHistory: EventEmitter<void> = new EventEmitter<void>();

  viewMode = ListFilterComponent.SEARCH;

  searchControl = new FormControl();
  filterControl = new FormControl();

  _filterItems: FilterItem[] = [];

  @Input() filterEnabled = true;

  availableItems: Observable<FilterItem[]>;

  filterItemValues: FilterItemValues;

  lastAddedFilterItem?: FilterItem;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit(): void {
  }

  @Input()
  set filterItems(fields: FilterItem[]) {
    if (fields != null) {
      const tempFilterItems = FilterItem.flattenNestedFilterItems(fields) // unpack nested filter items into one list
          .filter(field => FILTERABLE_TYPES.has(field.type));

      this._filterItems = tempFilterItems;
      this.availableItems = this.searchControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      if (tempFilterItems.length === 0) {
        this.viewMode = ListFilterComponent.SEARCH;
      }
    } else {
      this.viewMode = ListFilterComponent.SEARCH;
    }
  }

  get filterItems(): FilterItem[] {
    return this._filterItems;
  }

  private _filter(value: any): FilterItem[] {
    if (!value.hasOwnProperty("displayName")) {
      const filterValue = value.toLowerCase();
      return this._filterItems.filter(option => option.displayName.toLowerCase().indexOf(filterValue) === 0);
    } else {
      return [];
    }
  }

  onFilterItemAdded(value: FilterItem): void  {
    const filterValue = new FilterItem(value.displayName, value.fieldName, value.type, '', true, true);
    filterValue.guid = new UUID().getDashFreeUUID();
    this.filterValues.push(filterValue);
    this.filterControl.setValue('');
    this.filterControl.setValue('');
    this.searchControl.setValue('');
    this.lastAddedFilterItem = value;
    this.viewMode = ListFilterComponent.EDITING_FILTER;
  }

  onFilterAddComplete(): void {
    this.filterValues[this.filterValues.length - 1].fieldValue = this.filterControl.value;
    this.filterValues[this.filterValues.length - 1].editing = false;
    this.filterControl.setValue('');
    this.searchControl.setValue('');
    this.viewMode = ListFilterComponent.SEARCH;
    this.constructAndRSQLFilterAndDispatchFilterEvent(this.filterValues);
  }

  onFilterClosed(filter: FilterItem): void {
    this.filterControl.setValue('');
    this.searchControl.setValue('');
    // Remove the item at the specified index
    this.filterValues.forEach((element, index) => {
      if (filter.guid === element.guid) {
        this.filterValues.splice(index, 1);
      }
    });
    if (this.lastAddedFilterItem === filter) {
      delete this.lastAddedFilterItem;
    }
    this.constructAndRSQLFilterAndDispatchFilterEvent(this.filterValues);
  }

  onCloseItems(): void {
    this.filterValues = [];
    this.filterControl.setValue('');
    this.searchControl.setValue('');
    this.viewMode = ListFilterComponent.SEARCH;
    delete this.lastAddedFilterItem;
    this.constructAndRSQLFilterAndDispatchFilterEvent(this.filterValues);
  }

    // what about the mapped fields? should we not be applying the mapped filters here as well?
  onLookupSelect(selected?: { [field: string]: any } | null): void {
    const filter = this.filterValues[this.filterValues.length - 1];
    const filterFieldName = filter.fieldName;
    filter.fieldValue = selected ? selected[filterFieldName] : '';
    filter.editing = false;
    this.filterControl.setValue('');
    this.searchControl.setValue('');
    this.viewMode = ListFilterComponent.SEARCH;
    this.constructAndRSQLFilterAndDispatchFilterEvent(this.filterValues);
  }

  constructAndRSQLFilterAndDispatchFilterEvent(filterItems: FilterItem[]): void {
    const searchFilter = this.filterMatchAll ? RsqlUtils.buildAndFilter(this.filterValues) : RsqlUtils.buildOrFilter(this.filterValues);

    this.filterItemValues = new FilterItemValues();
    this.filterItemValues.filterItems = this.filterValues;
    this.filterItemValues.filterMatchAll = this.filterMatchAll;
    this.filterItemValues.filter = searchFilter;
    this.filterChanged.emit(this.filterItemValues);
  }

  onMatchTypeChanged(): void  {
    this.filterMatchAll = !this.filterMatchAll;
    this.constructAndRSQLFilterAndDispatchFilterEvent(this.filterValues);
  }

  onFilterItemUpdated(filterItem: FilterItem): void {
    this.constructAndRSQLFilterAndDispatchFilterEvent(this.filterValues);
  }

  onApplyHistoryItem(item: QuickSearchHistoryItem): void {
    this.filterChanged.emit(item.filter);
  }

  onApplyFavourite(item: QuickSearchHistoryItem): void {
    this.filterChanged.emit(item.filter);
  }

  onSaveToFavourites(): void {
    const dialogRef = this.dialog.open(FavouritesComponent, {data: this.favourites});
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.saveFavourite.emit(result.name);
      }
    });
  }

  onManageFavourites(): void {
    this.manageFavourites.emit();
  }

  onManageHistory(): void {
    this.manageHistory.emit();
  }

  currentFieldHasLookup(): boolean {
    return !!this.lastAddedFilterItem?.fieldName
        && !!this.resourceTypeModel
        && LookupService.hasLookups(this.lastAddedFilterItem?.fieldName, this.resourceTypeModel, this.filterValues).validLookups;
  }
}
