import {FormControl, Validators} from "@angular/forms";

export class FormControlBuilder {

  /**
   * Builds a form control for an email address field. Will automatically update the parent object when the value is changed.
   * @param entity The parent entity.
   * @param field The name of the email field in the parent entity.
   * @param required Whether the field should be set as required.
   */
  public static buildEmailControl(entity: { [field: string]: any }, field: string, required?: boolean): FormControl {
    const validators = [Validators.email];
    if (required) {
      validators.push(Validators.required);
    }

    const control = new FormControl(
      entity[field],
      validators
    );

    control.registerOnChange(() => {
      if (entity) {
        entity[field] = control.value;
      } else {
        control.registerOnChange(() => {
        });
      }
    });

    return control;
  }
}
