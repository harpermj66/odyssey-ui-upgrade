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
import {ContainerLocationService} from "../../../../../../odyssey-service-library/src/lib/mandr/container-location/service/container-location.service";
import {MatSelect, MatSelectChange} from "@angular/material/select";
import {ContainerLocationVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container-location/model/container-location-vo.model";
import {ContainerLocationUtil} from "../../../../../../odyssey-service-library/src/lib/mandr/container-location/util/container-location-util";
import {InfiniteScroll} from "../../../../../../odyssey-service-library/src/lib/utils/infinite-scroll";
import {PageModel} from "../../../../../../odyssey-service-library/src/lib/model/page.model";
import {SubscriptionsManager} from "../../../../../../odyssey-service-library/src/lib/utils/subscriptions-manager";
import {Observable} from "rxjs";
import {FunctionErrorStateMatcher} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";
import {DepotVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container-location/model/depot-vo.model";
import {TerminalVoModel} from "../../../../../../odyssey-service-library/src/lib/mandr/container-location/model/terminal-vo-model";

@Component({
  selector: 'lib-container-location-lookup',
  templateUrl: './container-location-lookup.component.html',
  styleUrls: ['./container-location-lookup.component.scss'],
  providers: [
    SubscriptionsManager
  ]
})
export class ContainerLocationLookupComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {

  @ViewChild('selectList') selectElem: MatSelect;
  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() value: ContainerLocationVoModel | {depotId: number} | {terminalId: number};
  @Output() valueChange: EventEmitter<ContainerLocationVoModel | null> = new EventEmitter<ContainerLocationVoModel | null>();

  /**
   * The label to show on the selection list.
   */
  @Input() label?: string;

  /**
   * The placeholder for the selection list.
   */
  @Input() placeholder: string;

  /**
   * The type of container location to search for.
   * Defaults to all types.
   */
  @Input() type: 'terminal' | 'depot' | 'all' | undefined | null = 'all';

  /**
   * An error message to show.
   */
  @Input() error: string;

  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() required: boolean;

  filter: string;
  valueMatch = false;
  hiddenValue: ContainerLocationVoModel;
  containerLocations: ContainerLocationVoModel[] = [];

  infiniteScroll: InfiniteScroll<ContainerLocationVoModel>;
  errorMatcher = new FunctionErrorStateMatcher(this.isInvalid.bind(this));

  constructor(private containerLocationService: ContainerLocationService,
              private subscriptionsManager: SubscriptionsManager) {
    this.infiniteScroll = new InfiniteScroll<ContainerLocationVoModel>(
      pageable => {
        let obs: Observable<PageModel<ContainerLocationVoModel>>;
        if(this.type === 'terminal') {
          obs = this.containerLocationService.searchTerminals(pageable, this.filter);
        } else if(this.type === 'depot') {
          obs = this.containerLocationService.searchDepots(pageable, this.filter);
        } else {
          obs = this.containerLocationService.searchContainerLocations(pageable, this.filter);
        }
        return obs;
      },
      this.processPage.bind(this),
      this.handleError.bind(this)
    ).setPageSize(50);
  }

  ngOnInit(): void {
    this.infiniteScroll.firstPage();
  }

  ngOnDestroy(): void {
    this.infiniteScroll.destroy();
  }

  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.value && this.value) {
      this.filter = '';
      this.checkValueIsLoaded();
      this.onFilterChange();
    }

    if(changes.type) {
      this.onFilterChange();
    }
  }

  get noResults(): boolean {
    return !this.containerLocations || this.containerLocations.length === 0;
  }

  get noMatchAndRequired(): boolean {
    return !!this.value && (!!(this.value as DepotVoModel).depotId || !!(this.value as TerminalVoModel).terminalId) && !this.valueMatch;
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

  processPage(results: PageModel<ContainerLocationVoModel>): void {
    if(results.content) {
      if(results.number === 0) {
        this.containerLocations = [];
      }
      results.content.forEach(a => this.containerLocations.push(a));
    }

    this.checkValueIsLoaded();

    // Keep loading for the infinite scroll as we do not have enough loaded to have a scroll bar
    if(this.infiniteScroll.element && !this.infiniteScroll.hasScrollBar()) {
      this.infiniteScroll.nextPage();
    }
  }

  private checkValueIsLoaded(): void {
    // Check we have a matching container in the list
    this.valueMatch = false;
    if(this.value) {
      for(const toCompare of this.containerLocations) {
        if(this.compareWith(this.value as ContainerLocationVoModel, toCompare)) {
          this.valueMatch = true;
          this.value = toCompare;
          break;
        }
      }
    }
  }

  handleError(error: any): void {
  }

  onSelectChange(event: MatSelectChange): void {
    const newSelection = event.value;
    const changed = !this.compareWith(this.value as ContainerLocationVoModel, newSelection);
    this.value = newSelection;
    if (changed) {
      this.valueChange.emit(this.value as ContainerLocationVoModel);
    }
  }

  trackById(index: number, entity: any): any {
    return entity && entity.depotId ? entity.depotId : (entity && entity.terminalId ? entity.terminalId : index);
  }

  isInvalid(): boolean {
    if (this.required && (!this.value || (!(this.value as DepotVoModel).depotId && !(this.value as TerminalVoModel).terminalId))) {
      return true;
    }

    if (this.error && this.error.trim() !== '') {
      return true;
    }

    return false;
  }

  displayName(containerLocation?: ContainerLocationVoModel | {depotId: number} | {terminalId: number} ): string {
    return containerLocation ? ContainerLocationUtil.generateDisplayName(containerLocation) : '';
  }

  private compareWith(value?: ContainerLocationVoModel, toCompare?: ContainerLocationVoModel): boolean {
    return ContainerLocationUtil.areEqual(value, toCompare);
  }

  onClick(): void {
    if(!this.infiniteScroll.loading && this.noResults) {
      this.infiniteScroll.refresh();
    }
  }
}
