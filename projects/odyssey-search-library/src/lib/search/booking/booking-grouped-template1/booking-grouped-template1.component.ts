import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { SearchPageConfiguration } from "../../../../../../odyssey-service-library/src/lib/search/search-page-configuration.model";
import { FindModel } from "../../../../../../odyssey-service-library/src/lib/api/find-model";
import { ResultModel } from "../../../../../../odyssey-service-library/src/lib/api/result-model";
import { FilterItem } from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import { SearchConfigurationService } from "../../search-configuration.service";
import { DataGridColumn } from "../../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import { SearchServiceRemote } from "../../search-service.remote";

@Component({
  selector: 'lib-booking-grouped-template1',
  templateUrl: './booking-grouped-template1.component.html',
  styleUrls: ['./booking-grouped-template1.component.scss']
})
export class BookingGroupedTemplate1Component implements OnInit {

  @Output() columnOrderingChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input() area = '';

  columnMappings: Map<string, DataGridColumn>;
  // tslint:disable-next-line:variable-name
  _configuration: SearchPageConfiguration;
  displayColumns: string[] = [];
  findModel = new FindModel ('','','',0, 1000);
  resultModel = new ResultModel ([], 0, this.findModel);
  dataSource = new MatTableDataSource<any>();

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
    }
  }

  get configuration(): SearchPageConfiguration {
    return this._configuration;
  }

  setDisplayedColumns(): void  {
    // Non null displayColumns will be set by binding later and can be null
    if (this._configuration.displayColumns == null) {
      return;
    }
    const tmpDisplayColumns = [];

    // Adhere to column ordering but ignore the grouping columns.
    for (const dc of this._configuration.displayColumns) {
        tmpDisplayColumns.push(dc);
    }

    // Actually displayed columns
    this.displayColumns = tmpDisplayColumns;

    // Now load the data
    this.loadList();
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

  loadList(): void {
    this.findModel = this.searchConfigurationService.setGroupFindModel(this.findModel);
    this.searchServiceRemote.advancedSearchByName(this.area,
      this.findModel, this._configuration.lastAdvancedSearchItems.name).subscribe((bookings: any) => {
      this.dataSource.data = bookings.content;
      this.resultModel = bookings;
    }, (error: any) => {
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
}
