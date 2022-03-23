import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getDefaultSearchOption, getSearchOptionByValue, SearchOption, searchOptions} from "../model/tracking-option";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'lib-tracking-option-select',
  templateUrl: './tracking-option-select.component.html',
  styleUrls: ['./tracking-option-select.component.css']
})
export class TrackingOptionSelectComponent implements OnInit {

  @Output() optionChanged: EventEmitter<SearchOption> = new EventEmitter<SearchOption>();

  @Input() searchOptions = searchOptions;
  @Input() selectedOption: string | null | undefined;
  selectedSearchOption: SearchOption;

  constructor() {}

  ngOnInit(): void {
    this.selectedSearchOption = this.selectedOption ? getSearchOptionByValue(this.selectedOption) : getDefaultSearchOption()
  }

  onOptionSelect(event: MatSelectChange): void{
    this.optionChanged.emit(event.value);
  }

}
