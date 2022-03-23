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
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {InfiniteScroll} from "../../../../../odyssey-service-library/src/lib/utils/infinite-scroll";
import {SubscriptionsManager} from "../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {FunctionErrorStateMatcher} from "../../utils/function-error-state-matcher";
import {
  LookupResult,
  LookupService
} from '../../../../../odyssey-service-library/src/lib/lookup/service/lookup.service';
import {FilterItem} from "../../component/list-filter/list-filter.component";
import {PageModel} from "../../../../../odyssey-service-library/src/lib/model/page.model";
import {PageableModel} from "../../../../../odyssey-service-library/src/lib/model/pageable.model";
import {ResourceTypeModel} from "../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

class LookupData {
  [fieldName: string]: any;
}

@Component({
  selector: 'lib-lookup-select-one',
  templateUrl: './lookup-select-one.component.html',
  styleUrls: ['./lookup-select-one.component.scss'],
  providers: [
    SubscriptionsManager
  ]
})
export class LookupSelectOneComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  private readonly startPage = 1;

  @ViewChild('selectList') selectElem: MatSelect;
  @ViewChild('searchInput') searchInput: ElementRef;
  @ViewChild('contentWrapper') contentWrapper: ElementRef;

  value?: LookupData;
  @Output() valueChange: EventEmitter<LookupData | null> = new EventEmitter<LookupData | null>();
  @Output() valueMappedChange: EventEmitter<LookupData | null> = new EventEmitter<LookupData | null>();

  /**
   * A value to display instead of the select value, will hide the default selection input.
   * (clicking on the displayed value will open the menu).
   */
  @Input() displayValue?: string;

  @Input() openOnStart = false;
  @Input() label?: string;
  @Input() placeholder: string;
  @Input() error: string;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() required: boolean;

  pageSettings: PageableModel = {
    pageNumber: 1,
    pageSize: 200
  };

  @Input() filter: string;
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

  get hasDisplayValue(): boolean {
    return this.displayValue !== undefined;
  }

  ngOnInit(): void {
    this.infiniteScroll.firstPage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.value) {
      this.filter = '';
      this.checkValueIsLoaded();
      this.onFilterChange();
    }

    if (changes.filter) {
      this.onFilterChange();
    }
  }

  ngOnDestroy(): void {
    this.infiniteScroll.destroy();
  }

  ngAfterViewInit(): void {
    if (this.openOnStart) {
      this.selectElem.open();
    }
  }

  get noResults(): boolean {
    return !this.dataset || this.dataset.length === 0;
  }

  selectOpened(): void {
    this.filter = '';
    this.searchInput.nativeElement.focus();
    this.infiniteScroll.setElement(this.selectElem.panel.nativeElement);
    this.infiniteScroll.firstPage();
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
    return this.lookupService.lookup(this.field, this.resourceType, this.filter, this.filterItems, pageNumber, pageSize)
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

  onSelectChange(event: MatSelectChange): void {
    const newSelection = event.value;
    const changed = (!newSelection && this.value) || (newSelection && !this.value);
    this.value = newSelection;

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

      this.valueChange.emit(this.value);
    }
  }

  compareWith(a: LookupData, b: LookupData): boolean {
    return a === b || (!a && !b);
  }

  trackById(index: number, entity: LookupData): any {
    return entity && entity.contStockId ? entity.contStockId : index;
  }

  isInvalid(): boolean {
    if (this.required && !this.value) {
      return true;
    }

    return !!(this.error && this.error.trim() !== '');
  }

  private checkValueIsLoaded(): void {
    // Check we have a matching container in the list
    this.valueMatch = false;
    if (this.value) {
      for (const toCompare of this.dataset) {
        if (this.compareWith(this.value, toCompare)) {
          this.valueMatch = true;
          this.value = toCompare;
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
}
