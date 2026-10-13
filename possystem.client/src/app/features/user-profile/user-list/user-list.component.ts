import { Component } from '@angular/core';

export interface User {
  name: string;
  role: string;
  email: string;
  phone: string;
  status: string;
}

export const userList: User[] = [
  { name: 'Savinu', role: 'Cashier', email: 'savinu@gmail.com', phone: '123456', status: 'Active' },
  { name: 'Netha', role: 'Manager', email: 'netha@gmail.com', phone: '123457', status: 'Active' },
  { name: 'Nadeesha', role: 'Stock Manager', email: 'nadeesha@gmail.com', phone: '123458', status: 'Pending' },
  { name: 'Roy', role: 'Sales Associate', email: 'roy@gmail.com', phone: '123459', status: 'Inactive' },
  { name: 'Boy', role: 'Supervisor', email: 'boy@gmail.com', phone: '123460', status: 'Active' },
  { name: 'Achintha', role: 'Cashier', email: 'achintha@gmail.com', phone: '123461', status: 'Pending' },
  { name: 'Thevinu', role: 'Cashier', email: 'thevinu@gmail.com', phone: '11111111', status: 'Pending' }
];

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent {
  searchText = '';
  selectedUser: User | null = null;
  users = userList;
  private selectedUserIndex: number | null = null;

  get filteredUsers(): User[] {
    const text = this.searchText.trim().toLowerCase();

    if (!text) {
      return this.users;
    }

    return this.users.filter((user) =>
      user.name.toLowerCase().includes(text) ||
      user.role.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text)
    );
  }

  editUser(user: User) {
    this.selectedUser = { ...user };
    this.selectedUserIndex = this.users.indexOf(user);
  }

  saveUser() {
    if (!this.selectedUser) {
      return;
    }

    if (this.selectedUserIndex !== null) {
      this.users[this.selectedUserIndex] = this.selectedUser;
    }

    this.selectedUser = null;
    this.selectedUserIndex = null;
  }

  deleteUser(userToDelete: User) {
    const index = this.users.indexOf(userToDelete);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Active':
        return 'bg-success';
      case 'Pending':
        return 'bg-warning text-dark';
      case 'Inactive':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  }
}
