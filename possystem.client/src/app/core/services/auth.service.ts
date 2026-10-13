import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {

  requestPasswordReset(email: string): Observable<void> {
    return of(undefined).pipe(delay(800));
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return of(undefined).pipe(delay(800));
  }
}
