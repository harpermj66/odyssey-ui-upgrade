import {Component, Input, OnInit} from '@angular/core';
import {
  FilterItem
} from "../../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  AbstractFieldMatcherModel
} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/field-matcher.model";
import {
  StringMatcherModel
} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/string-matcher.model";
import {
  DateMatcherModel
} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/date-matcher.model";
import {
  NumberMatcherModel
} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/number-matcher.model";
import {ResourceTypeModel} from "../../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";


@Component({
  selector: 'lib-search-rule-editor-generic-matcher',
  templateUrl: './search-rule-editor-generic-matcher.component.html',
  styleUrls: ['./search-rule-editor-generic-matcher.component.css']
})
export class SearchRuleEditorGenericMatcherComponent implements OnInit {
  readonly date = DateMatcherModel.TYPENAME;
  readonly string = StringMatcherModel.TYPENAME;
  readonly number = NumberMatcherModel.TYPENAME;

  @Input() matcher: AbstractFieldMatcherModel;
  @Input() filterItem: FilterItem;
  @Input() resourceType: ResourceTypeModel;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  getStringMatcher(matcher: AbstractFieldMatcherModel): StringMatcherModel {
    return matcher as StringMatcherModel;
  }

  getNumberMatcher(matcher: AbstractFieldMatcherModel): NumberMatcherModel {
    return matcher as NumberMatcherModel;
  }

  getDateMatcher(matcher: AbstractFieldMatcherModel): DateMatcherModel {
    return matcher as DateMatcherModel;
  }
}
