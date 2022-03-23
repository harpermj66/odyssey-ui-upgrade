import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CurrencyLookupRemoteService} from "../service/currency/currency-lookup-remote.service";
import {Currency} from "../model/currency";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

@Component({
  selector: 'lib-currency-lookup',
  templateUrl: './currency-lookup.component.html',
  styleUrls: ['./currency-lookup.component.css']
})
export class CurrencyLookupComponent implements OnInit {

  @Input() label = 'Currency';
  @Input() placeholder = 'Currency...';
  @Input() required = false;
  /*@Input() formControlName: string;
  @Input() formControl: any;*/

  @Output() currencySelected = new EventEmitter<Currency>();

  filteredCurrencies: Currency[] = [];
  searchString = "";
  excludedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
  timeout: any;
  debounce = 500;

  constructor(private currencyLookupRemoteService: CurrencyLookupRemoteService) { }

  ngOnInit(): void {}
  
  findCurrencies(event: KeyboardEvent): void {
    if(this.excludedKeys.includes(event.key)) { return; }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(() => {
      this.currencyLookupRemoteService.findCurrencies(this.searchString).subscribe(
          (response) => {
            this.filteredCurrencies = response;
          },
          (error) => {
            this.filteredCurrencies = [];
            console.log(error); // TODO
          },
      );
    }, this.debounce);
  }

  getCurrencyShortName(currency: Currency): string {
    return currency ? currency.shortName : '';
  }

  emitCurrency(event: MatAutocompleteSelectedEvent): void {
    this.currencySelected.emit(event.option.value)
  }



}
