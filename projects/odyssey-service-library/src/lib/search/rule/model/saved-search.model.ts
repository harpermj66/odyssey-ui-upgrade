import {AbstractSearchRuleModel} from "./search-rule.model";
import {MultiSearchRuleModel} from "./multi-search-rule.model";
import {SortRuleModel} from "./sort/sort-rule.model";
import {GroupingRuleModel} from "./grouping/grouping-rule.model";
import {SumFieldModel} from "./grouping/sum-field.model";
import {FilterItem} from "../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";

export class SavedSearchModel {
  id: string;
  userId: number;
  resourceTypeName: string;
  name: string;
  description: string;
  shareLocally = false;
  shareAll = false;
  createdDate: Date;
  updatedDate: Date;

  searchRule: AbstractSearchRuleModel | null = new MultiSearchRuleModel();
  sortRules: SortRuleModel[] | null = [];
  groupingRules: GroupingRuleModel[] | null = [];
  sumRules: SumFieldModel[] | null = [];

  displayedFields: FilterItem[];
  defaultFields: FilterItem[];
  displayColumns: string[];

  page: number;
  size: number;
}
