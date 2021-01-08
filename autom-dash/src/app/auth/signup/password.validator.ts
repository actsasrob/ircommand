/** The password and verify_password fields must match */
import {FormControl, FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors} from "@angular/forms";

export const PasswordValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const password = control.get('password');
  const verify_password = control.get('verify_password');

  return password && verify_password && password.value === verify_password.value ? null : { passwordMismatch: true };
};
