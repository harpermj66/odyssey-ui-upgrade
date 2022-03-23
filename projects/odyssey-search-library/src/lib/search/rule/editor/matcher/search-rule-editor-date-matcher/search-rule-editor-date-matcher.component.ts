import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {
  FilterItem
} from "../../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  DateMatcherModel
} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/date-matcher.model";

@Component({
  selector: 'lib-search-rule-editor-date-matcher',
  templateUrl: './search-rule-editor-date-matcher.component.html',
  styleUrls: ['./search-rule-editor-date-matcher.component.css']
})
export class SearchRuleEditorDateMatcherComponent implements OnInit, OnDestroy {

  @Input() matcher: DateMatcherModel = new DateMatcherModel();
  @Input() filterItem: FilterItem | undefined
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;

  readonly operators = DateMatcherModel.OPERATORS;
  readonly operatorRange = DateMatcherModel.OPERATOR_RANGE;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  onOperatorChange(): void {
    if (this.matcher.operator === this.operatorRange) {
      if (!this.matcher.values) {
        this.matcher.values = [new Date(), new Date()];
      } else if (this.matcher.values.length === 1) {
        this.matcher.values.push(new Date());
      }
    } else if (this.matcher.values && this.matcher.values.length > 1) {
      this.matcher.values = [this.matcher.values[0]];
    } else {
      this.matcher.values = [new Date()];
    }
  }

  onSingleDateChange(value: Date): void {
    this.matcher.values[0] = value;
  }

  onToDateChange(value: Date): void {
    this.matcher.values[1] = value;
  }
}
