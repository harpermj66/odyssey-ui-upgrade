import { Component, OnInit } from '@angular/core';
import {ActionMenu} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import {UserSavedSearchRemoteService} from "../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchServiceRemote} from "../search-service.remote";

@Component({
  selector: 'lib-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.css']
})
export class QuoteComponent implements OnInit {

  headerMenus: ActionMenu[] = [
    {actionId: 'exportSelectedPDF', title: 'Export Selected Records (PDF)', enabled: true, children: [], icon: ''}];
  rowMenus: ActionMenu[] = [
    {actionId: 'editRecord', title: 'Edit', enabled: true, children: [], icon: ''},
    {actionId: 'deletedRecord', title: 'Delete', enabled: true, children: [], icon: ''}
  ];

  constructor() { }

  ngOnInit(): void {
  }


}
