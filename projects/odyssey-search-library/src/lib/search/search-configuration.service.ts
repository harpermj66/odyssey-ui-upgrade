import {EventEmitter, Injectable, Output} from "@angular/core";
import {
  SearchPageConfiguration
} from "../../../../odyssey-service-library/src/lib/search/search-page-configuration.model";
import {SavedSearchModel} from "../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {
  SearchConfigurationRemoteService
} from "../../../../odyssey-service-library/src/lib/search/search-configuration-remote.service";
import {
  UserSavedSearchRemoteService
} from "../../../../odyssey-service-library/src/lib/search/rule/service/user-saved-search-remote.service";
import {
  FilterItem,
  FilterItemValues,
  QuickSearchHistoryItem
} from "../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {FindModel} from "../../../../odyssey-service-library/src/lib/api/find-model";
import {
  SearchDescription
} from "../../../../odyssey-shared-views/src/lib/search/advanced-search-toolbar/advanced-search-toolbar.component";
import {Sort} from "@angular/material/sort";
import {Observable} from "rxjs";

@Injectable()
export class SearchConfigurationService {

  static ADVANCED_SUMMARY = 'summary';
  static ADVANCED_EDIT = 'edit';
  static ADVANCED_ADD = 'add';

  static ADVANCED_VIEW_BASIC = 'basic';
  static ADVANCED_VIEW_PREPARE = 'prepare';
  static ADVANCED_VIEW_PREVIEW = 'preview';
  static ADVANCED_GROUPED_VIEW_TYPE1 = 'advancedGroupType1';

  static SEARCH_TYPE_QUICK = 'quick';
  static SEARCH_TYPE_ADVANCED = 'advanced';

  static WIZARD_CREATE_NAME_AND_SHARE_PREPARED = 'wizardNameAndSharePrepared';
  static WIZARD_CREATE_FILTER_PREPARED = 'wizardFilterPrepared';
  static WIZARD_CREATE_SORT_PREPARED = 'wizardSortPrepared';
  static WIZARD_CREATE_GROUP_TOTALS_PREPARED = 'wizardGroupTotalsPrepared';

  static WIZARD_OFFSET = 250;

  @Output() loadedConfiguration: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reloadsEmitter: EventEmitter<void> = new EventEmitter<void>();
  @Output() previewCreatedEmitter: EventEmitter<string> = new EventEmitter<string>();

  additionalOffset = 0;

  savingAdvancedSearch = false;
  searchPageConfiguration = new SearchPageConfiguration();
  savedAdvancedSearches: SavedSearchModel[] = [];
  savedAdvancedSearchNames: SearchDescription[] = [];
  selectedRule: SavedSearchModel;

  advancedWizardStatus = SearchConfigurationService.ADVANCED_SUMMARY;
  advancedListType = SearchConfigurationService.ADVANCED_VIEW_BASIC;

  constructor(
    public searchConfigurationRemoteService: SearchConfigurationRemoteService,
    public savedSearchService: UserSavedSearchRemoteService) {
  }

  loadConfiguration(resourceTypeName: string): void {
    this.searchConfigurationRemoteService.findConfiguration(resourceTypeName).subscribe((config: any) => {
        this.searchPageConfiguration = config;
        // load the saved advanced searches
        this.loadAdvancedSearches(resourceTypeName);
      }, (error: any) => {
        // Failed to load configuration
        this.loadedConfiguration.emit(false);
      }
    );
  }

  setAdvancedViewStates(): void {
    if (this.searchPageConfiguration.searchType === SearchConfigurationService.SEARCH_TYPE_ADVANCED) {
      if (this.savedAdvancedSearchNames.length === 0) {
        this.additionalOffset = SearchConfigurationService.WIZARD_OFFSET;
        this.advancedWizardStatus = SearchConfigurationService.ADVANCED_ADD;
      } else {
        this.advancedWizardStatus = SearchConfigurationService.ADVANCED_SUMMARY;
      }
    }

    if (this.searchPageConfiguration.lastAdvancedSearchItems.groupingRules != null &&
      this.searchPageConfiguration.lastAdvancedSearchItems.groupingRules.length > 0) {
      this.advancedListType = SearchConfigurationService.ADVANCED_GROUPED_VIEW_TYPE1;
    } else {
      this.advancedListType = SearchConfigurationService.ADVANCED_VIEW_BASIC;
    }
  }

