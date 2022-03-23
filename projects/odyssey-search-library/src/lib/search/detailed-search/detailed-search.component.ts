import {Component, Input, OnInit} from '@angular/core';
import {FilterItem} from "../../../../../odyssey-shared-views/src/lib/component/list-filter/list-filter.component";
import {ResourceTypeModel} from "../../../../../odyssey-service-library/src/lib/model/resource-type.model";

@Component({
  selector: 'lib-detailed-search',
  templateUrl: './detailed-search.component.html',
  styleUrls: ['./detailed-search.component.css']
})
export class DetailedSearchComponent implements OnInit {

  @Input() public filterItems: FilterItem[] = [];

  _resourceType: ResourceTypeModel

  constructor() { }

  ngOnInit(): void {
  }

  @Input()
  set resourceType(value: ResourceTypeModel) {
    this._resourceType = value;
    if (value != null) {
      // Do something with non-null value
    }
  }

  get resourceType(): ResourceTypeModel {
    return this._resourceType;
  }
}
