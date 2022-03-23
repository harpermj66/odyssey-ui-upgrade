import {
  ChangeDetectorRef,
  Component, ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges, ViewChild
} from '@angular/core';
import {CedexCodeModel} from "../../../../../../odyssey-service-library/src/lib/mandr/cedex/model/cedex-code.model";
import {CedexCodeService} from "../../../../../../odyssey-service-library/src/lib/mandr/cedex/service/cedex-code.service";
import {MatSelectChange} from "@angular/material/select";
import {ChangeDetector} from "../../../../../../odyssey-service-library/src/lib/utils/change-detector";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {FunctionErrorStateMatcher} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";

@Component({
  selector: 'lib-cedex-select-field',
  templateUrl: './cedex-select-field.component.html',
  styleUrls: ['./cedex-select-field.component.scss'],
  providers: [
    DiscardingRequestQueue
  ]
})
export class CedexSelectFieldComponent implements OnInit, OnDestroy, OnChanges {

  @ViewChild('searchInput') searchInput: ElementRef;

  @Input() label: string;
  @Input() placeholder: string;
  @Input() type = "";
  @Input() subtype?: string | null = "";
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() readonly: boolean;

  selected: CedexCodeModel | null;

  @Input() value?: string | null = null;
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  inputValue = "";

  options: CedexCodeModel[] = [];

  filter?: string;

  errorStateMatcher = new FunctionErrorStateMatcher(this.isInvalid.bind(this));

  constructor(private cedexService: CedexCodeService,
              private changeDetector: ChangeDetectorRef,
              public requestQueue: DiscardingRequestQueue) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.type || changes.subtype) {
      if(!this.type || this.type.trim() === '') {
        console.error("CEDEX Code Autocomplete missing parameter type");
      } else {
        this.refreshOptions(true);
      }
    } else if(changes.value && changes.value.currentValue !== this.value) {
      // Check if the value is still valid
      this.getSelectedOption();
    }
  }

  ngOnDestroy(): void {
    ChangeDetector.destroy(this.changeDetector);
  }

  get noResults(): boolean {
    return !this.options || this.options.length === 0;
  }

  refreshOptions(force?: boolean): void {
    if(!this.options || this.options.length === 0 || force) {
      if(!this.type || this.type.trim() === '') {
        this.options = [];
      } else {
        this.requestQueue.makeRequest(
          this.cedexService.getCodes(this.type, this.subtype, this.filter),
          values => {
            this.options = values;
            // Check the option is valid
            this.getSelectedOption();
          },
          error => {
          }
        );
      }
    }
  }

  onSelectionChange(newValue: MatSelectChange): void {
    this.selected = newValue.value;
    const newCode = this.selected ? this.selected.code : null;
    if(this.value !== newCode) {
      this.value = newCode;
      this.valueChange.emit(this.value);
    }
  }

  getSelectedOption(): CedexCodeModel | null {
    this.selected = null;
    if(this.value) {
      for(const option of this.options) {
        if(option.code.toLowerCase() === this.value.trim().toLowerCase()) {
          this.selected = option;
        }
      }
    }

    this.value = this.selected ? this.selected.code : null;

    if((!this.selected && this.value) || (this.selected && this.selected.code !== this.value)) {
      this.valueChange.emit(this.value);
    }
    ChangeDetector.detectChanges(this.changeDetector);

    return this.selected;
  }

  onClick(): void {
    if(!this.requestQueue.loading && this.noResults) {
      this.refreshOptions();
    }
  }

  isInvalid(): boolean {
    return this.required && !this.value;
  }

  onSelectOpened() {
    this.searchInput.nativeElement.focus();
  }
}
