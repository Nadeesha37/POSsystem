export type Role = 'Admin' | 'Manager' | 'Cashier';

export interface UserAccount {
  accountId: number;
  userName: string;
  userRoleId: number;
  userRole: string;
  authorizedFeatureIds: number[];
}

export interface AuthUser extends UserAccount {
  username: string;
  fullName: string;
  role: Role;
}

export const ACCESS = {
  users: ['Admin', 'Manager'] as Role[],
  reports: ['Admin', 'Manager'] as Role[],
  roles: ['Admin'] as Role[],
  locations: ['Admin'] as Role[]
};
