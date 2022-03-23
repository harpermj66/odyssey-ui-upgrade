import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {ContainerJobTypeService} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-type.service";
import {MatSelectChange} from "@angular/material/select";
import {FunctionErrorStateMatcher} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";

@Component({
  selector: 'lib-container-job-type-selector',
  templateUrl: './container-job-type-selector.component.html',
  styleUrls: ['./container-job-type-selector.component.scss'],
  providers: [
    DiscardingRequestQueue
  ]
})
export class ContainerJobTypeSelectorComponent implements OnInit {

  @Input() value?: string;
  @Output() valueChange: EventEmitter<string | null> = new EventEmitter<string | null>();

  /**
   * The label to show on the selection list.
   */
  @Input() label?: string;

  /**
   * The placeholder for the selection list.
   */
  @Input() placeholder: string;

  /**
   * An error message to show.
   */
  @Input() error: string;

  @Input() disabled: boolean;
  @Input() readonly: boolean;
  @Input() required: boolean;

  jobTypes: string[] = [];

  errorMatcher = new FunctionErrorStateMatcher(this.isInvalid.bind(this));

  constructor(private jobTypeService: ContainerJobTypeService,
              public requestQueue: DiscardingRequestQueue) {
  }

  ngOnInit(): void {
    this.loadTypes();
  }

  get noResults(): boolean {
    return !this.jobTypes || this.jobTypes.length === 0;
  }

  loadTypes(): void {
    if(!this.jobTypes || this.jobTypes.length === 0) {
      this.requestQueue.makeRequest(
        this.jobTypeService.getTypes(),
        types => {
          this.jobTypes = types;
        }
      );
    }
  }

  onSelectChange(event: MatSelectChange): void {
    if(event.value !== this.value) {
      this.value = event.value;
      this.valueChange.emit(this.value);
    }
  }

  onClick(): void {
    this.loadTypes();
  }

  isInvalid(): boolean {
    return (this.error && this.error.trim() !== '') || (this.required && !this.value);
  }
}
