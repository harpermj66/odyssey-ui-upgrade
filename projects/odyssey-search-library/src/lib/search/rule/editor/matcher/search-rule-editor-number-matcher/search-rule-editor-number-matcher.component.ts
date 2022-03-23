import {Component, Input, OnInit} from '@angular/core';
import {
  FilterItem
} from "../../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  NumberMatcherModel
} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/number-matcher.model";
import {ResourceTypeModel} from "../../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {LookupService} from "../../../../../../../../odyssey-service-library/src/lib/lookup/service/lookup.service";

@Component({
  selector: 'lib-search-rule-editor-number-matcher',
  templateUrl: './search-rule-editor-number-matcher.component.html',
  styleUrls: ['./search-rule-editor-number-matcher.component.css']
})
export class SearchRuleEditorNumberMatcherComponent implements OnInit {

  @Input() matcher: NumberMatcherModel;
  @Input() filterItem: FilterItem;
  @Input() resourceType: ResourceTypeModel;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  readonly operators = NumberMatcherModel.OPERATORS_WTIH_EQUAL;
  readonly operatorRange = NumberMatcherModel.OPERATOR_RANGE;

  chipInput?: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  onOperatorChange(): void {
    if (this.matcher.operator === this.operatorRange) {
      if (!this.matcher.values) {
        this.matcher.values = [0, 0];
      } else if (this.matcher.values.length === 1) {
        this.matcher.values.push(0);
      }
    } else if (this.matcher.values && this.matcher.values.length > 1) {
      this.matcher.values = [this.matcher.values[0]];
    } else {
      this.matcher.values = [];
    }
  }

  hasLookup(): boolean {
    return !!this.filterItem?.fieldName
        && LookupService.hasLookups(this.filterItem.fieldName, this.resourceType).unlinkedLookups;
  }

  onLookupSelect(data?: { [field: string]: any } | null): void {
    this.matcher.values = this.filterItem?.fieldName && data ? [data[this.filterItem.fieldName]] : [];
  }

  onValueChange(value: string): void {
    if (value && value.trim() !== '') {
      this.matcher.values[0] = parseFloat(value.trim());
    } else {
      this.matcher.values[0] = 0;
    }
  }


  removeValue(value: number, index: number): void {
    this.matcher.values.splice(index, 1);
  }

  addValue(value?: any): void {
    const newValue = value ? parseFloat(value.toString()) : null;

    if (newValue !== null && newValue !== undefined && !isNaN(newValue)) {
      if (!this.matcher.values) {
        this.matcher.values = [newValue];
      } else if (!this.matcher.values.includes(newValue)) {
        this.matcher.values.push(newValue);
      }
    }

    this.matcher.values = this.matcher.values.sort((a, b) => a - b);

    delete this.chipInput;
  }

  onBlur(chipInput?: any): void {
    const newValue = chipInput ? parseFloat(chipInput.toString()) : null;

    if (!this.matcher.values || this.matcher.values.length === 0 && (newValue !== null && newValue !== undefined && !isNaN(newValue))) {
      this.addValue(chipInput);
    }
  }

    operatorNotRange(operator: "BEFORE" | "AFTER" | "RANGE"): boolean {
      return operator !== this.operatorRange;
    }
}
