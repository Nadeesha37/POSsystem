import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { AuthUser, Role, UserAccount } from '../models/user.model';

const STORAGE_KEY = 'authUser';
const VALID_ROLES: readonly Role[] = ['Admin', 'Manager', 'Cashier'];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readStoredUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

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
    return this.http.post<UserAccount>('/Login', {
      userName: username,
      password
    }).pipe(
      map(account => this.toAuthUser(account)),
      tap(user => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
        this.userSubject.next(user);
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
        typeof u.accountId === 'number' &&
        typeof u.userName === 'string' &&
        typeof u.userRoleId === 'number' &&
        typeof u.userRole === 'string' &&
        Array.isArray(u.authorizedFeatureIds) &&
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

  private toAuthUser(account: UserAccount): AuthUser {debugger
    const role = VALID_ROLES.find(
      validRole => validRole.toLowerCase() === account.userRole.trim().toLowerCase()
    );

    if (!role) {
      throw new Error('INVALID_ACCOUNT_ROLE');
    }

    return {
      ...account,
      username: account.userName,
      fullName: account.userName,
      role
    };
  }
}
