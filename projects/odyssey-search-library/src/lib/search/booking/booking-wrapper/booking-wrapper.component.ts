import { Component, OnInit } from '@angular/core';
import {UserSavedSearchRemoteService} from "../../../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchServiceRemote} from "../../search-service.remote";
import {SavedSearchHistoryService} from "../../../../../../odyssey-service-library/src/lib/search/rule/history/service/saved-search-history.service";

@Component({
  selector: 'lib-booking-wrapper',
  templateUrl: './booking-wrapper.component.html',
  styleUrls: ['./booking-wrapper.component.css'],
  providers: [UserSavedSearchRemoteService, SearchServiceRemote, SavedSearchHistoryService]
})
export class BookingWrapperComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
