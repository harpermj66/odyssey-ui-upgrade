import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {SearchConfigurationService} from "../search-configuration.service";
import {
  FilterItem,
  FilterItemValues
} from "../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {SavedSearchModel} from "../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {FindModel} from "../../../../../odyssey-service-library/src/lib/api/find-model";
import {
  SearchConfigurationRemoteService
} from "../../../../../odyssey-service-library/src/lib/search/search-configuration-remote.service";
import {
  ActionMenu
} from "../../../../../odyssey-shared-views/src/lib/datagrid/standard-data-grid-template/standard-data-grid-template.component";
import {
  RightViewEvent,
  RightViewEventType,
  SlideOutRightViewSubscriberService
} from "../../../../../odyssey-home/src/app/home/slide-out-right-view/slide-out-right-view-subscriber.service";
import {Subscription} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'lib-screen-template',
  templateUrl: './search-screen-template.component.html',
  styleUrls: ['./search-screen-template.component.scss'],
  providers: [SearchConfigurationService, SearchConfigurationRemoteService]
})
export class SearchScreenTemplateComponent implements OnInit, OnDestroy {

  @ViewChild('quickSearchComponent') quickSearchComponent: any;
  @ViewChild('advancedSearchComponent') advancedSearchComponent: any;

  @Output() headerActionSelected: EventEmitter<string> = new EventEmitter<string>();
  @Output() rowActionSelected: EventEmitter<string> = new EventEmitter<string>();

  @Input() resourceTypeName = '';
  @Input() area = '';
  @Input() title = '';
  @Input() addLabel = '';
  @Input() keyField = '';

  @Input() headerMenus: ActionMenu[] = [];
  @Input() rowMenus: ActionMenu[] = [];

  configurationLoading = true;
  showWorkInProgress = false;

  reloadsSubscriber: Subscription | undefined;

  constructor(
              public searchConfigurationService: SearchConfigurationService,
              public slideOutRightViewSubscriberService: SlideOutRightViewSubscriberService,
              public snackBar: MatSnackBar) { }

  ngOnInit(): void {

    this.searchConfigurationService.loadedConfiguration.subscribe(success => {
      if (success) {
        this.configurationLoading = false;
        this.subscribeToReloadsEmitter();
      } else {
        this.showWorkInProgress = true;
      }
    }, (error: any) => {

    });
    this.searchConfigurationService.loadConfiguration(this.resourceTypeName);
  }

  ngOnDestroy(): void {
    if (this.reloadsSubscriber) {
      this.reloadsSubscriber.unsubscribe();
    }
  }

  subscribeToReloadsEmitter(): void {
    if (!this.reloadsSubscriber) {
      this.reloadsSubscriber = this.searchConfigurationService.reloadsEmitter.subscribe( value => {
        if (this.quickSearchComponent) {
          this.quickSearchComponent.setDisplayedColumns();
          this.quickSearchComponent.loadList();
        } else {
          this.advancedSearchComponent.setDisplayedColumns();
          this.advancedSearchComponent.loadList();
        }
      });
    }
  }

  onQuickSearchFilterChanged(filterItems: FilterItemValues): void {
    this.searchConfigurationService.saveQuickSearch(filterItems, this.quickSearchComponent);
  }

  onAddRule(): void {
    this.searchConfigurationService.additionalOffset = SearchConfigurationService.WIZARD_OFFSET;
    this.searchConfigurationService.advancedWizardStatus = SearchConfigurationService.ADVANCED_ADD;
    this.searchConfigurationService.advancedListType = SearchConfigurationService.ADVANCED_VIEW_PREPARE;
  }

  onEditRule(): void {
    this.searchConfigurationService.additionalOffset = SearchConfigurationService.WIZARD_OFFSET;
    this.searchConfigurationService.advancedWizardStatus = SearchConfigurationService.ADVANCED_EDIT;
  }

  onAdvancedSearchFilterChanged(savedSearchModel: SavedSearchModel): void  {
    this.searchConfigurationService.additionalOffset = 0;
    if (this.searchConfigurationService.advancedListType === SearchConfigurationService.ADVANCED_VIEW_PREVIEW) {
      savedSearchModel = this.searchConfigurationService.searchPageConfiguration.tempAdvanceSearchItems;
    }

    if (savedSearchModel.groupingRules != null && savedSearchModel.groupingRules.length !== 0) {
      this.searchConfigurationService.advancedWizardStatus = 'groupType1';
    } else {
      this.searchConfigurationService.advancedWizardStatus = 'list';
    }

    this.searchConfigurationService.saveAdvancedUserSearch(savedSearchModel, this.resourceTypeName);
  }

  onColumnsReset(items: string[]): void {
    this.searchConfigurationService.displayColumnsReset(items);
  }

  onColumnVisibilityChanged(items: FilterItem[]): void {
    // Execute the change
    this.searchConfigurationService.displayColumnsChange(items);
    // Update the display
    if (this.quickSearchComponent) {
      this.quickSearchComponent.setDisplayedColumns();
      // Save the default columns
      this.searchConfigurationService.saveQuickSearchColumns(items);
    } else {
      this.advancedSearchComponent.setDisplayedColumns();
      // Save the default columns
      this.searchConfigurationService.saveAdvancedDisplayedColumns(items);
    }
  }

  onSearchTypeChange(value: string): void  {
    this.searchConfigurationService.saveSearchType(value);
    this.searchConfigurationService.loadAdvancedSearches(this.resourceTypeName);
    this.searchConfigurationService.setAdvancedViewStates();
  }

  onFindModelChanged(findModel: FindModel): void {
    this.searchConfigurationService.saveFindModel(findModel);
  }

  onHeaderActionSelected(id: string): void {
    this.headerActionSelected.emit(id);
  }

  onRowActionSelected(id: string): void {
    this.rowActionSelected.emit(id);
  }

  onSaveFavourite(favouriteName: string): void {
    this.searchConfigurationService.saveAsQuickSearchFavourite(favouriteName);
  }

  onManageFavourites(): void {
    this.slideOutRightViewSubscriberService.openView(new RightViewEvent(RightViewEventType.Open, "Manage Quick Search Favourites", "ManageQuickSearchFavourites",
      [this.resourceTypeName, this.searchConfigurationService.searchPageConfiguration.userId]));
  }

  onManageHistory(): void {

  }

  onCancelEdits(): void {
    this.searchConfigurationService.additionalOffset = 0;
    if (this.searchConfigurationService.savedAdvancedSearchNames.length === 0) {
      this.onSearchTypeChange(SearchConfigurationService.SEARCH_TYPE_QUICK);
    } else {
      this.searchConfigurationService.loadConfiguration(this.resourceTypeName);
      this.searchConfigurationService.advancedWizardStatus = 'summary';
      this.searchConfigurationService.loadAdvancedSearches(this.resourceTypeName);
      this.searchConfigurationService.setAdvancedViewStates();
    }

  }

  onSortCleared(): void {
    this.searchConfigurationService.searchPageConfiguration.sort = "";
    this.searchConfigurationService.saveConfiguration(true);
    this.quickSearchComponent.clearSort();
  }
}
