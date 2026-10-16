import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Role } from './models/user.model';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const allowed = (route.data['roles'] as Role[] | undefined) ?? [];

  if (!auth.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  if (allowed.length === 0 || auth.hasRole(...allowed)) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};
