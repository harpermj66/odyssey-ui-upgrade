import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BookingSearchRemoteService} from "../../../../../odyssey-service-library/src/lib/search/booking-search-remote.service";
import {
  FilterItem,
  FilterItemValues
} from "../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {FindModel} from "../../../../../odyssey-service-library/src/lib/api/find-model";
import {MatDialog} from "@angular/material/dialog";
import {SavedSearchModel} from "../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {UserSavedSearchRemoteService} from "../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchConfigurationService} from "../search-configuration.service";
import {ActionMenu} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";

@Component({
  selector: 'lib-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  constructor(){}

  headerMenus: ActionMenu[] = [
    {actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: ''}];
  rowMenus: ActionMenu[] = [
    {actionId: 'editRecord', title: 'Edit', enabled: true, children: [], icon: ''},
    {actionId: 'deletedRecord', title: 'Delete', enabled: true, children: [], icon: ''}
  ];

  ngOnInit(): void {
  }

  onHeaderActionSelected(id: string): void {
    console.log(id);
  }

  onRowActionSelected(id: string): void {
    console.log(id);
  }

}
