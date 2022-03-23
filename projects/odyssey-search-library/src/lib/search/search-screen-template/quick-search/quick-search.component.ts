import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FindModel } from "../../../../../../odyssey-service-library/src/lib/api/find-model";
import { FilterItem } from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  ActionMenu,
  DataGridColumn
} from "../../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import { MatTableDataSource } from "@angular/material/table";
import { SelectionModel } from "@angular/cdk/collections";
import { ResultModel } from "../../../../../../odyssey-service-library/src/lib/api/result-model";
import { SearchServiceRemote } from "../../search-service.remote";
import { SearchConfigurationService } from "../../search-configuration.service";
import { SearchPageConfiguration } from "../../../../../../odyssey-service-library/src/lib/search/search-page-configuration.model";
import { Sort } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SnackbarMessage } from "../../../../../../odyssey-service-library/src/lib/utils/snackbar-message";

@Component({
             selector: 'lib-quick-search',
             templateUrl: './quick-search.component.html',
             styleUrls: ['./quick-search.component.scss']
           })
export class QuickSearchComponent implements OnInit {

  @ViewChild('standardDataGridTemplateComponent') standardDataGridTemplateComponent: any;
  @Output() findModelChanged: EventEmitter<FindModel> = new EventEmitter<FindModel>();
  @Output() defaultColumnsChanged: EventEmitter<FilterItem[]> = new EventEmitter<FilterItem[]>();
  @Output() columnOrderingChanged: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() headerActionSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() rowActionSelected: EventEmitter<string> = new EventEmitter<string>();

  @Input() area = '';
  @Input() keyField = 'keyField';

  @Input() headerMenus: ActionMenu[] = [];
  @Input() rowMenus: ActionMenu[] = [];

  columnMappings: Map<string, DataGridColumn>;

  displayColumns: string[] = [];
  filterItems: FilterItem[] = [];
  noData = false;
  dataSource = new MatTableDataSource<any>();
  findModel = new FindModel ('','','',0, 15);
  selection = new SelectionModel<any>(true, []);
  selectedRow?: any;
  resultModel = new ResultModel ([], 0, this.findModel);
  loadingList = false;

  // tslint:disable-next-line:variable-name
  _configuration: SearchPageConfiguration;

  constructor(private searchServiceRemote: SearchServiceRemote,
              public searchConfigurationService: SearchConfigurationService,
              public snackbar: MatSnackBar) { }

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
    this.loadingList = true;
    this.findModel = this.searchConfigurationService.setFindModel(this.findModel);
    if (this._configuration.searchType === "quick") {
      this.findModel.search = this._configuration.lastQuickSearchItems.filter;
      this.searchServiceRemote.quickSearch(this.area, this.findModel).subscribe((bookings: any) => {
        this.dataSource.data = bookings.content;
        this.resultModel = bookings;
        this.loadingList = false;
      }, (error: any) => {
        this.loadingList = false;
        SnackbarMessage.showErrorMessage(this.snackbar,error, "Error loading quick search list: ");
      });
    } else {
      if (this._configuration.lastAdvancedSearchItems != null) {
        // tslint:disable-next-line:max-line-length
        this.searchServiceRemote.advancedSearchByName(this.area, this.findModel, this._configuration.lastAdvancedSearchItems.name).subscribe((bookings: any) => {
          this.dataSource.data = bookings.content;
          this.resultModel = bookings;

        }, (error: any) => {
          SnackbarMessage.showErrorMessage(this.snackbar,error, "Error loading advance list: ");
        });
      }
    }
  }

  onSortChanged(sort: Sort): void {
    if (sort.active.length !== 0 ) {
      this.searchConfigurationService.changeSort(this.findModel, sort);
      this.searchConfigurationService.saveFindModel(this.findModel);
    }
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
    this.headerActionSelected.emit(headerActionId);
  }

  onRowActionSelected(rowActionId: string): void {
    this.rowActionSelected.emit(rowActionId);
  }

  onPageChange(event: PageEvent): void {
    this.findModel.page = event.pageIndex;
    this.findModel.size = event.pageSize;
    this._configuration.page = event.pageIndex;
    this._configuration.size = event.pageSize;
    this.findModelChanged.emit(this.findModel);
  }

  clearSort(): void {
    this.findModel.page = 0;
    this._configuration.page = 0;
    this.findModel.sort = '';
    this.findModelChanged.emit(this.findModel);
    this.standardDataGridTemplateComponent.clearSort();
  }
}
