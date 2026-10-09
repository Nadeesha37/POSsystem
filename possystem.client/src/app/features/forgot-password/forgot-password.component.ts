import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { EMAIL_PATTERN } from '../../core/validators/password.validators';
import { sanitizeText } from '../../core/utils/sanitize';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnDestroy {
  form: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  cooldown = 0;
  private timer?: ReturnType<typeof setInterval>;

  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.maxLength(100),
        Validators.pattern(EMAIL_PATTERN)
      ]]
    });
  }

  get email() {
    return this.form.get('email');
  }

  onSubmit(): void {
    if (this.loading || this.cooldown > 0) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = sanitizeText(this.form.value.email, 100).toLowerCase();
    this.loading = true;
    this.errorMessage = '';

    this.auth.requestPasswordReset(email).subscribe({
      next: () => {
        this.loading = false;
        this.submitted = true;
        this.form.reset();
        this.startCooldown(60);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Something went wrong. Please try again later.';
      }
    });
  }

  private startCooldown(seconds: number): void {
    this.cooldown = seconds;
    this.timer = setInterval(() => {
      this.cooldown--;
      if (this.cooldown <= 0 && this.timer) {
        clearInterval(this.timer);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }
}
