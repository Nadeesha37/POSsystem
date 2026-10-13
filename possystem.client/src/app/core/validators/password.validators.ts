import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export function strongPassword(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v: string = control.value ?? '';
    if (!v) return null;

    const errors: ValidationErrors = {};
    if (!/[a-z]/.test(v)) errors['lowercase'] = true;
    if (!/[A-Z]/.test(v)) errors['uppercase'] = true;
    if (!/[0-9]/.test(v)) errors['digit'] = true;
    if (!/[^A-Za-z0-9]/.test(v)) errors['special'] = true;

    return Object.keys(errors).length ? errors : null;
  };
}

export function matchFields(field: string, matchTo: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const a = group.get(field)?.value;
    const b = group.get(matchTo)?.value;
    return a && b && a !== b ? { mismatch: true } : null;
  };
}
