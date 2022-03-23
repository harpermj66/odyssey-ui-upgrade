import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {
  FilterItem
} from "../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  FieldSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/field-search-rule.model";
import {
  DateMatcherModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/date-matcher.model";
import {
  StringMatcherModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/string-matcher.model";
import {
  NumberMatcherModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/matcher/number-matcher.model";
import {MatSelectChange} from "@angular/material/select";
import {ResourceTypeModel} from "../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";

@Component({
  selector: 'lib-search-rule-editor-field-rule',
  templateUrl: './search-rule-editor-field-rule.component.html',
  styleUrls: ['./search-rule-editor-field-rule.component.css']
})
export class SearchRuleEditorFieldRuleComponent implements OnInit, OnChanges {

  @Input() rule: FieldSearchRuleModel;
  @Input() filterItems: FilterItem[] = [];
  @Input() resourceType: ResourceTypeModel;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  private readonly dateMatcherTypes = ['date'];
  private readonly numberMatcherTypes = ['number'];

  selectedFilterItem?: FilterItem;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.rule) {
      if (this.rule) {
        const items = this.filterItems.filter(fi => fi.fieldName === this.rule.field);
        if (items.length > 0) {
          this.selectedFilterItem = items.pop();
        } else {
          delete this.selectedFilterItem;
        }
      } else {
        delete this.selectedFilterItem;
      }
    }
  }

  onChangeField(change: MatSelectChange): void {
    const fieldName = change.value;
    const filterItem = this.getFilterItem(fieldName);

    if (filterItem) {
      this.selectedFilterItem = filterItem;

      // Create the appropriate matcher for the type of field.
      const type = filterItem.type.substr(0, filterItem.type.length - 1);

      if (type && this.dateMatcherTypes.includes(type.toLowerCase()) ) {
        this.rule.matcher = new DateMatcherModel();
      } else if (type && this.numberMatcherTypes.includes(type.toLowerCase()) ) {
        this.rule.matcher = new NumberMatcherModel();
      } else {
        this.rule.matcher = new StringMatcherModel();
      }
    } else {
      this.rule.matcher = null;
    }
  }

  private getFilterItem(fieldName: string): FilterItem | null {
    let filterItem: FilterItem | null = null;

    if(this.filterItems) {
      for(const item of this.filterItems) {
        if(item.fieldName === fieldName) {
          filterItem = item;
          break;
        }
      }
    }

    return filterItem;
  }

  trackByFieldName(index: number, entity: FilterItem): any {
    return entity.fieldName ? entity.fieldName : index;
  }
}
