import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocationsService } from '../services/locations.service';
import { Branch, STATUSES } from '../models/location.model';
import {
  branchErrorText,
  createBranchForm,
  duplicateBranchFields,
  toBranchInput
} from '../utils/location-forms';

@Component({
  selector: 'app-add-branch',
  templateUrl: './add-branch.component.html',
  styleUrls: ['./add-branch.component.css']
})
export class AddBranchComponent implements OnInit {
  readonly statuses = STATUSES;

  form: FormGroup;
  attempted = false;                 // Save click kalata passe vitarak validation pennana
  saving = false;
  errorMessage = '';
  private branches: Branch[] = [];

  constructor(
    private fb: FormBuilder,
    private locations: LocationsService,
    private router: Router
  ) {
    this.form = createBranchForm(this.fb);
  }

  ngOnInit(): void {
    this.locations.getBranches().subscribe(branches => (this.branches = branches));
  }

  showError(field: string): boolean {
    const control = this.form.get(field);
    return !!control && control.invalid && this.attempted;
  }

  errorText(field: string): string {
    return branchErrorText(this.form, field);
  }

  onSubmit(): void {
    if (this.saving) return;

    this.attempted = true;
    if (this.form.invalid) return;

    const input = toBranchInput(this.form.value);
    const duplicates = duplicateBranchFields(this.branches, input);
    if (duplicates.length > 0) {
      duplicates.forEach(field => this.form.get(field)?.setErrors({ duplicate: true }));
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    this.locations.createBranch(input).subscribe({
      next: branch =>
        this.router.navigate(['/locations/branch-settings'], { queryParams: { selected: branch.id } }),
      error: (e: Error) => {
        this.saving = false;
        this.errorMessage = e.message;
      }
    });
  }
}