  loadAdvancedSearches(resourceTypeName: string): void {
    const savedNames: SearchDescription[] = [];
    this.savedSearchService.loadAdvancedSearches(resourceTypeName).subscribe( result => {
      this.savedAdvancedSearches = result as SavedSearchModel[];
      for (const sas of this.savedAdvancedSearches) {
        const sd = new SearchDescription();
        sd.name = sas.name;
        sd.description = sas.description;
        savedNames.push(sd);
      }
      this.savedAdvancedSearchNames = savedNames;
      this.setAdvancedViewStates();
      this.loadedConfiguration.emit(true);
    });
  }

  saveQuickSearchColumns(defaultFields: FilterItem[]): void {
    this.searchPageConfiguration.displayedFields = defaultFields;
    this.saveConfiguration(false);
  }

  saveAdvancedDisplayedColumns(defaultFields: FilterItem[]): void {
    this.searchPageConfiguration.lastAdvancedSearchItems.displayedFields = defaultFields;
    this.saveConfiguration(false);
    this.savedSearchService.save(this.searchPageConfiguration.lastAdvancedSearchItems).subscribe(result => {
    });
  }

  saveFindModel(findModel: FindModel): void {
    this.searchPageConfiguration.size = findModel.size;
    this.searchPageConfiguration.page = findModel.page;
    this.searchPageConfiguration.sort = findModel.sort;
    this.saveConfiguration(true);
  }

  saveAdvancedFindModel(): Observable<any> {
    this.saveConfiguration(false);
    return this.savedSearchService.save(this.searchPageConfiguration.lastAdvancedSearchItems);
  }

  saveQuickSearch(filterItems: FilterItemValues, quickSearchComponent: any): void {
    // Reset the page number to 0 to avoid running out of data => making the user manually go back to page 0
    this.searchPageConfiguration.page = 0;
    this.searchPageConfiguration.lastQuickSearchItems = filterItems;
    this.searchPageConfiguration.lastQuickSearchItems.filter = filterItems.filter;
    this.saveHistory();
    this.saveConfiguration(false);
    quickSearchComponent.loadList();
  }

  saveHistory(): void {
    if (this.searchPageConfiguration.lastQuickSearchItems.filterItems.length > 0) {
      let summary = '';
      const operator = this.searchPageConfiguration.lastQuickSearchItems ? ' AND ' : ' OR ';
      this.searchPageConfiguration.lastQuickSearchItems.filterItems.forEach( item => {
        if (summary === '') {
          summary = item.displayName + ':' + item.fieldValue;
        } else {
          summary = summary + operator + item.displayName + ':' + item.fieldValue;
        }
      });
      this.searchPageConfiguration.quickSearchItemHistory.unshift(new QuickSearchHistoryItem(summary,
          this.searchPageConfiguration.lastQuickSearchItems) );
      this.searchPageConfiguration.quickSearchItemHistory = this.searchPageConfiguration.quickSearchItemHistory.slice(0, 20);
    }
  }

  saveAdvancedUserSearch(savedAdvancedUserSearch: SavedSearchModel, resourceTypeName: string): void {
    this.additionalOffset = 0;
    savedAdvancedUserSearch.resourceTypeName = resourceTypeName;

    if (!this.savingAdvancedSearch) {
      this.savedSearchService.save(savedAdvancedUserSearch)
        .subscribe(
          saved => {
            this.searchPageConfiguration.lastAdvancedSearchItems = saved;
            this.saveConfiguration(true);
          },
          error => {
          },
          () => {
            this.savingAdvancedSearch = false;
          }
        );
    }
  }

  saveSearchType(searchType: string): void  {
    this.searchPageConfiguration.searchType = searchType;
    this.saveConfiguration(false);
    this.setAdvancedViewStates();
  }

