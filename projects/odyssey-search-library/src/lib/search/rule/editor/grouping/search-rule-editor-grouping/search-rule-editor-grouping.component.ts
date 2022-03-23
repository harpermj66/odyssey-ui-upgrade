import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterItem } from "../../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import { SavedSearchModel } from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import { ResourceTypeModel } from "../../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import { GroupingRuleModel } from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/grouping/grouping-rule.model";
import { SumFieldModel } from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/grouping/sum-field.model";

@Component({
             selector: 'lib-search-rule-editor-grouping',
             templateUrl: './search-rule-editor-grouping.component.html',
             styleUrls: ['./search-rule-editor-grouping.component.css']
           })
export class SearchRuleEditorGroupingComponent implements OnInit {

  @Output() groupingChanged = new EventEmitter<boolean>();
  // tslint:disable-next-line:variable-name
  @Input() savedSearch: SavedSearchModel = new SavedSearchModel();
  @Input() filterItems: FilterItem[] = [];
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() groupingMaxItemsPopulated = false;

  readonly MAX_GROUPINGS = 1;

  groupItems: FilterItem[] = [];
  sumItems: FilterItem[] = [];

  // tslint:disable-next-line:variable-name
  _resourceType: ResourceTypeModel = new ResourceTypeModel();
  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set resourceType(value: ResourceTypeModel) {
    this._resourceType = value;
    if (value != null) {
      this.assignGroupColumns(value);
      this.assignSumColumns(value);
      this.setIsMaxGroupings();
    }
  }

  get resourceType(): ResourceTypeModel {
    return this._resourceType;
  }

  setIsMaxGroupings(): void {
    if (this.savedSearch.groupingRules != null && this.savedSearch.groupingRules.length >= this.MAX_GROUPINGS) {
      this.groupingMaxItemsPopulated = true;
      this.groupingChanged.emit(this.savedSearch.groupingRules.length === this.MAX_GROUPINGS);
    } else {
      this.groupingMaxItemsPopulated = false;
      this.groupingChanged.emit(true);
    }
  }

  assignGroupColumns(value: ResourceTypeModel): void {
    const tmp: FilterItem[] = [];
    for (const attribute of value.resourceAttributes) {
      if (attribute.displayable && !attribute.excludeFromGroupings) {
        const item = new FilterItem(attribute.description, attribute.name, attribute.type, "");
        tmp.push(item);
      }
    }
    this.groupItems = tmp;
  }

  assignSumColumns(value: ResourceTypeModel): void {
    const tmp: FilterItem[] = [];
    for (const attribute of value.resourceAttributes) {
      if (attribute.canSumOn) {
        const item = new FilterItem(attribute.description, attribute.name, attribute.type,"");
        tmp.push(item);
      }
    }
    this.sumItems = tmp;
  }

  selectGroupingField(filterItem: FilterItem): void  {
    if(!this.savedSearch.groupingRules) {
      this.savedSearch.groupingRules = [];
    }
    const groupingRule = new GroupingRuleModel();
    groupingRule.field = filterItem.fieldName;
    this.savedSearch.groupingRules.push(groupingRule);
    this.setIsMaxGroupings();
  }

  removeFromGroupingList(grouping: GroupingRuleModel): void {
    if(this.savedSearch.groupingRules) {
      const index = this.savedSearch.groupingRules?.indexOf(grouping);
      if(index >= 0) {
        this.savedSearch.groupingRules?.splice(index, 1);
      }
      this.setIsMaxGroupings();
    }
  }

  selectSumField(filterItem: FilterItem): void {
    if(!this.savedSearch.sumRules) {
      this.savedSearch.sumRules = [];
    }
    const sumField = new SumFieldModel();
    sumField.field = filterItem.fieldName;
    this.savedSearch.sumRules.push(sumField);
  }

  removeFromSumList(sumField: SumFieldModel): void {
    if(this.savedSearch.sumRules) {
      const index = this.savedSearch.sumRules?.indexOf(sumField);
      if(index >= 0) {
        this.savedSearch.sumRules?.splice(index, 1);
      }
    }
  }
}
