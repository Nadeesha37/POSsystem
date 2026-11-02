import { Branch, Department } from '../models/location.model';

// DUMMY DATA.

export const MOCK_BRANCHES: Branch[] = [
  {
    id: 1, name: 'Kurunegala Main', code: 'KUR-01',
    address: '12 Colombo Road', city: 'Kurunegala',
    phone: '+94 37 222 3344', email: 'kurunegala@example.com',
    manager: 'Nimali P.', status: 'Active'
  },
  {
    id: 2, name: 'Colombo Fort', code: 'COL-01',
    address: '45 Main Street', city: 'Colombo',
    phone: '+94 11 234 5678', email: 'colombo@example.com',
    manager: 'Kasun R.', status: 'Active'
  },
  {
    id: 3, name: 'Kandy City', code: 'KAN-01',
    address: '8 Peradeniya Road', city: 'Kandy',
    phone: '+94 81 222 1100', email: '',
    manager: 'Dilani S.', status: 'Inactive'
  },
  {
    id: 4, name: 'Galle Fort', code: 'GAL-01',
    address: '3 Church Street', city: 'Galle',
    phone: '+94 91 223 4455', email: 'galle@example.com',
    manager: '', status: 'Active'
  }
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: 1, branchId: 1, name: 'Grocery', code: 'GRO', description: 'Dry goods and daily needs', status: 'Active' },
  { id: 2, branchId: 1, name: 'Bakery', code: 'BAK', description: 'Fresh bread and cakes', status: 'Active' },
  { id: 3, branchId: 1, name: 'Cashier counters', code: 'CSH', description: 'Billing counters', status: 'Active' },
  { id: 4, branchId: 2, name: 'Grocery', code: 'GRO', description: 'Dry goods and daily needs', status: 'Active' },
  { id: 5, branchId: 2, name: 'Electronics', code: 'ELE', description: '', status: 'Inactive' },
  { id: 6, branchId: 3, name: 'Grocery', code: 'GRO', description: '', status: 'Active' }
];
