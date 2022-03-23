import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Observable} from "rxjs";
import {FilterItem} from "../../component/list-filter/list-filter.component";
import {SavedSearchModel} from "../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {SavedSearchHistoryService} from "../../../../../odyssey-service-library/src/lib/search/rule/history/service/saved-search-history.service";
import {ResourceTypeModel} from "../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {MatSelectChange} from "@angular/material/select";

const NO_AVAILABLE_SEARCH = 'There are no available searches. Please create one using the + icon opposite.';
const AVAILABLE_NO_SELECTION = 'Please select a search or create your own using the + icon opposite.';
const SELECTED = 'Using search rule.';

export class SearchDescription {
  name: string;
  description: string;
}

@Component({
  selector: 'lib-advanced-search-toolbar',
  templateUrl: './advanced-search-toolbar.component.html',
  styleUrls: ['./advanced-search-toolbar.component.scss']
})
export class AdvancedSearchToolbarComponent implements OnInit, OnChanges {

  @Input() resourceType?: ResourceTypeModel;

  @Output() editRule = new EventEmitter<void>();
  @Output() addRule = new EventEmitter<void>();
  @Output() ruleSelected = new EventEmitter<string>();

  _savedSearches: SavedSearchModel[] = [];

  searchControl = new FormControl();
  availableItems: Observable<string>;

  _filterItems: FilterItem[];
  _lastAdvancedSearchItems: SavedSearchModel;

  saveSearches = false;
  selectedSearch = false;

  message = NO_AVAILABLE_SEARCH;

  favouritesMap: { [searchId: string]: boolean } = {};

  history: SavedSearchModel[] = [];
  favourites: SavedSearchModel[] = [];
  notInFavourites: SavedSearchModel[] = [];

  favouritesFiltered: SavedSearchModel[] = [];
  notInFavouritesFiltered: SavedSearchModel[] = [];

  selectFilter = '';

  constructor(private historyService: SavedSearchHistoryService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.resourceType) {
      this.loadFavourites();
    }
  }

  @Input()
  set lastAdvancedSearchItems(value: SavedSearchModel) {
    this._lastAdvancedSearchItems = value;
    if (value != null) {
      this.message = SELECTED;
      this.selectedSearch = true;
      this.searchControl.setValue(value.name);
    }
  }

  get lastAdvancedSearchItems(): SavedSearchModel {
    return this._lastAdvancedSearchItems;
  }

  @Input()
  set savedSearches(value: SavedSearchModel[]) {
    this._savedSearches = value;
    if (value != null && value.length > 0) {
      this.saveSearches = true;
      if (this.lastAdvancedSearchItems == null && this.message !== SELECTED) {
        this.message = AVAILABLE_NO_SELECTION;
      } else {
        this.message = SELECTED;
      }

    } else {
      this._savedSearches = [];
      this.saveSearches = false;
      this.message = NO_AVAILABLE_SEARCH;
    }

    this.filterOutFavourites();
    this.loadFavourites();
  }

  get savedSearches(): SavedSearchModel[] {
    return this._savedSearches;
  }

  @Input()
  set filterItems(fields: FilterItem[]) {
    if (fields != null) {
      this._filterItems = fields;

    }
  }

  get filterItems(): FilterItem[] {
    return this._filterItems;
  }

  private _filter(value: string): FilterItem[] {
    const filterValue = value;
    return this._filterItems.filter(option => option.displayName.indexOf(filterValue) === 0);
  }

  loadHistory(): void {
    const resourceTypeName = this.resourceType?.resourceName;

    if (resourceTypeName != null) {
      this.historyService.getSavedSearchHistoryEntries(resourceTypeName, {
        pageSize: 10
      }).subscribe(
        history => {
          if (history.content) {
            this.history = history.content;
          }
        }
      );
    }
  }

  loadFavourites(): void {
    const resourceTypeName = this.resourceType?.resourceName;

    if (resourceTypeName != null) {
      this.historyService.getFavouriteSavedSearches(resourceTypeName, {
        pageSize: 200
      }).subscribe(
        favourites => {
          if (favourites.content) {
            this.favourites = favourites.content;

            this.favouritesMap = {};
            this.favourites.forEach(fav => {
              this.favouritesMap[fav.id] = true;
            });
          } else {
            this.favourites = [];
          }

          this.filterOutFavourites();
        }
      );
    }
  }

  onAddRule(): void {
    this.addRule.emit();
  }

  onEditRule(): void {
    this.editRule.emit();
  }

  onFavourite(): void {
    this.historyService.favourite(this.lastAdvancedSearchItems).subscribe(() => {
      this.favouritesMap[this.lastAdvancedSearchItems.id] = true;
      this.loadFavourites();
    });
  }

  onUnfavourite(): void {
    this.historyService.unfavourite(this.lastAdvancedSearchItems).subscribe(() => {
      this.favouritesMap[this.lastAdvancedSearchItems.id] = false;
      this.loadFavourites();
    });
  }

  onSelectionChange(event: MatSelectChange): void {
    const selectedId: string = event.value as string;
    if (selectedId) {
      const selected = this.savedSearches.concat(this.favourites).filter(s => s.id === selectedId);
      if (selected.length > 0) {
        this.ruleSelected.emit(selected[0].name);
        this.history.unshift(selected[0]);
        this.selectedSearch = true;
      }
    }
  }

  private filterOutFavourites(): void {
    // Get a list of the searches that are not favourited so we can list them separately.
    const favouriteIds = this.favourites.map(s => s.id);
    this.notInFavourites = this.savedSearches.filter(s => !favouriteIds.includes(s.id));

    this.onSelectFilterChange();
  }

  onSelectFilterChange(): void {
    if (this.selectFilter && this.selectFilter.trim() !== '') {
      const filter = this.selectFilter.toLowerCase();
      this.favouritesFiltered = this.favourites.filter(s => this.filterSavedSearch(s, filter));
      this.notInFavouritesFiltered = this.notInFavourites.filter(s => this.filterSavedSearch(s, filter));
    } else {
      this.favouritesFiltered = this.favourites;
      this.notInFavouritesFiltered = this.notInFavourites;
    }
  }

  private filterSavedSearch(savedSearch: SavedSearchModel, filter: string): boolean {
    const name = savedSearch.name ? savedSearch.name.toLowerCase() : '';
    return name.includes(filter);
  }
}
