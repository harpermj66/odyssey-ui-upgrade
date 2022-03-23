import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'lib-basic-filter',
  templateUrl: './basic-filter.component.html',
  styleUrls: ['./basic-filter.component.scss']
})
export class BasicFilterComponent implements OnInit, OnChanges {

  @Input() value = '';

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();

  searchControl = new FormControl();

  @Input() filterEnabled = true;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.value) {
      this.searchControl.setValue(this.value);
    }
  }

  onClear(): void {
    this.searchControl.setValue('');
  }

  onFilterChange(): void {
    const newValue = this.searchControl.value;
    const changed = newValue !== this.value;
    this.value = newValue;
    if(changed) {
      this.valueChange.emit(this.value);
    }
  }
}
