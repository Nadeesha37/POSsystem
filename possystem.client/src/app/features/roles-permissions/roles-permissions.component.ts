import { Component, OnDestroy, OnInit } from '@angular/core';
import { RolesService } from './services/roles.service';
import {
  ModulePermission,
  NewRoleInput,
  PERMISSION_ACTIONS,
  PermissionAction,
  Role,
  StaffUser,
  TILL_ACTIONS,
  getInitials
} from './models/role.model';

@Component({
  selector: 'app-roles-permissions',
  templateUrl: './roles-permissions.component.html',
  styleUrls: ['./roles-permissions.component.css']
})
export class RolesPermissionsComponent implements OnInit, OnDestroy {
  readonly actions = PERMISSION_ACTIONS;
  readonly tillActions = TILL_ACTIONS;
  readonly initials = getInitials;

  roles: Role[] = [];
  users: StaffUser[] = [];
  selectedId: number | null = null;
  draft: Role | null = null;          // editor eke edit karana copy eka (Save karanakam original ekata balapanne ne)

  showNewRoleDialog = false;
  showAssignDialog = false;
  saveAttempted = false;              // Save click kalata passe vitarai validation eka pennanne

  message = '';
  messageType: 'success' | 'error' = 'success';

  private original = '';
  private messageTimer?: ReturnType<typeof setTimeout>;

  constructor(private rolesService: RolesService) {}

  ngOnInit(): void {
    this.rolesService.getUsers().subscribe(users => (this.users = users));
    this.rolesService.getRoles().subscribe(roles => {
      this.roles = roles;
      if (roles.length > 0) {
        this.openRole(roles[0]);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
  }

  // ---------- Role list ----------

  trackByRole(index: number, role: Role): number {
    return role.id;
  }

  userCount(roleId: number): number {
    return this.users.filter(u => u.roleId === roleId).length;
  }

  roleSummary(role: Role): string {
    const count = this.userCount(role.id);
    const users = `${count} ${count === 1 ? 'user' : 'users'}`;
    return role.locked ? `Full access · ${users} · locked` : users;
  }

  selectRole(role: Role): void {
    if (role.id === this.selectedId || !this.canLeave()) return;
    this.openRole(role);
  }

  // ---------- Editor state ----------

  get assignedUsers(): StaffUser[] {
    return this.users.filter(u => u.roleId === this.selectedId);
  }

  get isDirty(): boolean {
    return !!this.draft && JSON.stringify(this.draft) !== this.original;
  }

  get nameError(): string {
    if (!this.draft) return '';
    const name = this.draft.name.trim();
    if (!name) return 'Role name is required';
    if (name.length > 40) return 'Role name must be 40 characters or less';

    const taken = this.roles.some(
      r => r.id !== this.draft!.id && r.name.toLowerCase() === name.toLowerCase()
    );
    return taken ? 'A role with this name already exists' : '';
  }

  get discountError(): string {
    const value = this.draft?.maxDiscountPercent;
    if (value == null || Number.isNaN(value) || value < 0 || value > 100) {
      return 'Enter a number between 0 and 100';
    }
    return '';
  }

  onToggle(module: ModulePermission, action: PermissionAction, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    module.actions[action] = checked;

    if (action === 'view' && !checked) {
      // View access nettam wena kisima access ekak ne
      for (const other of this.actions) {
        if (other !== 'view' && module.actions[other] !== undefined) {
          module.actions[other] = false;
        }
      }
    } else if (action !== 'view' && checked && module.actions['view'] !== undefined) {
      // Create / edit / delete / view 
      module.actions['view'] = true;
    }
  }

  // ---------- Actions ----------

  saveChanges(): void {
    if (!this.draft || this.draft.locked) return;

    this.saveAttempted = true;
    if (this.nameError || this.discountError) return;

    const toSave: Role = {
      ...this.draft,
      name: this.draft.name.trim(),
      description: this.draft.description.trim()
    };

    this.rolesService.saveRole(toSave).subscribe({
      next: saved => {
        this.roles = this.roles.map(r => (r.id === saved.id ? saved : r));
        this.openRole(saved);
        this.showMessage('Changes saved', 'success');
      },
      error: (e: Error) => this.showMessage(e.message, 'error')
    });
  }

  duplicateRole(): void {
    if (!this.draft || !this.canLeave()) return;

    this.rolesService.duplicateRole(this.draft.id).subscribe({
      next: role => {
        this.roles = [...this.roles, role];
        this.openRole(role);
        this.showMessage(`Created "${role.name}"`, 'success');
      },
      error: (e: Error) => this.showMessage(e.message, 'error')
    });
  }

  deleteRole(): void {
    const role = this.draft;
    if (!role || role.locked) return;
    if (!confirm(`Delete the role "${role.name}"?`)) return;

    this.rolesService.deleteRole(role.id).subscribe({
      next: () => {
        this.roles = this.roles.filter(r => r.id !== role.id);
        if (this.roles.length > 0) {
          this.openRole(this.roles[0]);
        } else {
          this.draft = null;
          this.selectedId = null;
        }
        this.showMessage('Role deleted', 'success');
      },
      error: (e: Error) => this.showMessage(e.message, 'error')
    });
  }

  // ---------- Dialogs ----------

  openNewRoleDialog(): void {
    if (this.canLeave()) {
      this.showNewRoleDialog = true;
    }
  }

  onRoleCreated(input: NewRoleInput): void {
    this.rolesService.createRole(input).subscribe({
      next: role => {
        this.roles = [...this.roles, role];
        this.showNewRoleDialog = false;
        this.openRole(role);
        this.showMessage(`Role "${role.name}" created`, 'success');
      },
      error: (e: Error) => {
        this.showNewRoleDialog = false;
        this.showMessage(e.message, 'error');
      }
    });
  }

  onUsersAssigned(userIds: number[]): void {
    if (!this.draft) return;
    const roleId = this.draft.id;
    const roleName = this.draft.name;

    this.rolesService.assignUsers(roleId, userIds).subscribe({
      next: () => {
        this.rolesService.getUsers().subscribe(users => (this.users = users));
        this.showAssignDialog = false;
        const count = userIds.length;
        this.showMessage(`${count} ${count === 1 ? 'user' : 'users'} assigned to ${roleName}`, 'success');
      },
      error: (e: Error) => {
        this.showAssignDialog = false;
        this.showMessage(e.message, 'error');
      }
    });
  }

  // ---------- Helpers ----------

  private openRole(role: Role): void {
    this.selectedId = role.id;
    this.draft = JSON.parse(JSON.stringify(role));
    this.original = JSON.stringify(role);
    this.saveAttempted = false;
  }

  private canLeave(): boolean {
    return !this.isDirty || confirm('You have unsaved changes. Discard them?');
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => (this.message = ''), 3500);
  }
}
