import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sanitizeText } from '../../../core/utils/sanitize';
import {
  Branch,
  CODE_PATTERN,
  Department,
  EMAIL_PATTERN,
  NewBranchInput,
  NewDepartmentInput,
  PHONE_PATTERN
} from '../models/location.model';

// =============== Branch ===============

const BRANCH_LABELS: Record<string, string> = {
  name: 'Branch name',
  code: 'Branch code',
  address: 'Address',
  city: 'City',
  phone: 'Phone number',
  email: 'Email',
  manager: 'Manager name'
};

const BRANCH_PATTERN_MESSAGES: Record<string, string> = {
  code: 'Use 2 to 10 letters, numbers or hyphens',
  phone: 'Enter a valid phone number',
  email: 'Enter a valid email address'
};

export function createBranchForm(fb: FormBuilder): FormGroup {
  return fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    code: ['', [Validators.required, Validators.pattern(CODE_PATTERN)]],
    address: ['', [Validators.required, Validators.maxLength(120)]],
    city: ['', [Validators.required, Validators.maxLength(40)]],
    phone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    email: ['', [Validators.maxLength(100), Validators.pattern(EMAIL_PATTERN)]],
    manager: ['', [Validators.maxLength(60)]],
    status: ['Active']
  });
}

export function branchErrorText(form: FormGroup, field: string): string {
  const errors = form.get(field)?.errors;
  if (!errors) return '';

  if (errors['required']) return `${BRANCH_LABELS[field]} is required`;
  if (errors['duplicate']) return `A branch with this ${field} already exists`;
  if (errors['pattern']) return BRANCH_PATTERN_MESSAGES[field] ?? 'Invalid value';
  if (errors['maxlength']) return `${BRANCH_LABELS[field]} is too long`;
  return 'Invalid value';
}

// Cleans the form values before saving (trim, remove < > and control characters)
export function toBranchInput(value: any): NewBranchInput {
  return {
    name: sanitizeText(value.name ?? '', 60),
    code: sanitizeText(value.code ?? '', 10).toUpperCase(),
    address: sanitizeText(value.address ?? '', 120),
    city: sanitizeText(value.city ?? '', 40),
    phone: sanitizeText(value.phone ?? '', 20),
    email: sanitizeText(value.email ?? '', 100).toLowerCase(),
    manager: sanitizeText(value.manager ?? '', 60),
    status: value.status === 'Inactive' ? 'Inactive' : 'Active'
  };
}

export function duplicateBranchFields(
  branches: Branch[],
  input: NewBranchInput,
  ignoreId?: number
): ('name' | 'code')[] {
  return (['name', 'code'] as const).filter(field =>
    branches.some(b => b.id !== ignoreId && b[field].toLowerCase() === input[field].toLowerCase())
  );
}

// =============== Department ===============

const DEPARTMENT_LABELS: Record<string, string> = {
  name: 'Department name',
  code: 'Department code',
  description: 'Description'
};

export function createDepartmentForm(fb: FormBuilder): FormGroup {
  return fb.group({
    branchId: [null, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(60)]],
    code: ['', [Validators.required, Validators.pattern(CODE_PATTERN)]],
    description: ['', [Validators.maxLength(120)]],
    status: ['Active']
  });
}

export function departmentErrorText(form: FormGroup, field: string): string {
  const errors = form.get(field)?.errors;
  if (!errors) return '';

  if (errors['required']) {
    return field === 'branchId' ? 'Please select a branch' : `${DEPARTMENT_LABELS[field]} is required`;
  }
  if (errors['duplicate']) return `A department with this ${field} already exists in this branch`;
  if (errors['pattern']) return 'Use 2 to 10 letters, numbers or hyphens';
  if (errors['maxlength']) return `${DEPARTMENT_LABELS[field]} is too long`;
  return 'Invalid value';
}

export function toDepartmentInput(value: any): NewDepartmentInput {
  return {
    branchId: Number(value.branchId),
    name: sanitizeText(value.name ?? '', 60),
    code: sanitizeText(value.code ?? '', 10).toUpperCase(),
    description: sanitizeText(value.description ?? '', 120),
    status: value.status === 'Inactive' ? 'Inactive' : 'Active'
  };
}

export function duplicateDepartmentFields(
  departments: Department[],
  input: NewDepartmentInput,
  ignoreId?: number
): ('name' | 'code')[] {
  return (['name', 'code'] as const).filter(field =>
    departments.some(
      d => d.id !== ignoreId &&
           d.branchId === input.branchId &&
           d[field].toLowerCase() === input[field].toLowerCase()
    )
  );
}
