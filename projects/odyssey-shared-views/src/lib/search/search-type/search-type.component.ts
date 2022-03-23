import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FilterItem } from "../../component/list-filter/list-filter.component";

@Component({
             selector: 'lib-search-type',
             templateUrl: './search-type.component.html',
             styleUrls: ['./search-type.component.scss']
           })
export class SearchTypeComponent implements OnInit, OnChanges {

  @Output() searchTypeChanged = new EventEmitter<string>();
  @Output() sortCleared = new EventEmitter<void>();
  _searchType: string;
  searchDescription: string;

  @Input()
  sort = 'Sort';

  @Input()
  fields: FilterItem[] = [];

  sortTooltip = "";

  advanced = false;

  constructor() {
  }

  ngOnInit(): void {
    if (this.searchType === 'advanced') {
      this.advanced = true;
    } else {
      this.advanced = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.sort || changes.fields) {
      this.buildTooltip();
    }
  }

  @Input()
  set searchType(value: string) {
    if (value != null) {
      if (value === 'quick') {
        this.searchDescription = 'Quick search';
      } else if (value === 'advanced') {
        this.searchDescription = 'Advanced search';
      }
    }
    this._searchType = value;
  }

  get searchType(): string {
    return this._searchType;
  }

  onSearchTypeChange(value: string): void {
    console.log(value);
    this.searchType = value;
    this.searchTypeChanged.emit(value);
  }

  onClearSort(): void {
    this.sortCleared.emit();
  }

  /**
   * Builds a human readable tooltip for the sort.
   * @private
   */
  private buildTooltip(): void {
    let tooltip = "";

    const sort = this.sort;
    const fields = this.fields;
    if (sort && fields) {
      tooltip = this.convertSortString(sort, fields);
    }

    this.sortTooltip = tooltip;
  }

  /**
   * Converts the sort to something human readable.
   * @private
   */
  private convertSortString(sort: string, fields: FilterItem[]): string {
    // Map the fields to their names for quicker lookups
    const fieldMap: { [fieldName: string]: FilterItem } = {};
    fields.forEach(f => fieldMap[f.fieldName] = f);

    const sortLines: string[] = [];
    sort.split(",").forEach((sortVal: string) => {
      const fieldName = sortVal.trim();
      if (fieldName.toLowerCase() !== 'asc' && fieldName.toLowerCase() !== 'desc') {
        const field = fieldMap[fieldName];
        sortLines.push(field ? field.displayName : fieldName);
      } else {
        if (sortLines.length > 0) {
          // Append the sort direction to the line.
          sortLines.push(sortLines.pop() + " " + (fieldName.toLowerCase() === 'asc' ? 'ASC' : 'DESC'));
        }
      }
    });

    return sortLines.join("\n");
  }
}
