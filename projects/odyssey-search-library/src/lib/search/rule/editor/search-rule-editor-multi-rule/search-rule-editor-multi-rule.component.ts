import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  MultiSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/multi-search-rule.model";
import {
  AbstractSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/search-rule.model";
import {
  FilterItem
} from "../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {
  FieldSearchRuleModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/field-search-rule.model";
import {ResourceTypeModel} from "../../../../../../../odyssey-service-library/src/lib/model/resource-type.model";
import {MatDialog} from "@angular/material/dialog";
import {
  ConfirmDeleteDialogComponent
} from "../../../../../../../odyssey-shared-views/src/lib/component/dialog/confirm-delete-dialog/confirm-delete-dialog.component";

@Component({
  selector: 'lib-search-rule-editor-multi-rule',
  templateUrl: './search-rule-editor-multi-rule.component.html',
  styleUrls: ['./search-rule-editor-multi-rule.component.css']
})
export class SearchRuleEditorMultiRuleComponent implements OnInit {

  @Output() validityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() rule: MultiSearchRuleModel;
  @Input() filterItems: FilterItem[] = [];
  @Input() resourceType: ResourceTypeModel;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  // Disable these for now and only have basic single level AND filter
  readonly allowOr = true;
  readonly allowMultipleLevels = true;

  readonly operators = MultiSearchRuleModel.OPERATORS;

  valid = false;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.checkValidity();
  }

  checkValidity(): void {
    if (this.rule != null && this.rule.rules != null && this.rule.rules.length > 0) {
      this.validityChanged.emit(true);
    } else {
      this.validityChanged.emit(false);
    }
  }

  trackById(index: number, rule: AbstractSearchRuleModel): any {
    return rule.id ? rule.id : index;
  }

  addRule(): void {
    if(!this.rule.rules) {
      this.rule.rules = [];
    }

    this.rule.rules.push(new FieldSearchRuleModel());
  }

  addListRule(): void {
    if (!this.rule.rules) {
      this.rule.rules = [];
    }

    this.rule.rules.push(new MultiSearchRuleModel());
  }

  deleteRule(subRule: AbstractSearchRuleModel): void {
    const descendants = AbstractSearchRuleModel.getDescendants(subRule);
    const plural = descendants.length > 0;
    const entityTypeName = plural ? (descendants.length + 1) + ' Rules' : 'Rule';

    this.dialog.open(ConfirmDeleteDialogComponent, {
      data: {
        entityTypeName,
        plural
      }
    }).afterClosed().subscribe(
        confirmDelete => {
          if (confirmDelete) {
            this.forceDeleteRule(subRule);
          }
        }
    );
  }

  private forceDeleteRule(subRule: AbstractSearchRuleModel): void {
    if (this.rule.rules) {
      const index = this.rule.rules.indexOf(subRule);
      if (index >= 0) {
        this.rule.rules.splice(index, 1);
      }
    }
  }
}
