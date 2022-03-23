import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { FindModel } from "../../../../../../odyssey-service-library/src/lib/api/find-model";
import { SelectionModel } from "@angular/cdk/collections";
import { FilterItem } from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import { ResultModel } from "../../../../../../odyssey-service-library/src/lib/api/result-model";
import { Sort } from "@angular/material/sort";
import { SearchPageConfiguration } from "../../../../../../odyssey-service-library/src/lib/search/search-page-configuration.model";
import { SearchConfigurationService } from "../../search-configuration.service";
import {
  ActionMenu,
  DataGridColumn
} from "../../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import { PageEvent } from "@angular/material/paginator";
import { SearchServiceRemote } from "../../search-service.remote";

@Component({
  selector: 'lib-booking-list',
  templateUrl: './booking-list.component.html',
  styleUrls: ['./booking-list.component.css']
})
export class BookingListComponent implements OnInit {

  @Output() findModelChanged: EventEmitter<FindModel> = new EventEmitter<FindModel>();
  @Output() defaultColumnsChanged: EventEmitter<FilterItem[]> = new EventEmitter<FilterItem[]>();
  @Output() columnOrderingChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input() area = '';

  columnMappings: Map<string, DataGridColumn>;
  headerMenus: ActionMenu[] = [
    {actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: ''}];
  rowMenus: ActionMenu[] = [
    {actionId: 'editRecord', title: 'Edit', enabled: true, children: [], icon: ''},
    {actionId: 'deletedRecord', title: 'Delete', enabled: true, children: [], icon: ''}
  ];

  displayColumns: string[] = [];
  filterItems: FilterItem[] = [];
  noData = false;
  dataSource = new MatTableDataSource<any>();
  findModel = new FindModel ('','','',0, 15);
  selection = new SelectionModel<any>(true, []);
  selectedRow?: any;
  resultModel = new ResultModel ([], 0, this.findModel);

  // tslint:disable-next-line:variable-name
  _configuration: SearchPageConfiguration;

  constructor(private searchServiceRemote: SearchServiceRemote,
              public searchConfigurationService: SearchConfigurationService) { }

  ngOnInit(): void {
  }

  @Input()
  set configuration(value: SearchPageConfiguration) {
    this._configuration = value;
    if (value != null) {
      this.setDisplayedColumns();
      this.createColumnMappings();
      this.loadList();
    }
  }

  get configuration(): SearchPageConfiguration {
    return this._configuration;
  }

  setDisplayedColumns(): void {
    // Non null displayColumns will be set by binding later and can be null
    if (this._configuration.displayColumns == null) {
      return;
    }
    // Load the display columns in the correct order (implicit in displayColumn ordering)
    const tmpDisplayColumns = ['select'];
    for (const dc of this._configuration.displayColumns) {
      tmpDisplayColumns.push(dc);
    }
    tmpDisplayColumns.push('buttons');

    // Assign and load list
    this.displayColumns = tmpDisplayColumns;
  }

  createColumnMappings(): void {
    const tmpColumnMaps: Map<string,DataGridColumn> = new Map<string, DataGridColumn>();
    if (this.configuration != null && this.configuration.resourceType != null &&
        this.configuration.resourceType.resourceAttributes != null) {
      for (const ra of this.configuration.resourceType.resourceAttributes) {
        const dgc: DataGridColumn = new DataGridColumn(ra.name, ra.description, '',
          ra.type.endsWith("?") ? ra.type.substr(0,ra.type.length - 1) : ra.type, ra.canSortOn, ra.collection);
        tmpColumnMaps.set(ra.name, dgc);
      }
    }
    this.columnMappings = tmpColumnMaps;
  }

  loadList(): void {
    // update the find mode from the configuration
    this.findModel = this.searchConfigurationService.setFindModel(this.findModel);
    if (this._configuration.searchType === "quick") {
      this.findModel.search = this._configuration.lastQuickSearchItems.filter;
      this.searchServiceRemote.quickSearch(this.area, this.findModel).subscribe((bookings: any) => {
        this.dataSource.data = bookings.content;
        this.resultModel = bookings;
      }, (error: any) => {
      });
    } else {
      if (this._configuration.lastAdvancedSearchItems != null) {
        // tslint:disable-next-line:max-line-length
        this.searchServiceRemote.advancedSearchByName(this.area, this.findModel, this._configuration.lastAdvancedSearchItems.name).subscribe((bookings: any) => {
          this.dataSource.data = bookings.content;
          this.resultModel = bookings;
        }, (error: any) => {
        });
      }
    }
  }

  onSortChanged(sort: Sort): void {
    this.searchConfigurationService.changeSort(this.findModel, sort);
    this.searchConfigurationService.saveFindModel(this.findModel);
    this.loadList();
  }

  onColumnOrderingChanged(columns: string[]): void  {
    this.searchConfigurationService.searchPageConfiguration.displayColumns = columns;
    this.searchConfigurationService.saveConfiguration(false);
  }

  onSelectionsChanged(selectionModel: SelectionModel<any>): void {
    this.selection = selectionModel;
  }

  onRowSelected(row: any): void  {
    this.selectedRow = row;
  }

  onHeaderActionSelected(headerActionId: string): void {
  }

  onRowActionSelected(rowActionId: string): void {
  }

  onPageChange(event: PageEvent): void {
    this.findModel.page = event.pageIndex;
    this.findModel.size = event.pageSize;
    this._configuration.page = event.pageIndex;
    this._configuration.size = event.pageSize;
    this.findModelChanged.emit(this.findModel);
    this.loadList();
  }
}
