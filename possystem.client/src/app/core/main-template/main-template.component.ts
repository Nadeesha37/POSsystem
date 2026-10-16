import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { IdleTimeoutService } from '../services/idle-timeout.service';
import { ACCESS, Role } from '../models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  roles?: Role[];        
  children?: MenuItem[];
}

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrl: './main-template.component.css'
})
export class MainTemplateComponent implements OnInit, OnDestroy {

  private readonly allMenuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Users',
      icon: 'groups',
      roles: ACCESS.users,
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
      route: '/reports',
      roles: ACCESS.reports
    }
  ];

  menuItems: MenuItem[];

  profileMenuOpen = false;

  constructor(private auth: AuthService, private idle: IdleTimeoutService) {
    this.menuItems = this.filterByRole(this.allMenuItems);
  }

  get user() {
    return this.auth.currentUser;
  }

  ngOnInit(): void {
    this.idle.start();
  }

  ngOnDestroy(): void {
    this.idle.stop();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.idle.stop();
    this.auth.logout();
  }

  private filterByRole(items: MenuItem[]): MenuItem[] {
    return items
      .filter(item => !item.roles || this.auth.hasRole(...item.roles))
      .map(item =>
        item.children
          ? { ...item, children: this.filterByRole(item.children) }
          : item
      );
  }
}
