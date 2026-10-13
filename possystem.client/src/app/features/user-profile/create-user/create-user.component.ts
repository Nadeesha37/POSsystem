import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { userList } from '../user-list/user-list.component';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.css'
})
export class CreateUserComponent {
  user = {
    name: '',
    role: '',
    email: '',
    phone: '',
    status: 'Active'
  };

  constructor(private router: Router) {}

  saveUser(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    userList.push({ ...this.user });
    this.router.navigate(['/users']);
  }
}