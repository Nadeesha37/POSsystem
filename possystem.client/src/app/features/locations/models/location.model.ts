export type LocationStatus = 'Active' | 'Inactive';

export const STATUSES: LocationStatus[] = ['Active', 'Inactive'];

export interface Branch {
  id: number;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  manager: string;
  status: LocationStatus;
}

export interface Department {
  id: number;
  branchId: number;
  name: string;
  code: string;
  description: string;
  status: LocationStatus;
}

export type NewBranchInput = Omit<Branch, 'id'>;
export type NewDepartmentInput = Omit<Department, 'id'>;

// Leading and trailing spaces are allowed here because they are trimmed before saving
export const CODE_PATTERN = /^\s*[A-Za-z0-9-]{2,10}\s*$/;
export const PHONE_PATTERN = /^\s*\+?[0-9][0-9\s-]{6,14}\s*$/;
export const EMAIL_PATTERN = /^\s*[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\s*$/;
