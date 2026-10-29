import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MOCK_BRANCHES, MOCK_DEPARTMENTS } from '../data/mock-data';
import { Branch, Department, NewBranchInput, NewDepartmentInput } from '../models/location.model';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));


@Injectable({ providedIn: 'root' })
export class LocationsService {
  private branches: Branch[] = clone(MOCK_BRANCHES);
  private departments: Department[] = clone(MOCK_DEPARTMENTS);
  private nextBranchId = Math.max(0, ...this.branches.map(b => b.id)) + 1;
  private nextDepartmentId = Math.max(0, ...this.departments.map(d => d.id)) + 1;

  // ---------- Branches ----------

  getBranches(): Observable<Branch[]> {
    return of(clone(this.branches));
  }

  createBranch(input: NewBranchInput): Observable<Branch> {
    const clash = this.branchClash(input);
    if (clash) {
      return throwError(() => new Error(clash));
    }

    const branch: Branch = { ...input, id: this.nextBranchId++ };
    this.branches.push(branch);
    return of(clone(branch));
  }

  updateBranch(branch: Branch): Observable<Branch> {
    const index = this.branches.findIndex(b => b.id === branch.id);
    if (index === -1) {
      return throwError(() => new Error('Branch not found'));
    }

    const clash = this.branchClash(branch, branch.id);
    if (clash) {
      return throwError(() => new Error(clash));
    }

    this.branches[index] = clone(branch);
    return of(clone(this.branches[index]));
  }

  deleteBranch(id: number): Observable<void> {
    if (!this.branches.some(b => b.id === id)) {
      return throwError(() => new Error('Branch not found'));
    }
    if (this.departments.some(d => d.branchId === id)) {
      return throwError(() => new Error('Delete the departments of this branch before deleting the branch'));
    }

    this.branches = this.branches.filter(b => b.id !== id);
    return of(undefined);
  }

  // ---------- Departments ----------

  getDepartments(branchId?: number): Observable<Department[]> {
    const list = branchId === undefined
      ? this.departments
      : this.departments.filter(d => d.branchId === branchId);
    return of(clone(list));
  }

  createDepartment(input: NewDepartmentInput): Observable<Department> {
    if (!this.branches.some(b => b.id === input.branchId)) {
      return throwError(() => new Error('Branch not found'));
    }

    const clash = this.departmentClash(input);
    if (clash) {
      return throwError(() => new Error(clash));
    }

    const department: Department = { ...input, id: this.nextDepartmentId++ };
    this.departments.push(department);
    return of(clone(department));
  }

  updateDepartment(department: Department): Observable<Department> {
    const index = this.departments.findIndex(d => d.id === department.id);
    if (index === -1) {
      return throwError(() => new Error('Department not found'));
    }

    const clash = this.departmentClash(department, department.id);
    if (clash) {
      return throwError(() => new Error(clash));
    }

    this.departments[index] = clone(department);
    return of(clone(this.departments[index]));
  }

  deleteDepartment(id: number): Observable<void> {
    if (!this.departments.some(d => d.id === id)) {
      return throwError(() => new Error('Department not found'));
    }

    this.departments = this.departments.filter(d => d.id !== id);
    return of(undefined);
  }

  // ---------- Helpers ----------

  private branchClash(input: NewBranchInput, ignoreId?: number): string {
    const name = input.name.toLowerCase();
    const code = input.code.toLowerCase();

    for (const b of this.branches) {
      if (b.id === ignoreId) continue;
      if (b.name.toLowerCase() === name) return 'A branch with this name already exists';
      if (b.code.toLowerCase() === code) return 'A branch with this code already exists';
    }
    return '';
  }

  private departmentClash(input: NewDepartmentInput, ignoreId?: number): string {
    const name = input.name.toLowerCase();
    const code = input.code.toLowerCase();

    for (const d of this.departments) {
      if (d.id === ignoreId || d.branchId !== input.branchId) continue;
      if (d.name.toLowerCase() === name) return 'A department with this name already exists in this branch';
      if (d.code.toLowerCase() === code) return 'A department with this code already exists in this branch';
    }
    return '';
  }
}
