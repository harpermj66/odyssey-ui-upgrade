import {AbstractControl} from "@angular/forms";

export class EmailValidation {

    static matchEmail(abstractControl: AbstractControl) {
        const formGroup = abstractControl.parent;
        if (formGroup) {
            const emailControl = formGroup.get('email');
            const emailRepeatControl = formGroup.get('emailRepeat');

            if (emailControl && emailRepeatControl) {
                const email = emailControl.value;
                const emailRepeat = emailRepeatControl.value;
                if (email !== emailRepeat) {
                    return { matchEmail: true };
                } else {
                    return null;
                }
            }
        }

        return null;
    }
}
