import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {UserSavedSearchRemoteService} from "../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {SearchConfigurationService} from "./search-configuration.service";
import {SearchServiceRemote} from "./search-service.remote";
import {SavedSearchHistoryService} from "../../../../odyssey-service-library/src/lib/search/rule/history/service/saved-search-history.service";

@Component({
  selector: 'lib-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [UserSavedSearchRemoteService, SearchServiceRemote, SavedSearchHistoryService]
})
export class SearchComponent implements OnInit {

  static QUOTE = 'Quote';
  static SERVICE_CONTRACT = 'Service Contract';
  static BOOKING = 'Booking';
  static SI = 'Shipping Instruction';
  static FREIGHT_INVOICE = 'Freight Invoice';
  static C_NOTE = 'Credit Note';
  static DA = 'Disbursement Account';

  static QUOTE_ROUTE = 'quote';
  static SERVICE_CONTRACT_ROUTE = 'service-contracts';
  static BOOKING_ROUTE = 'booking';
  static SI_ROUTE = 'shipping-instructions';
  static FREIGHT_INVOICE_ROUTE = 'freight-invoices';
  static C_NOTE_ROUTE = 'credit-notes';
  static DA_ROUTE = 'disbursement-accounts';

  @Output() searchChanged: EventEmitter<void> = new EventEmitter<void>();

  showSearchOptions = true;

  links = [
    SearchComponent.QUOTE, SearchComponent.SERVICE_CONTRACT,
    SearchComponent.BOOKING, SearchComponent.SI, SearchComponent.FREIGHT_INVOICE, SearchComponent.C_NOTE,
    SearchComponent.DA
  ];

  activeLink = this.links[0];

  selectedSearchType = SearchConfigurationService.SEARCH_TYPE_QUICK;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.setSearchPage(SearchComponent.QUOTE_ROUTE);
  }

  setSearchPage(route: string): void {
    this.router.navigate(['/welcome/search/' + route], {
      queryParams: {viewStatus: 'add'}
    });
  }

  onActivateLink(value: string): void {

    if (this.activeLink === value) {
      return;
    }

    this.activeLink = value;

    switch (this.activeLink) {
      case SearchComponent.QUOTE:
        this.setSearchPage(SearchComponent.QUOTE_ROUTE);
        break;
      case SearchComponent.SERVICE_CONTRACT:
        this.setSearchPage(SearchComponent.SERVICE_CONTRACT_ROUTE);
        break;
      case SearchComponent.BOOKING:
        this.setSearchPage(SearchComponent.BOOKING_ROUTE);
        break;
      case SearchComponent.SI:
        this.setSearchPage(SearchComponent.SI_ROUTE);
        break;
      case SearchComponent.FREIGHT_INVOICE:
        this.setSearchPage(SearchComponent.FREIGHT_INVOICE_ROUTE);
        break;
      case SearchComponent.C_NOTE:
        this.setSearchPage(SearchComponent.C_NOTE_ROUTE);
        break;
      case SearchComponent.DA:
        this.setSearchPage(SearchComponent.DA_ROUTE);
    }
  }

  onSearchTypeReceived(searchType: string): void {
    this.selectedSearchType = searchType;
  }

}
