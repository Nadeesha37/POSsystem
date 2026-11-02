import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LocationsService } from '../services/locations.service';
import { Branch, Department, STATUSES } from '../models/location.model';
import {
  createDepartmentForm,
  departmentErrorText,
  duplicateDepartmentFields,
  toDepartmentInput
} from '../utils/location-forms';

@Component({
  selector: 'app-add-department',
  templateUrl: './add-department.component.html',
  styleUrls: ['./add-department.component.css']
})
export class AddDepartmentComponent implements OnInit {
  readonly statuses = STATUSES;

  form: FormGroup;
  attempted = false;                 // Save click kalata passe vitarak validation pennnana
  saving = false;
  errorMessage = '';
  branches: Branch[] = [];           // Active branches vitharai dropdown
  private departments: Department[] = [];

  constructor(
    private fb: FormBuilder,
    private locations: LocationsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = createDepartmentForm(this.fb);
  }

  ngOnInit(): void {
    this.locations.getDepartments().subscribe(departments => (this.departments = departments));

    this.locations.getBranches().subscribe(branches => {
      this.branches = branches.filter(b => b.status === 'Active');

      // Branch Settings 
      const preset = Number(this.route.snapshot.queryParamMap.get('branchId'));
      if (this.branches.some(b => b.id === preset)) {
        this.form.patchValue({ branchId: preset });
      }
    });
  }

  showError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && this.attempted;
  }

  errorText(field: string): string {
    return departmentErrorText(this.form, field);
  }

  onSubmit(): void {
    if (this.saving) return;

    this.attempted = true;
    if (this.form.invalid) return;

    const input = toDepartmentInput(this.form.value);
    const duplicates = duplicateDepartmentFields(this.departments, input);
    if (duplicates.length > 0) {
      duplicates.forEach(field => this.form.get(field)?.setErrors({ duplicate: true }));
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.locations.createDepartment(input).subscribe({
      next: department =>
        this.router.navigate(['/locations/branch-settings'], {
          queryParams: { selected: department.branchId }
        }),
      error: (e: Error) => {
        this.saving = false;
        this.errorMessage = e.message;
      }
    });
  }
}
