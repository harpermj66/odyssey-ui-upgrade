import { Component, OnInit } from '@angular/core';
import {UserSavedSearchRemoteService} from "../../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchServiceRemote} from "../../search-service.remote";
import {SavedSearchHistoryService} from "../../../../../../odyssey-service-library/src/lib/search/rule/history/service/saved-search-history.service";

@Component({
  selector: 'lib-freight-invoice-wrapper',
  templateUrl: './freight-invoice-wrapper.component.html',
  styleUrls: ['./freight-invoice-wrapper.component.css'],
  providers: [UserSavedSearchRemoteService, SearchServiceRemote, SavedSearchHistoryService]
})
export class FreightInvoiceWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
