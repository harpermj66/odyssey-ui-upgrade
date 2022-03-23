import {AbstractControl} from "@angular/forms";

export class PasswordValidation {

    static MIN_LENGTH = 6;
    static MAX_LENGTH = 20;

    static matchPassword(abstractControl: AbstractControl) {
        const formGroup = abstractControl.parent;
        if (formGroup) {
            const passwordControl = formGroup.get('password');
            const confirmPasswordControl = formGroup.get('passwordRepeat');

            if (passwordControl && confirmPasswordControl) {
                const password = passwordControl.value;
                const confirmPassword = confirmPasswordControl.value;
                if (password !== confirmPassword) {
                    return { matchPassword: true };
                } else {
                    return null;
                }
            }
        }

        return null;
    }
}
