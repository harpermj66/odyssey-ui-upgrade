import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { UnlocodeLookupRemoteService } from "../../../../../odyssey-service-library/src/lib/lookup/unlocode-lookup-remote.service";
import { UnLocode } from "../../../../../odyssey-service-library/src/lib/model/lookup/un-locode";
import {MatAutocompleteSelectedEvent} from "@angular/material/autocomplete";
import {AbstractControl, FormControl} from "@angular/forms";

@Component({
  selector: 'lib-un-locode-lookup',
  templateUrl: './un-locode-lookup.component.html',
  styleUrls: ['./un-locode-lookup.component.css']
})
export class UnLocodeLookupComponent implements OnInit {

  @Input() label = 'UN Locode';
  @Input() placeholder = 'UN Locode...';
  @Input() required = false;
  /*@Input() formControlName: string;
  @Input() formControl: any;*/

  @Output() unLocodeSelected = new EventEmitter<UnLocode>();

  filteredUnLocodes: UnLocode[] = [];
  searchString = "";
  excludedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'];
  timeout: any;
  debounce = 500;

  constructor(private unlocodeLookupRemoteService: UnlocodeLookupRemoteService) { }

  ngOnInit(): void {}

  findUnLocodes(event: KeyboardEvent): void {
      if(this.excludedKeys.includes(event.key)) { return; }

      if (this.timeout) {
          clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
          this.unlocodeLookupRemoteService.findUnLocodes(this.searchString).subscribe(
              (response) => {
                  this.filteredUnLocodes = response;
              },
              (error) => {
                  this.filteredUnLocodes = [];
                  console.log(error); // TODO
              },
          );
      }, this.debounce);
  }

  getLocode(unLocode: UnLocode): string{
      return unLocode ? unLocode.locode : '';
  }

  emitUnLocode(event: MatAutocompleteSelectedEvent): void {
      this.unLocodeSelected.emit(event.option.value);
  }

}
