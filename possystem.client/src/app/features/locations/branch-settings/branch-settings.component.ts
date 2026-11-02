import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LocationsService } from '../services/locations.service';
import { Branch, Department, LocationStatus, STATUSES } from '../models/location.model';
import {
  branchErrorText,
  createBranchForm,
  duplicateBranchFields,
  toBranchInput
} from '../utils/location-forms';

@Component({
  selector: 'app-branch-settings',
  templateUrl: './branch-settings.component.html',
  styleUrls: ['./branch-settings.component.css']
})
export class BranchSettingsComponent implements OnInit, OnDestroy {
  readonly statuses = STATUSES;

  branches: Branch[] = [];
  departments: Department[] = [];
  selectedId: number | null = null;

  search = '';
  statusFilter: 'All' | LocationStatus = 'All';

  form: FormGroup;
  attempted = false;                 // Save click karata passe vitharak validation pennana

  message = '';
  messageType: 'success' | 'error' = 'success';
  private messageTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private fb: FormBuilder,
    private locations: LocationsService,
    private route: ActivatedRoute
  ) {
    this.form = createBranchForm(this.fb);
  }

  ngOnInit(): void {
    this.locations.getDepartments().subscribe(departments => (this.departments = departments));

    this.locations.getBranches().subscribe(branches => {
      this.branches = branches;

      // Add Branch / Add Department පිටුවෙන් ආවොත් අලුත් එක select කරනවා
      const wanted = Number(this.route.snapshot.queryParamMap.get('selected'));
      const target = branches.find(b => b.id === wanted) ?? branches[0];
      if (target) {
        this.openBranch(target);
      }
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.messageTimer);
  }

  // ---------- List ----------

  get filteredBranches(): Branch[] {
    const query = this.search.trim().toLowerCase();
    return this.branches.filter(b =>
      (this.statusFilter === 'All' || b.status === this.statusFilter) &&
      (!query || `${b.name} ${b.code} ${b.city}`.toLowerCase().includes(query))
    );
  }

  get selectedBranch(): Branch | undefined {
    return this.branches.find(b => b.id === this.selectedId);
  }

  get branchDepartments(): Department[] {
    return this.departments.filter(d => d.branchId === this.selectedId);
  }

  departmentCount(branchId: number): number {
    return this.departments.filter(d => d.branchId === branchId).length;
  }

  trackByBranch(index: number, branch: Branch): number {
    return branch.id;
  }

  trackByDepartment(index: number, department: Department): number {
    return department.id;
  }

  selectBranch(branch: Branch): void {
    if (branch.id === this.selectedId || !this.canLeave()) return;
    this.openBranch(branch);
  }

  // ---------- Form ----------

  showError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && this.attempted;
  }

  errorText(field: string): string {
    return branchErrorText(this.form, field);
  }

  saveChanges(): void {
    const current = this.selectedBranch;
    if (!current) return;

    this.attempted = true;
    if (this.form.invalid) return;

    const input = toBranchInput(this.form.value);
    const duplicates = duplicateBranchFields(this.branches, input, current.id);
    if (duplicates.length > 0) {
      duplicates.forEach(field => this.form.get(field)?.setErrors({ duplicate: true }));
      return;
    }

    this.locations.updateBranch({ ...input, id: current.id }).subscribe({
      next: saved => {
        this.branches = this.branches.map(b => (b.id === saved.id ? saved : b));
        this.openBranch(saved);
        this.showMessage('Changes saved', 'success');
      },
      error: (e: Error) => this.showMessage(e.message, 'error')
    });
  }

  deleteBranch(): void {
    const branch = this.selectedBranch;
    if (!branch || !confirm(`Delete the branch "${branch.name}"?`)) return;

    this.locations.deleteBranch(branch.id).subscribe({
      next: () => {
        this.branches = this.branches.filter(b => b.id !== branch.id);
        if (this.branches.length > 0) {
          this.openBranch(this.branches[0]);
        } else {
          this.selectedId = null;
        }
        this.showMessage('Branch deleted', 'success');
      },
      error: (e: Error) => this.showMessage(e.message, 'error')
    });
  }

  // ---------- Departments ----------

  toggleDepartment(department: Department): void {
    const updated: Department = {
      ...department,
      status: department.status === 'Active' ? 'Inactive' : 'Active'
    };

    this.locations.updateDepartment(updated).subscribe({
      next: saved => (this.departments = this.departments.map(d => (d.id === saved.id ? saved : d))),
      error: (e: Error) => this.showMessage(e.message, 'error')
    });
  }

  deleteDepartment(department: Department): void {
    if (!confirm(`Delete the department "${department.name}"?`)) return;

    this.locations.deleteDepartment(department.id).subscribe({
      next: () => {
        this.departments = this.departments.filter(d => d.id !== department.id);
        this.showMessage('Department deleted', 'success');
      },
      error: (e: Error) => this.showMessage(e.message, 'error')
    });
  }

  // ---------- Helpers ----------

  private openBranch(branch: Branch): void {
    this.selectedId = branch.id;
    this.attempted = false;
    this.form.reset({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      status: branch.status
    });
  }

  private canLeave(): boolean {
    return !this.form.dirty || confirm('You have unsaved changes. Discard them?');
  }

  private showMessage(text: string, type: 'success' | 'error'): void {
    this.message = text;
    this.messageType = type;
    clearTimeout(this.messageTimer);
    this.messageTimer = setTimeout(() => (this.message = ''), 3500);
  }
}
