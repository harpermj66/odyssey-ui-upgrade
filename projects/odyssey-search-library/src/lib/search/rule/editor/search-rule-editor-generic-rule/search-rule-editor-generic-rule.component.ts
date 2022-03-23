import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  AbstractSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/search-rule.model";
import {
  MultiSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/multi-search-rule.model";
import {
  FilterItem
} from "../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  FieldSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/field-search-rule.model";
import {ResourceTypeModel} from "../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";

@Component({
  selector: 'lib-search-rule-editor-generic-rule',
  templateUrl: './search-rule-editor-generic-rule.component.html',
  styleUrls: ['./search-rule-editor-generic-rule.component.css']
})
export class SearchRuleEditorGenericRuleComponent implements OnInit {

  @Output() multiRuleChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  readonly multiRule = MultiSearchRuleModel.TYPENAME;
  readonly matchRule = FieldSearchRuleModel.TYPENAME;

  @Input() rule: AbstractSearchRuleModel;
  @Input() filterItems: FilterItem[] = [];
  @Input() resourceType: ResourceTypeModel;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

  get castMultiRule(): MultiSearchRuleModel {
    return this.rule as MultiSearchRuleModel;
  }

  get castFieldRule(): FieldSearchRuleModel {
    return this.rule as FieldSearchRuleModel;
  }

  onMultiRuleValidityChanged(valid: boolean): void {
    this.multiRuleChanged.emit(valid);
  }
}
