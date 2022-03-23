import {ErrorStateMatcher} from "@angular/material/core";
import {FormControl, FormGroupDirective, NgForm} from "@angular/forms";

export class FunctionErrorStateMatcher extends ErrorStateMatcher {
  constructor(private errorStateCheckFunction: (control: FormControl | null, form: FormGroupDirective | NgForm | null) => boolean) {
    super();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    return this.errorStateCheckFunction(control, form);
  }
}

/**
 * An error state matcher that shows errors whenever the form is invalid, even if it is not yet dirty.
 */
export class AlwaysShowErrorStateMatcher extends ErrorStateMatcher {
  constructor() {
    super();
  }

  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    let error = false;
    if (control) {
      error = !control.valid;
    }

    if (form && form.valid != null) {
      error = error || !form.valid;
    }
    return error;
  }
}
