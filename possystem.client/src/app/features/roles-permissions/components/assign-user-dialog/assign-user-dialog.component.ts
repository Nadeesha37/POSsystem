import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role, StaffUser, getInitials } from '../../models/role.model';

@Component({
  selector: 'app-assign-user-dialog',
  templateUrl: './assign-user-dialog.component.html',
  styleUrls: ['./assign-user-dialog.component.css']
})
export class AssignUserDialogComponent implements OnInit {
  @Input({ required: true }) role!: Role;
  @Input() roles: Role[] = [];
  @Input() users: StaffUser[] = [];
  @Output() assigned = new EventEmitter<number[]>();
  @Output() closed = new EventEmitter<void>();

  readonly initials = getInitials;

  search = '';
  memberCount = 0;
  candidates: StaffUser[] = [];         // me role eke nati aya
  private selected = new Set<number>();

  ngOnInit(): void {
    this.memberCount = this.users.filter(u => u.roleId === this.role.id).length;
    this.candidates = this.users.filter(u => u.roleId !== this.role.id);
  }

  get filtered(): StaffUser[] {
    const query = this.search.trim().toLowerCase();
    return query
      ? this.candidates.filter(u => u.name.toLowerCase().includes(query))
      : this.candidates;
  }

  get selectedCount(): number {
    return this.selected.size;
  }

  isSelected(id: number): boolean {
    return this.selected.has(id);
  }

  toggle(id: number): void {
    if (this.selected.has(id)) {
      this.selected.delete(id);
    } else {
      this.selected.add(id);
    }
  }

  roleName(roleId: number): string {
    return this.roles.find(r => r.id === roleId)?.name ?? '';
  }

  trackByUser(index: number, user: StaffUser): number {
    return user.id;
  }

  submit(): void {
    if (this.selected.size === 0) return;
    this.assigned.emit(Array.from(this.selected));
  }
}
