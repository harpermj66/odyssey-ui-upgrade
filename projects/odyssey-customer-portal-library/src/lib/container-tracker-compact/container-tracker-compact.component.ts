import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {SearchOption, searchOptions, getDefaultSearchOption} from "../model/tracking-option";

@Component({
  selector: 'lib-container-tracker-compact',
  templateUrl: './container-tracker-compact.component.html',
  styleUrls: ['./container-tracker-compact.component.css']
})
export class ContainerTrackerCompactComponent implements OnInit {

  @Output() onSearchValuesChange = new EventEmitter<string[]>();
  @Output() onSelectedOptionChange = new EventEmitter<SearchOption>();

  searchValues: string[] = [];

  // OPTION DROPDOWN
  searchOptions = searchOptions;
  selectedSearchOption: SearchOption;

  constructor() { }

  ngOnInit(): void {
    this.selectedSearchOption = getDefaultSearchOption();
  }

  setSearchValues(values: string[]): void{
    this.searchValues = values;
    this.onSearchValuesChange.emit(this.searchValues);
  }

  setSelectedSearchOption(selectedOption: SearchOption): void{
    this.selectedSearchOption = selectedOption;
    this.onSelectedOptionChange.emit(this.selectedSearchOption);
  }
}
