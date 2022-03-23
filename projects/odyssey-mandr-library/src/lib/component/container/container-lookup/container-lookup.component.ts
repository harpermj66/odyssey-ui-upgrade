import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ContainerService} from "../../../../../../odyssey-service-library/src/lib/mandr/container/service/container.service";
import {PageableModel} from "../../../../../../odyssey-service-library/src/lib/model/pageable.model";
import {ContainerStockVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container/model/container-stock-vo.model";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {InfiniteScroll} from "../../../../../../odyssey-service-library/src/lib/utils/infinite-scroll";
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {PageModel} from "../../../../../../odyssey-service-library/src/lib/model/page.model";
import {FunctionErrorStateMatcher} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";

@Component({
  selector: 'lib-container-lookup',
  templateUrl: './container-lookup.component.html',
  styleUrls: ['./container-lookup.component.scss'],
  providers: [
    SubscriptionsManager
  ]
})
export class ContainerLookupComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {

  @ViewChild('selectList') selectElem: MatSelect;
  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() value?: ContainerStockVoModel;
  @Output() valueChange: EventEmitter<ContainerStockVoModel | null> = new EventEmitter<ContainerStockVoModel | null>();

  @Input() label?: string;
  @Input() placeholder: string;
  @Input() error: string;
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() required: boolean;

  @Input() pageSettings: PageableModel = {
    pageNumber: 0,
    pageSize: 200
  };

  filter: string;
  valueMatch = false;
  containers: ContainerStockVoModel[] = [];

  infiniteScroll: InfiniteScroll<ContainerStockVoModel>;
  errorStateMatcher = new FunctionErrorStateMatcher(this.isInvalid.bind(this));

  constructor(private containerService: ContainerService,
              private subscriptionsManager: SubscriptionsManager) {
    this.infiniteScroll = new InfiniteScroll<ContainerStockVoModel>(
      pageable => this.containerService.searchContainers(pageable, this.filter),
      this.processPage.bind(this),
      this.handleError.bind(this)
    ).setPageSize(50);
  }

  ngOnInit(): void {
    this.infiniteScroll.firstPage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.value) {
      this.filter = '';
      this.checkValueIsLoaded();
      this.onFilterChange();
    }
  }

  ngOnDestroy(): void {
    this.infiniteScroll.destroy();
  }

  ngAfterViewInit(): void {
  }

  get noResults(): boolean {
    return !this.containers || this.containers.length === 0;
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

  processPage(results: PageModel<ContainerStockVoModel>): void {
    if(results.content) {
      if(results.number === 0) {
        this.containers = [];
      }
      results.content.forEach(a => this.containers.push(a));
    }

    this.checkValueIsLoaded();

    // Keep loading for the infinite scroll as we do not have enough loaded to have a scroll bar
    if(this.infiniteScroll.element && !this.infiniteScroll.hasScrollBar()) {
      this.infiniteScroll.nextPage();
    }
  }

  handleError(error: any): void {
  }

  onSelectChange(event: MatSelectChange): void {
    const newSelection = event.value;
    const changed = ((!newSelection && this.value) || (newSelection && !this.value)
      || (newSelection && this.value && newSelection.contStockId !== this.value.contStockId));
    this.value = newSelection;
    if(changed) {
      this.valueChange.emit(this.value);
    }
  }

  compareWith(a: ContainerStockVoModel, b: ContainerStockVoModel): boolean {
    return a === b || (!a && !b) || (a && b && a.contStockId === b.contStockId);
  }

  trackById(index: number, entity: ContainerStockVoModel): any {
    return entity && entity.contStockId ? entity.contStockId : index;
  }

  isInvalid(): boolean {
    if(this.required && (!this.value || !this.value.contStockId)) {
      return true;
    }

    if(this.error && this.error.trim() !== '') {
      return true;
    }

    return false;
  }

  private checkValueIsLoaded(): void {
    // Check we have a matching container in the list
    this.valueMatch = false;
    if(this.value) {
      for(const toCompare of this.containers) {
        if(this.compareWith(this.value, toCompare)) {
          this.valueMatch = true;
          this.value = toCompare;
          break;
        }
      }
    }
  }

  onClick(): void {
    if(!this.infiniteScroll.loading && this.noResults) {
      this.infiniteScroll.refresh();
    }
  }
}
