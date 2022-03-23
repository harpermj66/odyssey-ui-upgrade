import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from "@angular/core";
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {CurrencyService} from "../../../../../../odyssey-service-library/src/lib/mandr/currency/service/currency.service";
import {CurrencyVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/shared/model/currency-vo.model";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {FunctionErrorStateMatcher} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";


@Component({
  selector: 'lib-currency-lookup',
  templateUrl: './currency-lookup.component.html',
  styleUrls: ['./currency-lookup.component.scss'],
  providers: [
    SubscriptionsManager,
    DiscardingRequestQueue
  ]
})
export class CurrencyLookupComponent implements OnInit , OnChanges{

  @ViewChild('selectList') selectElem: MatSelect;
  @ViewChild('searchInput') searchInput: ElementRef;

  currencyModel: CurrencyVoModel[] = [];

  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() required: boolean;
  @Input() value?: CurrencyVoModel | {currencyId?: number};
  @Output() valueChange: EventEmitter<CurrencyVoModel | null> = new EventEmitter<CurrencyVoModel | null>();

  @Input() error?: string;
  @Input() label: string;
  matchFound = false;

  filter: string;
  shortname: string;
  @Input() placeholder: string;
  selected: CurrencyVoModel | null;
  errorMatcher = new FunctionErrorStateMatcher(this.isInvalid.bind(this));

  constructor(private currencyService: CurrencyService,
              public requestQueue: DiscardingRequestQueue) {

  }

  get noResults(): boolean {
    return !this.currencyModel || this.currencyModel.length === 0;
  }

  ngOnInit(): void {
    this.onSearchByShortName();
  }

  onFilterChange(): void {
    this.currencyModel = [];
    this.onSearchByShortName();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.value) {
      this.findMatch();
    }
  }

  private findMatch(): void {
    this.matchFound = false;
    if(this.currencyModel && this.value) {
      for(const currency of this.currencyModel) {
        if(currency.currencyId === this.value.currencyId) {
          this.value = currency;
          this.matchFound = true;
          break;
        }
      }
    }
  }

  onSearchByShortName(): void {
    this.requestQueue.makeRequest(
      this.currencyService.searchCurrencies(this.filter),
      cache =>{
        this.currencyModel = cache;
        this.findMatch();
      }
    );
  }

  onSelectChange(event: MatSelectChange): void {
    const newSelection = event.value;
    const changed = !this.compareWith(this.value as CurrencyVoModel, newSelection);
    this.value = newSelection;
    if(changed) {
      this.valueChange.emit(this.value as CurrencyVoModel);
    }
  }

  selectOpened(): void {
    this.filter = '';
    this.searchInput.nativeElement.focus();
  }

  private compareWith(value?: CurrencyVoModel, toCompare?: CurrencyVoModel): boolean  | any{
    if(value?.currencyId === toCompare?.currencyId) {
      return true;
    }

    // Handle one null
    if((!value && toCompare) || (value && !toCompare)) {
      return false;
    }
  }

  trackById(index: number, entity: CurrencyVoModel): any {
    return entity.currencyId ? entity.currencyId : index;
  }

  isInvalid(): boolean {
    if (this.required && (!this.value || !this.value.currencyId)) {
      return true;
    }

    if (this.error && this.error.trim() !== '') {
      return true;
    }

    return false;
  }

  onClick(): void {
    if(!this.requestQueue.loading && this.noResults) {
      this.onSearchByShortName();
    }
  }
}
