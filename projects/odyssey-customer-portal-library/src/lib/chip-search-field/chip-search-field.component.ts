import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material/chips";

@Component({
  selector: 'lib-chip-search-field',
  templateUrl: './chip-search-field.component.html',
  styleUrls: ['./chip-search-field.component.css']
})
export class ChipSearchFieldComponent implements OnInit {
  @Output() searchValuesChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  @Input() selectable = true;
  @Input() removable = true;
  @Input() addOnBlur = true;
  @Input() readonly separatorKeysCodes = [COMMA, SPACE, ENTER] as const;
  @Input() placeholder: string;
  @Input() searchString?: string | null | undefined;

  searchValues: string[] = [];

  constructor() {}

  ngOnInit(): void {
    if(this.searchString){
      this.searchValues.push(...this.searchString.split(','));
    }
  }

  addChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.searchValues.push(value);
    }

    event.input.value = '';
    this.searchValuesChanged.emit(this.searchValues);
  }

  removeChip(value: string): void {
    const index = this.searchValues.indexOf(value);

    if (index >= 0) {
      this.searchValues.splice(index, 1);
    }

    this.searchValuesChanged.emit(this.searchValues);
  }

}
