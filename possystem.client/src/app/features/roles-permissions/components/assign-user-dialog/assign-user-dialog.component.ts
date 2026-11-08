import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Role, StaffUser, getInitials } from '../../models/role.model';

@Component({
  selector: 'app-assign-user-dialog',
  templateUrl: './assign-user-dialog.component.html',
  styleUrls: ['./assign-user-dialog.component.css']
})
export class AssignUserDialogComponent implements OnInit {
  @Input() role!: Role;
  @Input() roles: Role[] = [];
  @Input() users: StaffUser[] = [];
  @Output() assigned = new EventEmitter<number[]>();   // final members list
  @Output() closed = new EventEmitter<void>();

  search = '';
  list: StaffUser[] = [];
  private original = new Set<number>();   // dialog open karaddi inna members
  private selected = new Set<number>();   // dan tick karala thiyena ayawa

  ngOnInit(): void {
    const members = this.users.filter(u => u.roleId === this.role.id);
    this.original = new Set(members.map(m => m.id));
    this.selected = new Set(this.original);
    // members udama, passe wena staff
    this.list = [...members, ...this.users.filter(u => u.roleId !== this.role.id)];
  }

  get memberCount(): number { return this.original.size; }

  get selectedCount(): number { return this.selected.size; }

  get filtered(): StaffUser[] {
    const q = this.search.trim().toLowerCase();
    return q ? this.list.filter(u => u.name.toLowerCase().includes(q)) : this.list;
  }

  get addedCount(): number {
    return [...this.selected].filter(id => !this.original.has(id)).length;
  }

  get hasChanges(): boolean {
    if (this.selected.size !== this.original.size) return true;
    return [...this.selected].some(id => !this.original.has(id));
  }

  isSelected(id: number): boolean { return this.selected.has(id); }

  isOriginal(id: number): boolean { return this.original.has(id); }

  toggle(id: number): void {
    this.selected.has(id) ? this.selected.delete(id) : this.selected.add(id);
  }

  trackByUser(_: number, u: StaffUser): number { return u.id; }

  initials(name: string): string { return getInitials(name); }

  roleName(roleId: number | null): string {
    return this.roles.find(r => r.id === roleId)?.name ?? 'No role';
  }

  submit(): void {
    if (!this.hasChanges) return;
    this.assigned.emit([...this.selected]);
  }
}
