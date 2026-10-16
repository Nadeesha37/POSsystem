import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { AuthUser, Role } from '../models/user.model';

const STORAGE_KEY = 'authUser';
const VALID_ROLES: Role[] = ['Admin', 'Manager', 'Cashier'];

interface MockAccount extends AuthUser {
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {


  private readonly mockAccounts: MockAccount[] = [
    { username: 'admin',   password: 'admin123',   fullName: 'System Admin',  role: 'Admin' },
    { username: 'manager', password: 'manager123', fullName: 'Store Manager', role: 'Manager' },
    { username: 'cashier', password: 'cashier123', fullName: 'Shop Cashier',  role: 'Cashier' }
  ];

  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readStoredUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private router: Router) {}

  get currentUser(): AuthUser | null {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  hasRole(...roles: Role[]): boolean {
    const user = this.currentUser;
    return !!user && roles.includes(user.role);
  }


  login(username: string, password: string): Observable<AuthUser> {
    return timer(600).pipe(
      switchMap((): Observable<AuthUser> => {
        const account = this.mockAccounts.find(
          a => a.username === username && a.password === password
        );

        if (!account) {
          return throwError(() => new Error('INVALID_CREDENTIALS'));
        }


        const user: AuthUser = {
          username: account.username,
          fullName: account.fullName,
          role: account.role
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        this.userSubject.next(user);
        return of(user);
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem(STORAGE_KEY);
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }


  requestPasswordReset(email: string): Observable<void> {
    return of(undefined).pipe(delay(800));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return of(undefined).pipe(delay(800));
  }

  private readStoredUser(): AuthUser | null {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;

      const u = JSON.parse(raw);
      if (
        u &&
        typeof u.username === 'string' &&
        typeof u.fullName === 'string' &&
        VALID_ROLES.includes(u.role)
      ) {
        return u as AuthUser;
      }
    } catch {

    }
    return null;
  }
}