  saveConfiguration(reload: boolean): void {
    this.searchConfigurationRemoteService.updateConfiguration(this.searchPageConfiguration).subscribe(
        (searchPageConfiguration: SearchPageConfiguration) => {
          this.searchPageConfiguration = searchPageConfiguration;
          if (reload) {
            this.loadAdvancedSearches(this.searchPageConfiguration.resourceTypeName);
            this.reloadsEmitter.emit();
            this.advancedWizardStatus = SearchConfigurationService.ADVANCED_SUMMARY;
          }
        }, (error: any) => {
        }
    );
  }

  onRuleSelected(value: string): void {
    // Find the rule and store it
    for (const rule of this.savedAdvancedSearches) {
      if (rule.name === value) {
        this.selectedRule = rule;
        this.searchPageConfiguration.lastAdvancedSearchItems = this.selectedRule;
        this.saveConfiguration(true);
        break;
      }
    }
  }

  displayColumnsReset(displayColumns: string[]): void {
    if (this.searchPageConfiguration.searchType === SearchConfigurationService.SEARCH_TYPE_QUICK) {
      this.searchPageConfiguration.displayColumns = displayColumns;
    } else {
      this.searchPageConfiguration.lastAdvancedSearchItems.displayColumns = displayColumns;
    }
  }

  /**
   * Add remove columns according to passed values.
   */
  displayColumnsChange(displayColumns: FilterItem[]): void {
    if (this.searchPageConfiguration.searchType === SearchConfigurationService.SEARCH_TYPE_QUICK) {
      this.changeQuickDisplayColumns(displayColumns);
    } else {
      this.changeAdvancedRuleDisplayColumns(displayColumns);
    }
  }

  changeQuickDisplayColumns(displayColumns: FilterItem[]): void {
    this.searchPageConfiguration.displayedFields = displayColumns;
    const newColumns: string[] = [];
    for (const c of this.searchPageConfiguration.displayColumns) {
      let remove = false;
      for (const dc of this.searchPageConfiguration.displayedFields) {
        // Case 1 - existing column matched but is now not visible
        if (dc.fieldName === c && !dc.visible) {
          remove = true;
        }
      }
      if (!remove) {
        newColumns.push(c);
      }
    }
    for (const dc of this.searchPageConfiguration.displayedFields) {
      let displayNew = true;
      for (const c of newColumns) {
        if (c === dc.fieldName) {
          displayNew = false;
        }
      }
      if (displayNew && dc.visible) {
        // Case 2 - new column as been made visible
        newColumns.unshift(dc.fieldName);
      }
    }
    this.searchPageConfiguration.displayColumns = newColumns;
  }

  changeAdvancedRuleDisplayColumns(displayColumns: FilterItem[]): void {
    this.searchPageConfiguration.lastAdvancedSearchItems.displayedFields = displayColumns;
    const newColumns: string[] = [];
    for (const c of this.searchPageConfiguration.lastAdvancedSearchItems.displayColumns) {
      let remove = false;
      for (const dc of this.searchPageConfiguration.lastAdvancedSearchItems.displayedFields) {
        // Case 1 - existing column matched but is now not visible
        if (dc.fieldName === c && !dc.visible) {
          remove = true;
        }
      }
      if (!remove) {
        newColumns.push(c);
      }
    }
    for (const dc of this.searchPageConfiguration.lastAdvancedSearchItems.displayedFields) {
      let displayNew = true;
      for (const c of newColumns) {
        if (c === dc.fieldName) {
          displayNew = false;
        }
      }
      if (displayNew && dc.visible) {
        // Case 2 - new column as been made visible
        newColumns.unshift(dc.fieldName);
      }
    }
    this.searchPageConfiguration.lastAdvancedSearchItems.displayColumns = newColumns;
  }

  setFindModel(findModel: FindModel): FindModel {
    findModel.page = this.searchPageConfiguration.page;
    findModel.size = this.searchPageConfiguration.size;
    findModel.search = "";
    findModel.sort = this.searchPageConfiguration.sort;
    findModel.group = this.searchPageConfiguration.groupOn;
    findModel.sums = this.searchPageConfiguration.sumOn;
    return findModel;
  }

  setGroupFindModel(findModel: FindModel): FindModel {
    findModel.page = 0;
    findModel.size = 1000;
    findModel.search = "";
    findModel.sort = "";
    findModel.group = "";
    findModel.sums = "";
    return findModel;
  }

