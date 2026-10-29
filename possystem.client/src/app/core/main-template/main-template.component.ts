import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { IdleTimeoutService } from '../services/idle-timeout.service';
import { ACCESS, Role } from '../models/user.model';

interface MenuItem {
  label: string;
  icon: string;
  route?: string;
  roles?: Role[];
  collapsible?: boolean;      
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
    },
    {
      label: 'Locations',
      icon: 'location_on',
      roles: ACCESS.locations,
      collapsible: true,
      children: [
        { label: 'Branch Settings', icon: 'store', route: '/locations/branch-settings' },
        { label: 'Add Branch', icon: 'add_business', route: '/locations/add-branch' },
        { label: 'Add Department', icon: 'account_tree', route: '/locations/add-department' }
      ]
    },
    {
      label: 'Roles & Permissions',
      icon: 'admin_panel_settings',
      route: '/roles-permissions',
      roles: ACCESS.roles
    }
  ];

  menuItems: MenuItem[];

  profileMenuOpen = false;

  expanded = new Set<string>();           
  private routeSub?: Subscription;

  constructor(
    private auth: AuthService,
    private idle: IdleTimeoutService,
    private router: Router
  ) {
    this.menuItems = this.filterByRole(this.allMenuItems);
  }

  get user() {
    return this.auth.currentUser;
  }

  ngOnInit(): void {
    this.idle.start();

    
    this.openActiveGroup(this.router.url);
    this.routeSub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(e => this.openActiveGroup(e.urlAfterRedirects));
  }

  ngOnDestroy(): void {
    this.idle.stop();
    this.routeSub?.unsubscribe();
  }

  toggleProfileMenu(): void {
    this.profileMenuOpen = !this.profileMenuOpen;
  }

  logout(): void {
    this.profileMenuOpen = false;
    this.idle.stop();
    this.auth.logout();
  }


  isOpen(menu: MenuItem): boolean {
    return !menu.collapsible || this.expanded.has(menu.label);
  }

  toggleMenu(menu: MenuItem): void {
    if (!menu.collapsible) return;

    if (this.expanded.has(menu.label)) {
      this.expanded.delete(menu.label);
    } else {
      this.expanded.add(menu.label);
    }
  }

  private openActiveGroup(url: string): void {
    for (const item of this.menuItems) {
      if (item.collapsible && item.children?.some(c => c.route && url.startsWith(c.route))) {
        this.expanded.add(item.label);
      }
    }
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
