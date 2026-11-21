import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocationsService } from '../services/locations.service';
import { Branch, Department, STATUSES } from '../models/location.model';
import {
  createDepartmentForm,
  departmentErrorText,
  duplicateDepartmentFields,
  toDepartmentInput
} from '../utils/location-forms';

@Component({
  selector: 'app-add-department-dialog',
  templateUrl: './add-department-dialog.component.html',
  styleUrls: ['./add-department-dialog.component.css']
})
export class AddDepartmentDialogComponent implements OnInit {
  @Input() branches: Branch[] = [];          // Active branches vitharai
  @Input() departments: Department[] = [];   // duplicate check ekata
  @Input() branchId: number | null = null;   // select wela thiyena branch eka (preset)
  @Output() saved = new EventEmitter<Department>();
  @Output() closed = new EventEmitter<void>();

  readonly statuses = STATUSES;

  form: FormGroup;
  attempted = false;
  saving = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private locations: LocationsService) {
    this.form = createDepartmentForm(this.fb);
  }

  ngOnInit(): void {
    if (this.branches.some(b => b.id === this.branchId)) {
      this.form.patchValue({ branchId: this.branchId });
    }
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
      next: department => this.saved.emit(department),
      error: (e: Error) => {
        this.saving = false;
        this.errorMessage = e.message;
      }
    });
  }
}