  changeSort(findModel: FindModel, sort: Sort): FindModel {
    findModel.page = 0;
    findModel.regeneratorSort(sort.active, sort.direction);
    return findModel;
  }

  saveAsQuickSearchFavourite(favouriteName: string): void {
    let duplicate = false;
    for (const {index, value} of this.searchPageConfiguration.quickSearchItemFavourites.map((value, index) => ({index, value}))) {
      if (value.title.toLowerCase() === favouriteName.toLowerCase()) {
        this.searchPageConfiguration.quickSearchItemFavourites[index] =
          new QuickSearchHistoryItem(favouriteName, this.searchPageConfiguration.lastQuickSearchItems);
        duplicate = true;
        break;
      }
    }
    if (!duplicate) {
      this.searchPageConfiguration.quickSearchItemFavourites.push(
        new QuickSearchHistoryItem(favouriteName, this.searchPageConfiguration.lastQuickSearchItems));
    }
    this.saveConfiguration(false);
  }

  prepareNewRule(savedSearch: SavedSearchModel): void {
    savedSearch.resourceTypeName = this.searchPageConfiguration.resourceTypeName;
    this.savedSearchService.prepareAdvancedSearch(savedSearch).subscribe(
      preparedSearch => {
        this.searchPageConfiguration.tempAdvanceSearchItems = preparedSearch;
        this.advancedListType = SearchConfigurationService.ADVANCED_VIEW_PREPARE;
        this.previewCreatedEmitter.emit(SearchConfigurationService.WIZARD_CREATE_NAME_AND_SHARE_PREPARED);
    });
  }

  prepareFilter(savedSearch: SavedSearchModel): void {
    savedSearch.resourceTypeName = this.searchPageConfiguration.resourceTypeName;
    this.advancedListType = SearchConfigurationService.ADVANCED_VIEW_PREVIEW;
    this.searchPageConfiguration.tempAdvanceSearchItems.searchRule = savedSearch.searchRule;
    this.previewCreatedEmitter.emit(SearchConfigurationService.WIZARD_CREATE_FILTER_PREPARED);
  }

  tryFilter(savedSearch: SavedSearchModel): void {
    this.searchPageConfiguration.tempAdvanceSearchItems = savedSearch;
    this.previewCreatedEmitter.emit(SearchConfigurationService.WIZARD_CREATE_SORT_PREPARED);
  }


  ensureGroupsAssignedToDisplayFields(savedSearch: SavedSearchModel): SavedSearchModel {
    let assigned = false;
    if (savedSearch.groupingRules && savedSearch.groupingRules.length > 0) {
      let pos = 0;
      for (const field of savedSearch.displayColumns) {
        if (field === savedSearch.groupingRules[0].field) {
          assigned = true;
          break;
        }
        pos++;
      }

      if (!assigned) {
        console.log("Assigning");
        savedSearch.displayColumns.unshift(savedSearch.groupingRules[0].field);
      } else {
        // swap found label at position pos to position 0
        if (pos > 0) {
          const tempDisplayColumns: string[] = [];
          for (let i = 0; i < pos; i++) {
            tempDisplayColumns.push(savedSearch.displayColumns[i]);
          }
          tempDisplayColumns.unshift(savedSearch.displayColumns[pos]);
          for (let i = pos + 1; i < savedSearch.displayColumns.length; i++) {
            tempDisplayColumns.push(savedSearch.displayColumns[i]);
          }

          savedSearch.displayColumns = tempDisplayColumns;
        }

      }
    }
    return savedSearch;
  }

  ensureSumsAssignedToDisplayFields(savedSearch: SavedSearchModel): SavedSearchModel  {
    if (savedSearch.sumRules != null) {
      for (const sumField of savedSearch.sumRules ) {
        let assigned = -1;
        for (let i = 0; i < savedSearch.displayColumns.length; i++) {
          const field = savedSearch.displayColumns[i];
          if (field === sumField.field) {
            assigned = i;
            break;
          }
        }
        if (assigned >= 0) {
          // Remove the sum fields so they appear on the right
          savedSearch.displayColumns.splice(assigned, 1);
        }
        savedSearch.displayColumns.push(sumField.field);
      }
    }
    return savedSearch;
  }
}
