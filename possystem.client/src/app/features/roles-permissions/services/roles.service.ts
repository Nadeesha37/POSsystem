import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MOCK_ROLES, MOCK_USERS } from '../data/mock-data';
import { NewRoleInput, Role, StaffUser, createModules, createTill } from '../models/role.model';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

// BACKEND eka awama arrays ain karala, hama method ekakma HttpClient call eken return karanna wenas karanna.
// Method names saha return types (Observable) ehemmama thiyena nisa components wlata wenask wenna oni ne.
@Injectable({ providedIn: 'root' })
export class RolesService {
  private roles: Role[] = clone(MOCK_ROLES);
  private users: StaffUser[] = clone(MOCK_USERS);
  private nextRoleId = Math.max(...this.roles.map(r => r.id)) + 1;

  getRoles(): Observable<Role[]> {
    return of(clone(this.roles));
  }

  getUsers(): Observable<StaffUser[]> {
    return of(clone(this.users));
  }

  createRole(input: NewRoleInput): Observable<Role> {
    const name = input.name.trim();
    if (this.isNameTaken(name)) {
      return throwError(() => new Error('A role with this name already exists'));
    }

    const source = this.roles.find(r => r.id === input.copyFromRoleId);
    const role: Role = {
      id: this.nextRoleId++,
      name,
      description: input.description.trim(),
      locked: false,
      modules: source ? clone(source.modules) : createModules(),
      till: source ? clone(source.till) : createTill(),
      maxDiscountPercent: source ? source.maxDiscountPercent : 0
    };

    this.roles.push(role);
    return of(clone(role));
  }

  saveRole(role: Role): Observable<Role> {
    const index = this.roles.findIndex(r => r.id === role.id);
    if (index === -1) {
      return throwError(() => new Error('Role not found'));
    }
    if (this.roles[index].locked) {
      return throwError(() => new Error('This role is locked and cannot be changed'));
    }
    if (this.isNameTaken(role.name, role.id)) {
      return throwError(() => new Error('A role with this name already exists'));
    }

    this.roles[index] = { ...clone(role), locked: false };
    return of(clone(this.roles[index]));
  }

  duplicateRole(id: number): Observable<Role> {
    const source = this.roles.find(r => r.id === id);
    if (!source) {
      return throwError(() => new Error('Role not found'));
    }

    let name = `${source.name} (copy)`;
    let counter = 2;
    while (this.isNameTaken(name)) {
      name = `${source.name} (copy ${counter++})`;
    }

    return this.createRole({
      name,
      description: source.description,
      copyFromRoleId: id
    });
  }

  deleteRole(id: number): Observable<void> {
    const role = this.roles.find(r => r.id === id);
    if (!role) {
      return throwError(() => new Error('Role not found'));
    }
    if (role.locked) {
      return throwError(() => new Error('This role is locked and cannot be deleted'));
    }
    if (this.users.some(u => u.roleId === id)) {
      return throwError(() => new Error("Move this role's users to another role before deleting it"));
    }

    this.roles = this.roles.filter(r => r.id !== id);
    return of(undefined);
  }

  assignUsers(roleId: number, userIds: number[]): Observable<void> {
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      return throwError(() => new Error('Role not found'));
    }
    if (role.locked) {
      return throwError(() => new Error('Users cannot be assigned to a locked role'));
    }

    this.users = this.users.map(u => (userIds.includes(u.id) ? { ...u, roleId } : u));
    return of(undefined);
  }

  private isNameTaken(name: string, ignoreId?: number): boolean {
    const wanted = name.trim().toLowerCase();
    return this.roles.some(r => r.id !== ignoreId && r.name.toLowerCase() === wanted);
  }
}
