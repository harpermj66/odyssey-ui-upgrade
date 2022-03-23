import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ActionMenu,
  DataGridColumn
} from "../../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import { SearchPageConfiguration } from "../../../../../../odyssey-service-library/src/lib/search/search-page-configuration.model";
import { FindModel } from "../../../../../../odyssey-service-library/src/lib/api/find-model";
import { ResultModel } from "../../../../../../odyssey-service-library/src/lib/api/result-model";
import { MatTableDataSource } from "@angular/material/table";
import { SearchServiceRemote } from "../../search-service.remote";
import { SearchConfigurationService } from "../../search-configuration.service";
import { FilterItem } from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'lib-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})
export class AdvancedSearchComponent implements OnInit {

  @Output() columnOrderingChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input() area = '';
  @Input() keyField = '';
  @Input() headerMenus: ActionMenu[] = [];
  @Input() rowMenus: ActionMenu[] = [];

  columnMappings: Map<string, DataGridColumn>;
  // tslint:disable-next-line:variable-name
  _configuration: SearchPageConfiguration;
  displayColumns: string[] = [];
  findModel = new FindModel ('','','',0, 1000);
  resultModel = new ResultModel ([], 0, this.findModel);
  dataSource = new MatTableDataSource<any>();
  loadingList = false;

  constructor(private searchServiceRemote: SearchServiceRemote,
              public searchConfigurationService: SearchConfigurationService) { }

  ngOnInit(): void {

    this.searchConfigurationService.previewCreatedEmitter.subscribe( value => {
      if (value === SearchConfigurationService.WIZARD_CREATE_FILTER_PREPARED ||
          value === SearchConfigurationService.WIZARD_CREATE_SORT_PREPARED) {
        this.setNonGroupedDisplayedColumns();
        this.createColumnMappings();
        this.loadTemporaryList();
      } else if (value === SearchConfigurationService.WIZARD_CREATE_GROUP_TOTALS_PREPARED) {

      }
    });
  }

  @Input()
  set configuration(value: SearchPageConfiguration) {
    this._configuration = value;
    if (value != null && value.lastAdvancedSearchItems != null) {
      this.setDisplayedColumns();
      this.createColumnMappings();
      this.loadList();
    }
  }

  get configuration(): SearchPageConfiguration {
    return this._configuration;
  }

  setNonGroupedDisplayedColumns(): void {
    // Load the display columns in the correct order (implicit in displayColumn ordering)
    const tmpDisplayColumns = ['select'];
    for (const dc of this._configuration.tempAdvanceSearchItems.displayColumns) {
      tmpDisplayColumns.push(dc);
    }
    this.displayColumns = tmpDisplayColumns;

    tmpDisplayColumns.push('buttons');

    // Assign and load list
    this.displayColumns = tmpDisplayColumns;
  }

  setDisplayedColumns(): void  {
    // Non null displayColumns will be set by binding later and can be null
    if (this._configuration.lastAdvancedSearchItems.displayColumns == null) {
      return;
    }
    // Adhere to column ordering but ignore the grouping columns.
    const tmpDisplayColumns = ['select'];
    for (const dc of this._configuration.lastAdvancedSearchItems.displayColumns) {
        tmpDisplayColumns.push(dc);
    }
    tmpDisplayColumns.push('buttons');

    // Actually displayed columns
    this.displayColumns = tmpDisplayColumns;
  }

  createColumnMappings(): void {
    const tmpColumnMaps: Map<string,DataGridColumn> = new Map<string, DataGridColumn>();
    for (const ra of this.configuration.resourceType.resourceAttributes) {
        const dgc: DataGridColumn = new DataGridColumn(
          ra.name, ra.description, '',  ra.type.endsWith("?") ? ra.type.substr(0,ra.type.length - 1) : ra.type, ra.canSortOn, ra.collection
        );
        tmpColumnMaps.set(ra.name, dgc);
    }
    this.columnMappings = tmpColumnMaps;
  }

  loadTemporaryList(): void {
    this.loadingList = true;
    if (this.searchConfigurationService.searchPageConfiguration.tempAdvanceSearchItems.groupingRules?.length === 0) {
      this.findModel.size = 50;
    }
    this.searchServiceRemote.tryAdvancedSearch(
      this.area, this.searchConfigurationService.searchPageConfiguration.tempAdvanceSearchItems).subscribe((items: any) => {
        this.loadingList = false;
        this.dataSource.data = items.content;
        this.resultModel = items.content;
    }, (error: any) => {
        this.loadingList = false;
    });
  }

  loadList(): void {
    this.loadingList = true;
    this.findModel = this.searchConfigurationService.setGroupFindModel(this.findModel);
    this.searchServiceRemote.advancedSearchByName(this.area,
      this.findModel, this._configuration.lastAdvancedSearchItems.name).subscribe((bookings: any) => {
      this.dataSource.data = bookings.content;
      this.resultModel = bookings;
      this.loadingList = false;
    }, (error: any) => {
        this.loadingList = false;
    });
  }


  displayColumnsChange(displayColumns: FilterItem[]): void {
    // Adding to front or splicing
    this._configuration.displayedFields = displayColumns;
    const newColumns: string[] = [];
    for (const c of this._configuration.displayColumns) {
      let remove = false;
      for (const dc of this._configuration.displayedFields) {
        // Case 1 - existing column matched but is now not visible
        if (dc.fieldName === c && !dc.visible) {
          remove = true;
        }
      }
      if (!remove) {
        newColumns.push(c);
      }
    }
    for (const dc of this._configuration.displayedFields) {
      let displayNew = true;
      for (const c of newColumns) {
        if (c === dc.fieldName) {
          displayNew = false;
        }
      }
      if (displayNew && dc.visible) {
        // Case 2 - new column as been made visible
        newColumns.unshift(dc.fieldName);
      }
    }
    this._configuration.displayColumns = newColumns;
    this.setDisplayedColumns();
  }

  onPageChange(event: PageEvent): void {
    this.findModel.page = event.pageIndex;
    this.findModel.size = event.pageSize;
    this.searchConfigurationService.searchPageConfiguration.lastAdvancedSearchItems.page = event.pageIndex;
    this.searchConfigurationService.searchPageConfiguration.lastAdvancedSearchItems.size = event.pageSize;
    this.searchConfigurationService.saveAdvancedFindModel().subscribe(result => {
      this.loadList();
    });
  }

  onColumnOrderingsChange(cols: string[]): void {
    this.searchConfigurationService.searchPageConfiguration.lastAdvancedSearchItems.displayColumns = cols;
    this.searchConfigurationService.saveConfiguration(false);
  }
}
