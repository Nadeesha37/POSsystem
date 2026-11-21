import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocationsService } from '../services/locations.service';
import { Branch, STATUSES } from '../models/location.model';
import {
  branchErrorText,
  createBranchForm,
  duplicateBranchFields,
  toBranchInput
} from '../utils/location-forms';

@Component({
  selector: 'app-add-branch-dialog',
  templateUrl: './add-branch-dialog.component.html',
  styleUrls: ['./add-branch-dialog.component.css']
})
export class AddBranchDialogComponent {
  @Input() branches: Branch[] = [];
  @Output() saved = new EventEmitter<Branch>();
  @Output() closed = new EventEmitter<void>();

  readonly statuses = STATUSES;

  form: FormGroup;
  attempted = false;                 // Save click karata passe vitharak validation pennana
  saving = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private locations: LocationsService) {
    this.form = createBranchForm(this.fb);
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
      next: branch => this.saved.emit(branch),
      error: (e: Error) => {
        this.saving = false;
        this.errorMessage = e.message;
      }
    });
  }
}
