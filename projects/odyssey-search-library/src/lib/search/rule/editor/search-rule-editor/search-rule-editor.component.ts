import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  FilterItem
} from "../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  SavedSearchModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {ResourceTypeModel} from "../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {
  MultiSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/multi-search-rule.model";
import {
  FieldSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/field-search-rule.model";
import {
  StringMatcherModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/string-matcher.model";
import {
  DateMatcherModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/date-matcher.model";
import {
  NumberMatcherModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/number-matcher.model";
import {SearchConfigurationService} from "../../../search-configuration.service";

@Component({
             selector: 'lib-search-rule-editor',
             templateUrl: './search-rule-editor.component.html',
             styleUrls: ['./search-rule-editor.component.scss']
           })
export class SearchRuleEditorComponent implements OnInit, OnChanges {

  @Output() cancelEdits: EventEmitter<void> = new EventEmitter<void>();
  @Output() saveEdits: EventEmitter<SavedSearchModel> = new EventEmitter<SavedSearchModel>();

  @Input() savedSearch: SavedSearchModel = new SavedSearchModel();
  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() isFirstRule = false;

  @Input() resourceType: ResourceTypeModel = new ResourceTypeModel();
  @Input() area = '';

  nameAndShareValid = false;
  createFilterValid = false;
  setSortOrderValid = true;
  groupsAndTotalsValid = false;
  noEdits = true;

  _filterItems: FilterItem[] = [];
  _currentState = '';

  saving = false;

  counter = 0;

  readonly filterOutUnsortable = (filterItem: FilterItem) => {
    return filterItem
        && this.resourceType
        && this.resourceType.resourceAttributes.filter(a => a.name === filterItem.fieldName && a.canSortOn).length > 0;
  }

  constructor(private searchConfigurationService: SearchConfigurationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.savedSearch) {
      if (this.savedSearch && !this.savedSearch.searchRule) {
        this.savedSearch.searchRule = new MultiSearchRuleModel();
      }
    }
  }

  ngOnInit(): void {

  }

  @Input()
  set filterItems(items: FilterItem[]) {
    this._filterItems = FilterItem.flattenNestedFilterItems(items);
  }
  get filterItems(): FilterItem[] {
    return this._filterItems;
  }

  @Input()
  set currentState(value: string) {
    this._currentState = value;
    if (value != null) {
      if (value === 'add') {
        this.clear();
      }
    }
  }

  get currentState(): string {
    return this._currentState;
  }

  get canTry(): boolean {
    return (this.validateCreatFilterRule() && this.currentState === 'add') || this.currentState !== 'add';
  }

  save(): void {
    const groupingFields = this.savedSearch.groupingRules ? this.savedSearch.groupingRules.map(r => r.field) : [];
    const summingFields = this.savedSearch.sumRules ? this.savedSearch.sumRules.map(r => r.field) : [];
    this.savedSearch.defaultFields = this.resourceType.resourceAttributes
        .filter(attribute => attribute.name &&
            (this.resourceType.defaultDisplayColumns.includes(attribute.name)
                || groupingFields.includes(attribute.name)
                || summingFields.includes(attribute.name)))
        .map(attribute => new FilterItem(attribute.description, attribute.name, attribute.type, null, true))
        .sort((a: FilterItem, b: FilterItem) => this.sortDefaultFilterItem(a, b, groupingFields, summingFields));
    this.saveEdits.emit(this.savedSearch);
  }

  private sortDefaultFilterItem(a: FilterItem, b: FilterItem, groupingFields: string[], summingFields: string[]): number {
    const aGrouping = groupingFields.indexOf(a.fieldName);
    const bGrouping = groupingFields.indexOf(b.fieldName);

    // Group fields should always be before non-grouped.
    if (aGrouping >= 0 && bGrouping >= 0) {
      return aGrouping - bGrouping;
    } else if (aGrouping >= 0) {
      return -1;
    } else if (bGrouping >= 0) {
      return 1;
    }

    const aSumming = summingFields.indexOf(a.fieldName);
    const bSumming = summingFields.indexOf(b.fieldName);

    // Summing fields should be at the end
    if ((aSumming < 0 && bSumming < 0) || (aSumming >= 0 && bSumming >= 0)) {
      return 0;
    } else if (aSumming >= 0) {
      return 1;
    } else if (bSumming >= 0) {
      return -1;
    }

    return 0;
  }

  clear(): void {
    // Clear the changes, would need a confirmation dialog at some point.
    this.savedSearch.searchRule = new MultiSearchRuleModel();
  }

  getFilterText(): string {
    if (this.savedSearch.searchRule) {
      return this.savedSearch.searchRule.asString().join(' ');
    }
    return '';
  }

  close(): void {
    this.cancelEdits.emit();
  }

  isValid(): boolean {
    return this.nameAndShareValid && this.createFilterValid && this.setSortOrderValid && this.groupsAndTotalsValid;
  }

  try(): void {
    this.createFilterValid = this.validateCreatFilterRule();
    if (this.createFilterValid && this.currentState === 'add') {
      this.searchConfigurationService.searchPageConfiguration.tempAdvanceSearchItems.searchRule = this.savedSearch.searchRule;
      this.savedSearch = this.searchConfigurationService.searchPageConfiguration.tempAdvanceSearchItems;
      if (this.searchConfigurationService.advancedListType === SearchConfigurationService.ADVANCED_VIEW_PREPARE ||
        this.searchConfigurationService.advancedListType === SearchConfigurationService.ADVANCED_VIEW_PREVIEW) {
        this.searchConfigurationService.prepareFilter(this.savedSearch);
      }
    } else if (this.currentState !== 'add') {
      this.searchConfigurationService.tryFilter(this.savedSearch);
    }
  }

  trySort(): void {
    this.createFilterValid = this.validateCreatFilterRule();
    this.searchConfigurationService.tryFilter(this.savedSearch);
  }

  tryGroupings(): void {
    this.createFilterValid = this.validateCreatFilterRule();
    this.savedSearch = this.searchConfigurationService.ensureGroupsAssignedToDisplayFields(this.savedSearch);
    this.savedSearch = this.searchConfigurationService.ensureSumsAssignedToDisplayFields(this.savedSearch);
    this.searchConfigurationService.tryFilter(this.savedSearch);
  }

  onNameShareValidityChanged(valid: boolean): void {
    this.nameAndShareValid = valid;
  }

  onNameAndShareChangesMade(): void {
    this.noEdits = false;
  }

  validateCreatFilterRule(): boolean {
    const multiRule = this.savedSearch.searchRule as MultiSearchRuleModel;
    return this.validMultiRule(multiRule);
  }

  validMultiRule(multiRule: MultiSearchRuleModel): boolean {
    if (multiRule.rules.length > 0) {
      for (const rule of multiRule.rules) {
        if (rule.type === FieldSearchRuleModel.TYPENAME) {
          if (!this.validFieldRule(rule as FieldSearchRuleModel)) {
            return false;
          }
        }
      }
      return true;
    } else {
      return false;
    }
  }

  validFieldRule(fieldRule: FieldSearchRuleModel): boolean {
    if (fieldRule.field == null) {
      return false;
    }
    const matcher = fieldRule.matcher;
    if (matcher == null) {
      return false;
    } else {
      if (matcher.type === StringMatcherModel.TYPENAME) {
        const stringMatcher = matcher as StringMatcherModel;
        if (stringMatcher.values == null || stringMatcher.values.length === 0 ||
          stringMatcher.operator == null) {
          return false;
        } else {
          return true;
        }
      } else if (matcher.type === DateMatcherModel.TYPENAME) {
        const dateMatcher = matcher as DateMatcherModel;
        if (dateMatcher.values == null || dateMatcher.values.length === 0 ||
          dateMatcher.operator == null) {
          return false;
        } else {
          return true;
        }
      } else if (matcher.type === NumberMatcherModel.TYPENAME) {
        const numberMatcher = matcher as NumberMatcherModel;
        if (numberMatcher.values == null || numberMatcher.values.length === 0 ||
          numberMatcher.operator == null) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  }

  onNameAndShareNext(): void {
    // If a new rule then create the new rule
    if (this.currentState === SearchConfigurationService.ADVANCED_ADD) {
      this.searchConfigurationService.prepareNewRule(this.savedSearch);
    }
  }

  onGroupingChanged($event: boolean): void {
    this.groupsAndTotalsValid = $event;
  }
}
