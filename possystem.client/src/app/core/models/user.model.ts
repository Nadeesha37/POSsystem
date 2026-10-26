export type Role = 'Admin' | 'Manager' | 'Cashier';

export interface AuthUser {
  username: string;
  fullName: string;
  role: Role;
}


export const ACCESS = {
  users: ['Admin', 'Manager'] as Role[],
  reports: ['Admin', 'Manager'] as Role[],
  roles: ['Admin'] as Role[]
};
