import {Component, Input, OnInit} from '@angular/core';
import {
  FilterItem
} from "../../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  StringMatcherModel
} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/string-matcher.model";
import {ResourceTypeModel} from "../../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {LookupService} from "../../../../../../../../odyssey-service-library/src/lib/lookup/service/lookup.service";

@Component({
  selector: 'lib-search-rule-editor-string-matcher',
  templateUrl: './search-rule-editor-string-matcher.component.html',
  styleUrls: ['./search-rule-editor-string-matcher.component.css']
})
export class SearchRuleEditorStringMatcherComponent implements OnInit {
  @Input() matcher: StringMatcherModel;
  @Input() filterItem: FilterItem;
  @Input() resourceType: ResourceTypeModel;
  @Input() disabled: boolean;
  @Input() readonly: boolean;


  chipInput = '';

  readonly operators = StringMatcherModel.OPERATORS;

  constructor() {
  }

  ngOnInit(): void {
  }

  hasLookup(): boolean {
    return !!this.filterItem?.fieldName
        && LookupService.hasLookups(this.filterItem.fieldName, this.resourceType).unlinkedLookups;
  }

  onLookupSelect(data?: { [field: string]: any } | null): void {
    this.matcher.values = [this.filterItem?.fieldName && data ? data[this.filterItem.fieldName] : ''];
  }

  removeValue(value: string, index: number): void {
    this.matcher.values.splice(index, 1);
  }

  addValue(value: string): void {
    const newValue = value ? value : '';

    if (!this.matcher.values) {
      this.matcher.values = [newValue];
    } else if (!this.matcher.values.includes(newValue)) {
      this.matcher.values.push(newValue);
    }

    this.matcher.values = this.matcher.values.sort((a, b) => a.localeCompare(b));

    this.chipInput = '';
  }

  onBlur(chipInput: string): void {
    if (!this.matcher.values || this.matcher.values.length === 0 || (this.chipInput && this.chipInput !== '')) {
      this.addValue(chipInput);
    }
  }
}
