import { Component, OnInit } from '@angular/core';
import {UserSavedSearchRemoteService} from "../../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchServiceRemote} from "../../search-service.remote";
import {SavedSearchHistoryService} from "../../../../../../odyssey-service-library/src/lib/search/rule/history/service/saved-search-history.service";

@Component({
  selector: 'lib-shipping-instruction-wrapper',
  templateUrl: './shipping-instruction-wrapper.component.html',
  styleUrls: ['./shipping-instruction-wrapper.component.css'],
  providers: [UserSavedSearchRemoteService, SearchServiceRemote, SavedSearchHistoryService]
})
export class ShippingInstructionWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
