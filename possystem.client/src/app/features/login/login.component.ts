import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: AuthService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z0-9@._-]+$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.maxLength(100)
      ]]
    });
  }

  onLogin(): void {
    if (this.loading) return;

    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const username = (this.loginForm.value.username as string).trim();
    const password = this.loginForm.value.password as string;

    this.loading = true;
    this.errorMessage = '';

    this.auth.login(username, password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password';
      }
    });
  }

  showError(name: 'username' | 'password'): boolean {
    const control = this.loginForm.get(name);
    return !!control && control.invalid && this.submitted;
  }

  errorText(name: 'username' | 'password'): string {
    const errors = this.loginForm.get(name)?.errors;
    if (!errors) return '';

    if (errors['required']) {
      return name === 'username' ? 'Username is required' : 'Password is required';
    }
    if (errors['pattern']) {
      return 'Username has invalid characters';
    }
    return 'Invalid value';
  }
}
