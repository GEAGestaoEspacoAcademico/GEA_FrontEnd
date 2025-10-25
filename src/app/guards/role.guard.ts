// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserCargo } from '../store/auth/auth.selectors';
import { map, take } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';

export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store);

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return of(true);
  }

  const normalizedAllowed = allowedRoles.map((r) => String(r).toUpperCase());

  return store.select(selectUserCargo).pipe(
    take(1),
    map((cargoUsuario) => {
      if (!cargoUsuario) {
        return router.createUrlTree(['/login']);
      }

      const userCargoNormalized = String(cargoUsuario).toUpperCase();

      if (normalizedAllowed.includes(userCargoNormalized)) {
        return true;
      }

      return router.createUrlTree(['/login']);
    })
  );
};
