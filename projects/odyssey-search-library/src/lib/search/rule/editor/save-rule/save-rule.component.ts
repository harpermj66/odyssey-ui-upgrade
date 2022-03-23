import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {
  SavedSearchModel
} from "../../../../../../../odyssey-service-library/src/lib/search/rule/model/saved-search.model";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {SearchServiceRemote} from "../../../search-service.remote";

@Component({
  selector: 'lib-save-rule',
  templateUrl: './save-rule.component.html',
  styleUrls: ['./save-rule.component.css']
})
export class SaveRuleComponent implements OnInit {

  @Output() validityChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changesMade: EventEmitter<void> = new EventEmitter<void>();

  _savedSearch: SavedSearchModel = new SavedSearchModel();

  form: FormGroup = this.formBuilder.group({
    name: [this._savedSearch == null ? '' : this._savedSearch.name, Validators.required, this.checkNameNotTaken.bind(this)],
    description: [this._savedSearch == null ? '' : this._savedSearch.description, Validators.required],
    shareLocally: [this._savedSearch == null ? false : this._savedSearch.shareLocally],
    shareAll: [this._savedSearch == null ? false : this._savedSearch.shareAll]
  });

  @Input()
  newRecord = false;
  @Input() area = '';

  private nameCheckTimeout?: number;
  nameRequired = true;
  duplicateName = false;
  descriptionInvalid = true;

  constructor(private formBuilder: FormBuilder,
              private searchServiceRemote: SearchServiceRemote) {
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  @Input()
  set savedSearch(value: SavedSearchModel) {
    this._savedSearch = value;
    if (value != null && this.form != null) {
      this.form.get('name')?.setValue(this._savedSearch.name);
      this.form.get('description')?.setValue(this._savedSearch.description);
      this.form.get('shareLocally')?.setValue(this._savedSearch.shareLocally);
      this.form.get('shareAll')?.setValue(this._savedSearch.shareAll);
    }
  }

  get savedSearch(): SavedSearchModel {
    return this._savedSearch;
  }

  prepareForm(): void  {
    if (!this.newRecord) {
      this.form.get('name')?.disable();
    } else {
      this.form.get('name')?.enable();
    }
  }

  checkNameNotTaken(control: AbstractControl): Promise<any> | Observable<any> {
    const thisComponent = this;
    return new Promise<any>((resolve, reject) => {
      if (this.nameCheckTimeout) {
        clearTimeout(this.nameCheckTimeout);
      }

      this.nameCheckTimeout = setTimeout(() => {
        if (control.value === '') {
          resolve(null);

          // Notify of changes to validity after check
          thisComponent.asyncValidityEmit();
          return;
        }

        this.searchServiceRemote.isDuplicateRuleName(this.area, control.value).subscribe({
          // tslint:disable-next-line:typedef
          next(value: any) {
            if (value && value === true) {
              resolve({nameTaken: true});
            } else {
              resolve(null);
            }

            // Notify of changes to validity after check
            thisComponent.asyncValidityEmit();
          }
        });
      }, 500);
    });
  }

  /**
   * Async notifies listeners of changes in validity.
   * To be called after async validity checks.
   * @private
   */
  private asyncValidityEmit(): void {
    setTimeout(() => {
      this.validityChanged.emit(this.form.valid);
    }, 100);
  }

  onNameChange(): void {
    const name = this.form.get('name');
    if ( name == null || name.value == null || name.value.length === 0) {
      this.nameRequired = true;
    } else {
      this.nameRequired = false;
    }

    // form.get('name') != null && form.get('name').invalid && form.get('name').value != null && form.get('name').value.length != 0
    if ( name != null && name.invalid && name.value != null && name.value.length !== 0) {
      this.duplicateName = true;
    } else {
      this.duplicateName = false;
    }
    this._savedSearch.name = this.form.controls['name'].value;
    this.validityChanged.emit(this.form.valid);
    this.changesMade.emit();
  }

  onDescriptionChange(): void {
    const description = this.form.get('description');
    if (description == null || description.value == null || description.value.length === 0 ) {
      this.descriptionInvalid = true;
    } else {
      this.descriptionInvalid = false;
    }

    this._savedSearch.description = this.form.controls['description'].value;
    this.validityChanged.emit(this.form.valid);
    this.changesMade.emit();
  }

  onShareLocally(): void {
    this._savedSearch.shareLocally = this.form.controls['shareLocally'].value;
    this.changesMade.emit();
  }

  onShareAllChanged(): void {
    this._savedSearch.shareAll = this.form.controls['shareAll'].value;
    this.changesMade.emit();
  }

}
