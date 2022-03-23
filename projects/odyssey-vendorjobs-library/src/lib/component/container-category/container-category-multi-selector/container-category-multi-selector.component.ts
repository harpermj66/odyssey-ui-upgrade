import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {DiscardingRequestQueue} from "../../../../../../odyssey-service-library/src/lib/utils/discarding-request-queue";
import {ContainerJobTypeService} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-job-type.service";
import {MatSelectChange} from "@angular/material/select";
import {FunctionErrorStateMatcher} from "../../../../../../odyssey-shared-views/src/lib/utils/function-error-state-matcher";
import {ContainerCategoriesService} from "../../../../../../odyssey-service-library/src/lib/vendorjobs/container-job-tariff/service/container-categories.service";

@Component({
  selector: 'lib-container-category-multi-selector',
  templateUrl: './container-category-multi-selector.component.html',
  styleUrls: ['./container-category-multi-selector.component.scss'],
  providers: [
    DiscardingRequestQueue
  ]
})
export class ContainerCategoryMultiSelectorComponent implements OnInit {

  @Input() value?: string[];
  @Output() valueChange: EventEmitter<string[]> = new EventEmitter<string[]>();

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

  categories: string[] = [];

  errorMatcher = new FunctionErrorStateMatcher(this.isInvalid.bind(this));

  constructor(private categoriesService: ContainerCategoriesService,
              public requestQueue: DiscardingRequestQueue) {
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  get noResults(): boolean {
    return !this.categories || this.categories.length === 0;
  }

  loadCategories(): void {
    if(!this.categories || this.categories.length === 0) {
      this.requestQueue.makeRequest(
        this.categoriesService.getCategories(),
        types => {
          this.categories = types;
        }
      );
    }
  }

  onSelectChange(event: MatSelectChange): void {
    const newValues: string[] = event.value ? event.value as (string[]) : [];
    const oldValues: string[] = this.value ? this.value : [];

    this.value = newValues;
    if(this.arraysAreDifferent(newValues, oldValues)) {
      this.valueChange.emit(this.value);
    }
  }

  private arraysAreDifferent(newValues: string[], oldValues: string[]): boolean {
    let changed = newValues.length !== oldValues.length;
    if(!changed) {
      for(const val in newValues) {
        if(!oldValues.includes(val)) {
          changed = true;
          break;
        }
      }
    }
    return changed;
  }

  onClick(): void {
    this.loadCategories();
  }

  isInvalid(): boolean {
    return (this.error && this.error.trim() !== '') || (this.required && (!this.value || this.value.length === 0));
  }
}
