export type PermissionAction = 'view' | 'create' | 'edit' | 'delete';

export const PERMISSION_ACTIONS: PermissionAction[] = ['view', 'create', 'edit', 'delete'];

export type TillKey =
  | 'applyDiscounts'
  | 'voidSale'
  | 'issueRefunds'
  | 'openCashDrawer'
  | 'seeCostPrice'
  | 'exportReports';

export const TILL_ACTIONS: { key: TillKey; label: string }[] = [
  { key: 'applyDiscounts', label: 'Apply discounts' },
  { key: 'voidSale', label: 'Void a sale' },
  { key: 'issueRefunds', label: 'Issue refunds' },
  { key: 'openCashDrawer', label: 'Open cash drawer' },
  { key: 'seeCostPrice', label: 'See cost price and margin' },
  { key: 'exportReports', label: 'Export reports' }
];

// Which actions each module supports. A missing action is shown as "–" in the table.
export const MODULE_DEFS: { key: string; label: string; actions: PermissionAction[] }[] = [
  { key: 'sales', label: 'Sales & orders', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'products', label: 'Products & stock', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'customers', label: 'Customers', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'reports', label: 'Reports', actions: ['view'] },
  { key: 'users', label: 'Users & roles', actions: ['view', 'create', 'edit', 'delete'] },
  { key: 'settings', label: 'Store settings', actions: ['view', 'edit'] }
];

export interface ModulePermission {
  key: string;
  label: string;
  actions: Partial<Record<PermissionAction, boolean>>;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  locked: boolean;
  modules: ModulePermission[];
  till: Record<TillKey, boolean>;
  maxDiscountPercent: number;
}

export interface StaffUser {
  id: number;
  name: string;
  roleId: number;
}

export interface NewRoleInput {
  name: string;
  description: string;
  copyFromRoleId: number | null;
}

// Builds the module access list. Pass 'all' for full access, nothing for no access.
export function createModules(
  granted: Record<string, PermissionAction[]> | 'all' = {}
): ModulePermission[] {
  return MODULE_DEFS.map(def => {
    const allowed = granted === 'all' ? def.actions : (granted[def.key] ?? []);
    const actions: Partial<Record<PermissionAction, boolean>> = {};
    for (const action of def.actions) {
      actions[action] = allowed.includes(action);
    }
    return { key: def.key, label: def.label, actions };
  });
}

export function createTill(granted: TillKey[] | 'all' = []): Record<TillKey, boolean> {
  const till = {} as Record<TillKey, boolean>;
  for (const item of TILL_ACTIONS) {
    till[item.key] = granted === 'all' || granted.includes(item.key);
  }
  return till;
}

export function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');
}
