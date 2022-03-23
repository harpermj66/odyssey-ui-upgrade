import {Component, Input, OnInit} from '@angular/core';
import {FilterItem} from "../../../../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {SavedSearchModel} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {SortRuleModel} from "../../../../../../../../odyssey-service-library/src/lib/search/rule/model/sort/sort-rule.model";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
  selector: 'lib-search-rule-editor-sort-selector',
  templateUrl: './search-rule-editor-sort-selector.component.html',
  styleUrls: ['./search-rule-editor-sort-selector.component.css']
})
export class SearchRuleEditorSortSelectorComponent implements OnInit {

  readonly directions = SortRuleModel.DIRECTIONS;

  @Input() savedSearch: SavedSearchModel = new SavedSearchModel();
  @Input() filterItems: FilterItem[] = [];
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  tempSelection: any;

  filterOutSelected = (filterItem: FilterItem) => {
    if(this.savedSearch.sortRules && filterItem.fieldName) {
      const fieldNames = this.savedSearch.sortRules.map(a => a.field.toLowerCase());
      return !fieldNames.includes(filterItem.fieldName.toLowerCase());
    }
    return false;
  }

  constructor() { }

  ngOnInit(): void {
  }

  selectField(filterItem: FilterItem): void {
    this.addToList(filterItem);
    this.tempSelection = null;
  }

  addToList(filterItem: FilterItem): void {
    if(!this.savedSearch.sortRules) {
      this.savedSearch.sortRules = [];
    }
    const sortRule = new SortRuleModel();
    sortRule.field = filterItem.fieldName;
    this.savedSearch.sortRules.push(sortRule);
  }

  removeFromList(sort: SortRuleModel): void {
    if(this.savedSearch.sortRules) {
      const index = this.savedSearch.sortRules?.indexOf(sort);
      if(index >= 0) {
        this.savedSearch.sortRules?.splice(index, 1);
      }
    }
  }

  drop(event: CdkDragDrop<SortRuleModel[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
