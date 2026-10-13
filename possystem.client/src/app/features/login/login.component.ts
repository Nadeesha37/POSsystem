import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  private readonly VALID_USERNAME = 'admin';
  private readonly VALID_PASSWORD = 'admin123';

  constructor(private router: Router) {}

  onLogin(): void {
    if (this.username === this.VALID_USERNAME && this.password === this.VALID_PASSWORD) {
      this.errorMessage = '';
      this.router.navigate(['/dashboard']);
    } else {
      this.errorMessage = 'Invalid username or password';
    }
  }
}
