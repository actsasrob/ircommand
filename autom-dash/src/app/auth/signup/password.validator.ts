/** The password and verify_password fields must match */
import {FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors} from "@angular/forms";

export const PasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const confirm = control.get('confirm');

  return password && confirm && password.value === confirm.value ? null : { passwordMismatch: true };
};
