import { Role, StaffUser, createModules, createTill } from '../models/role.model';

// DUMMY DATA. Backend awama me file ek ain karannawa

export const MOCK_ROLES: Role[] = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full access to everything',
    locked: true,
    modules: createModules('all'),
    till: createTill('all'),
    maxDiscountPercent: 100
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Runs the shop floor and approves discounts and refunds',
    locked: false,
    modules: createModules({
      sales: ['view', 'create', 'edit'],
      products: ['view', 'create', 'edit'],
      customers: ['view', 'create', 'edit'],
      reports: ['view'],
      users: ['view']
    }),
    till: createTill(['applyDiscounts', 'voidSale', 'issueRefunds', 'openCashDrawer', 'exportReports']),
    maxDiscountPercent: 15
  },
  {
    id: 3,
    name: 'Cashier',
    description: 'Serves customers at the till',
    locked: false,
    modules: createModules({
      sales: ['view', 'create'],
      products: ['view'],
      customers: ['view', 'create']
    }),
    till: createTill(['applyDiscounts', 'openCashDrawer']),
    maxDiscountPercent: 5
  },
  {
    id: 4,
    name: 'Stock clerk',
    description: 'Receives, counts and updates stock',
    locked: false,
    modules: createModules({
      sales: ['view'],
      products: ['view', 'create', 'edit']
    }),
    till: createTill(),
    maxDiscountPercent: 0
  },
  {
    id: 5,
    name: 'Accountant',
    description: 'Reviews sales and financial reports',
    locked: false,
    modules: createModules({
      sales: ['view'],
      customers: ['view'],
      reports: ['view']
    }),
    till: createTill(['seeCostPrice', 'exportReports']),
    maxDiscountPercent: 0
  }
];

// [name, roleId]
const STAFF: [string, number][] = [
  ['Sanduni G.', 1], ['Pasan K.', 1],
  ['Nimali P.', 2], ['Kasun R.', 2], ['Dilani S.', 2], ['Ravi M.', 2],
  ['Tharindu F.', 3], ['Amaya W.', 3], ['Ishara D.', 3], ['Chamodi J.', 3],
  ['Nuwan B.', 3], ['Hiruni T.', 3], ['Dinesh A.', 3], ['Sewwandi L.', 3],
  ['Lakshan P.', 3], ['Madushi C.', 3], ['Janith V.', 3], ['Thilini E.', 3],
  ['Sahan L.', 4], ['Buddhika N.', 4], ['Rashmi O.', 4],
  ['Malik H.', 5]
];

export const MOCK_USERS: StaffUser[] = STAFF.map(([name, roleId], index) => ({
  id: index + 1,
  name,
  roleId
}));
