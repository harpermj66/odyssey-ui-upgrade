import {
  FilterItem,
  FilterItemValues, QuickSearchHistoryItem
} from "../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {ResourceTypeModel} from "../model/resource-type.model";
import {SavedSearchModel} from "./rule/model/saved-search.model";

export class SearchPageConfiguration {

  userId: number;
  resourceTypeName: string;
  searchType: string;
  displayedFields: FilterItem[] = [];
  defaultFields: FilterItem[] = [];
  lastQuickSearchItems: FilterItemValues = new FilterItemValues();
  quickSearchItemFavourites: QuickSearchHistoryItem[] = [];
  quickSearchItemHistory: QuickSearchHistoryItem[] = [];
  lastAdvancedSearchItems: SavedSearchModel;

  page = 0;
  size = 0;
  sort = "";
  groupOn= "";
  sumOn = "";
  resourceType: ResourceTypeModel;
  displayableFields: FilterItem[];
  displayColumns: string[] = [];


  // temporary SavedSearchModel for use when building new Rules
  tempAdvanceSearchItems: SavedSearchModel;

}
