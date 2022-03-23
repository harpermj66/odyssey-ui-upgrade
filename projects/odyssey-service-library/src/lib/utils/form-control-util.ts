import {
  AbstractControl,
  AbstractControlOptions,
  AsyncValidatorFn, FormArray,
  FormControl,
  FormGroup,
  ValidatorFn
} from "@angular/forms";

/**
 * Utility class to help convert complex objects to form controls and back again.
 * This should make it easier to build large forms without having to manually specify the form structure.
 * Just need an object and a predefined ValidatorMap extension for that object.
 */
export class FormControlUtil {
  /**
   * Builds a form group for this object.
   * Recursively adds form groups/form arrays/form controls depending on the value of the obj fields.
   *
   * @param obj The object to build a form from.
   * @param validatorsMap The validators to use for the fields (optional).
   */
  public static fromObject(obj: {[key: string]: any}, validatorsMap?: ValidatorMap): FormGroup {
    const controls: {[propName: string]: AbstractControl} = {};
    const props = Object.getOwnPropertyNames(obj);
    props.forEach(prop => {
      const propVal = obj[prop];

      const validator = validatorsMap && validatorsMap[prop] ? validatorsMap[prop] : undefined;

      let propControl: AbstractControl;
      if(propVal && typeof propVal === typeof {}) {
        propControl = FormControlUtil.fromObject(propVal, validator as ValidatorMap);
      } else if(propVal && Array.isArray(propVal)) {
        propControl = FormControlUtil.fromArray(propVal, validator as ValidatorMap);
      } else {
        propControl = FormControlUtil.fromValue(propVal, validator as Validators);
      }

      controls[prop] = propControl;
    });

    return new FormGroup(controls)
  }
  /**
   *
   * Builds a form array for this array.
   * Recursively adds form groups/form arrays/form controls depending on the values of the entries.
   *
   * @param obj The array to build a form from.
   * @param validatorsMap The validator to use for each entry (optional).
   */
  public static fromArray(obj: any[], validatorsMap?: ValidatorMap): FormArray {
    const controls: AbstractControl[] = [];
    obj.forEach(propVal => {
      let propControl: AbstractControl;

      if(typeof propVal === typeof {}) {
        propControl = FormControlUtil.fromObject(propVal, validatorsMap);
      } else if(Array.isArray(propVal)) {
        propControl = FormControlUtil.fromArray(propVal, validatorsMap);
      } else {
        propControl = FormControlUtil.fromValue(propVal, validatorsMap as Validators);
      }

      controls.push(propControl);
    });
    return new FormArray(controls)
  }

  /**
   * Convert from some kind of primitive or simple value (eg. number, string or Date)
   *
   * @param obj
   * @param validator
   * @private
   */
  private static fromValue(obj: any, validator?: Validators): FormControl {
    const validators = validator ? validator.validators : undefined;
    const asycValidators = validator ? validator.asyncValidators : undefined;
    return new FormControl(obj, validators, asycValidators);
  }

  /**
   * Convert a form back to an object, will recurse through the form to build complex objects.
   *
   * @param control
   */
  public static toObject(control: AbstractControl): any {
    if(control instanceof FormControl) {
      return (control as FormControl).value;

    } else if(control instanceof FormArray) {
      let vals: any[] = [];
      (control as FormArray).controls.forEach(control => {
        vals.push(FormControlUtil.toObject(control));
      })
      return vals;

    } else if(control instanceof FormGroup) {
      let obj: {[key: string]: any} = {}
      const controls = (control as FormGroup).controls;
      const props = Object.getOwnPropertyNames(controls);
      props.forEach(prop => {
        const childControl = controls[prop];
        if(controls[prop]) {
          obj[prop] = FormControlUtil.toObject(controls[prop])
        }
      });

      return obj;
    } else {
      // There are currently only FormControl, FormGroup, FormArray implementing AbstractControl
      console.error("Encountered unknown AbstractControl: " + control?.constructor?.name)
    }
  }
}

export class ValidatorMap {
  [propName: string]: Validators | ValidatorMap | null | undefined;
}

export class Validators {
  validators?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null;
  asyncValidators?: AsyncValidatorFn | AsyncValidatorFn[] | null;
}
