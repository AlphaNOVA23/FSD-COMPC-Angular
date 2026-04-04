import { FormGroup } from '@angular/forms';

export const passwordMatchvValidator = (form: FormGroup) => {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMistMach: true };
};
