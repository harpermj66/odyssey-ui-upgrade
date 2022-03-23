import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {SubscriptionsManager} from "../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {
  LookupResult,
  LookupService
} from '../../../../../odyssey-service-library/src/lib/lookup/service/lookup.service';
import {FilterItem} from "../../component/list-filter/list-filter.component";
import {PageableModel} from "../../../../../odyssey-service-library/src/lib/model/pageable.model";
import {ResourceTypeModel} from "../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {FunctionErrorStateMatcher} from "../../utils/function-error-state-matcher";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {InfiniteScroll} from "../../../../../odyssey-service-library/src/lib/utils/infinite-scroll";
import {PageModel} from "../../../../../odyssey-service-library/src/lib/model/page.model";
import {MatAutocomplete, MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";

class LookupData {
  [fieldName: string]: any;
}

@Component({
  selector: 'lib-lookup-autocomplete',
  templateUrl: './lookup-autocomplete.component.html',
  styleUrls: ['./lookup-autocomplete.component.scss'],
  providers: [
    SubscriptionsManager
  ]
})
export class LookupAutocompleteComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  private readonly startPage = 1;

  @ViewChild('autocompeteEle') autocompeteEle: MatAutocomplete;
  @ViewChild('searchInput') searchInput: ElementRef;

  lookupValue?: LookupData;
  @Output() lookupValueChange: EventEmitter<LookupData | null> = new EventEmitter<LookupData | null>();
  @Output() valueMappedChange: EventEmitter<LookupData | null> = new EventEmitter<LookupData | null>();

  @Input() label?: string;
  @Input() placeholder: string;
  @Input() error: string;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() required: boolean;

  @Input() panelClass?: string | null;
  @Input() inputClass?: string | null;

  pageSettings: PageableModel = {
    pageNumber: 1,
    pageSize: 200
  };

  @Input() value: string;
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  @Input() showSearch = true;

  valueMatch = false;
  dataset: LookupData[] = [];
  lookupResult: LookupResult;

  @Input() resourceType: ResourceTypeModel;
  @Input() field: string;
  @Input() filterItems?: FilterItem[];

  infiniteScroll: InfiniteScroll<LookupData>;
  errorStateMatcher = new FunctionErrorStateMatcher(this.isInvalid.bind(this));

  constructor(private lookupService: LookupService,
              private subscriptionsManager: SubscriptionsManager) {
    this.infiniteScroll = new InfiniteScroll<LookupData>(
        this.loadPage.bind(this),
        this.processPage.bind(this),
        this.handleError.bind(this),
        null,
        this.startPage
    ).setPageSize(50);
  }

  get displayFields(): string[] {
    return this.lookupResult?.lookup?.displayFields ? this.lookupResult.lookup.displayFields : [];
  }

  get panelClasses(): string {
    const classes = ["lookup-autocomplete-panel"];
    if (this.panelClass) {
      classes.push(this.panelClass);
    }
    return classes.join(" ");
  }

  ngOnInit(): void {
    this.infiniteScroll.firstPage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter) {
      this.onFilterChange();
    }
  }

  ngOnDestroy(): void {
    this.infiniteScroll.destroy();
  }

  ngAfterViewInit(): void {
  }

  get noResults(): boolean {
    return !this.dataset || this.dataset.length === 0;
  }

  selectOpened(): void {
    // Need to run this async or the panel will not exist.
    setTimeout(() => {
      this.searchInput.nativeElement.focus();
      this.infiniteScroll.setElement(this.autocompeteEle.panel.nativeElement);
    }, 100);
  }

  selectClosed(): void {
    this.infiniteScroll.setElement(null);
  }

  onFilterChange(): void {
    this.infiniteScroll.firstPage();
  }

  loadPage(pageable: PageableModel): Observable<PageModel<LookupData>> {
    const pageNumber = pageable.pageNumber ? pageable.pageNumber : 1;
    const pageSize = pageable.pageSize ? pageable.pageSize : 50;
    return this.lookupService.lookup(this.field, this.resourceType, this.value, this.filterItems, pageNumber, pageSize)
        .pipe(
            map(lookupResult => {
              this.lookupResult = lookupResult;
              // Create a fake page model with total pages always implying there are more results (as long as we get a full page back).
              // This makes sure the infinite scroll keeps refreshing
              const lastPage = lookupResult.content.length < pageSize;
              return {
                content: lookupResult.content as (LookupData[]),
                numberOfElements: lookupResult.content.length,
                number: pageNumber,
                totalPages: lastPage ? (pageNumber + 1) : (pageNumber + 2),
                totalElements: lastPage ? this.dataset.length : (this.dataset.length + (pageSize * 2))
              };
            })
        );
  }

  processPage(results: PageModel<LookupData>): void {
    if (results.content) {
      if (results.number === this.startPage) {
        this.dataset = [];
      }
      results.content.forEach(a => this.dataset.push(a));
    }

    this.checkValueIsLoaded();

    // Keep loading for the infinite scroll as we do not have enough loaded to have a scroll bar
    if (this.infiniteScroll.element && !this.infiniteScroll.hasScrollBar()) {
      this.infiniteScroll.nextPage();
    }
  }

  handleError(error: any): void {
  }

  onSelectChange(event: MatAutocompleteSelectedEvent): void {
    const newSelection = event.option?.value;
    const changed = (!newSelection && this.lookupValue) || (newSelection && !this.lookupValue) || JSON.stringify(newSelection) !== JSON.stringify(this.lookupValue);
    this.lookupValue = newSelection;

    if (changed && this.lookupResult.lookup) {

      // If we have mappings map lookup fields to model fields.
      if (newSelection) {
        const mappedObj = new LookupData();
        Object.getOwnPropertyNames(this.lookupResult.lookup.mappedFields).forEach(
            lookupField => {
              const mappedField = this.lookupResult.lookup?.mappedFields[lookupField];
              if (mappedField) {
                mappedObj[mappedField] = newSelection[lookupField];
              }
            });
        this.valueMappedChange.emit(mappedObj);
      } else {
        this.valueMappedChange.emit(null);
      }

      this.value = newSelection ? this.displayFields.map(displayField => newSelection[displayField]).join(' | ') : '';
      this.lookupValueChange.emit(this.lookupValue);
    }
  }

  compareWith(a: LookupData, b: LookupData): boolean {
    return a === b || (!a && !b);
  }

  trackById(index: number, entity: LookupData): any {
    return entity && entity.contStockId ? entity.contStockId : index;
  }

  isInvalid(): boolean {
    if (this.required && !this.lookupValue) {
      return true;
    }

    return !!(this.error && this.error.trim() !== '');
  }

  private checkValueIsLoaded(): void {
    // Check we have a matching container in the list
    this.valueMatch = false;
    if (this.lookupValue) {
      for (const toCompare of this.dataset) {
        if (this.compareWith(this.lookupValue, toCompare)) {
          this.valueMatch = true;
          this.lookupValue = toCompare;
          break;
        }
      }
    }
  }

  onClick(): void {
    if (!this.infiniteScroll.loading && this.noResults) {
      this.infiniteScroll.refresh();
    }
  }

  onValueChanged(): void {
    this.valueChange.emit(this.value);
    this.onFilterChange();
  }
}
