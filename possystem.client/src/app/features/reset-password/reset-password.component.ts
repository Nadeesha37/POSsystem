import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { matchFields, strongPassword } from '../../core/validators/password.validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  loading = false;
  success = false;
  tokenInvalid = false;
  showPassword = false;
  attempted = false;
  errorMessage = '';
  private token = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService
  ) {
    this.form = this.fb.group({
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(64),
        strongPassword()
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: matchFields('newPassword', 'confirmPassword') });
  }

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';

    // Basic token format check (real verification happens on the backend)
    if (!/^[A-Za-z0-9_-]{20,200}$/.test(token)) {
      this.tokenInvalid = true;
      return;
    }

    this.token = token;

    // Remove the token from the URL so it does not stay in history or leak via referrer
    this.router.navigate([], { relativeTo: this.route, queryParams: {}, replaceUrl: true });
  }

  get rules() {
    const v: string = this.form.get('newPassword')?.value ?? '';
    return [
      { label: 'At least 8 characters', ok: v.length >= 8 },
      { label: 'Uppercase and lowercase letters', ok: /[a-z]/.test(v) && /[A-Z]/.test(v) },
      { label: 'At least one number', ok: /[0-9]/.test(v) },
      { label: 'At least one special character', ok: /[^A-Za-z0-9]/.test(v) }
    ];
  }

  get strength(): number {
    return this.rules.filter(r => r.ok).length;
  }

  get strengthLabel(): string {
    return ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'][this.strength];
  }

  get strengthClass(): string {
    return ['bg-danger', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'][this.strength];
  }

  onSubmit(): void {
    if (this.loading) return;

    this.attempted = true;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // The password is sent exactly as typed (never sanitized or changed)
    const newPassword: string = this.form.value.newPassword;

    this.auth.resetPassword(this.token, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.attempted = false;
        this.token = '';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'This reset link is invalid or has expired. Please request a new one.';
      }
    });
  }

  showError(name: 'newPassword' | 'confirmPassword'): boolean {
    if (!this.attempted) return false;

    const control = this.form.get(name);
    if (!control) return false;

    return name === 'confirmPassword'
      ? control.invalid || this.form.hasError('mismatch')
      : control.invalid;
  }

  errorText(name: 'newPassword' | 'confirmPassword'): string {
    if (name === 'newPassword') {
      const errors = this.form.get('newPassword')?.errors;
      if (errors?.['required']) return 'New password is required';
      return 'Password does not meet the requirements';
    }

    if (this.form.get('confirmPassword')?.errors?.['required']) {
      return 'Please confirm your password';
    }
    return 'Passwords do not match';
  }
}
