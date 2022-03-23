import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {getDefaultSearchOption, SearchOption} from "../model/tracking-option";

@Component({
  selector: 'lib-container-tracker-card',
  templateUrl: './container-tracker-card.component.html',
  styleUrls: ['./container-tracker-card.component.css']
})
export class ContainerTrackerCardComponent implements OnInit {

  @Output() onSubmit = new EventEmitter<any>();

  @Input() pin: string;
  searchValues: string[] = [];
  selectedSearchOption: SearchOption;

  constructor() { }

  ngOnInit(): void {
    this.selectedSearchOption = getDefaultSearchOption();
  }

  setSearchValues(values: string[]): void{
    this.searchValues = values;
  }

  setSelectedSearchOption(selectedOption: SearchOption): void{
    this.selectedSearchOption = selectedOption;
  }

  submitRequestData(): void{
    if(this.searchValues.length > 0) {
      console.log('option', this.selectedSearchOption?.value);
      console.log('values', this.searchValues.join());
      this.onSubmit.emit({ values: this.searchValues, option: this.selectedSearchOption.value, pin: this.pin });
    }
    else {
      // TODO handle error message
      console.log('please enter values')
    }
  }

}
