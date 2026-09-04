import { Component } from '@angular/core';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrl: './main-template.component.css'
})
export class MainTemplateComponent {

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Users',
      icon: 'groups',
      children: [
        {
          label: 'User List',
          icon: 'supervisor_account',
          route: '/users'
        },
        {
          label: 'Add User',
          icon: 'contact_page',
          route: '/users/create'
        }
      ]
    },
    {
      label: 'Reports',
      icon: 'assessment',
      route: '/reports'
    }
  ];

  profileMenuOpen = false;

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }
}
