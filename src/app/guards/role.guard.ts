import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { selectUserCargo } from '../store/auth/auth.selectors';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const allowedRoles = route.data?.['roles'] as string[] | undefined;


    if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
      return of(true);
    }

    const normalizedAllowed = allowedRoles.map(r => String(r).toUpperCase());

    return this.store.select(selectUserCargo).pipe(
      take(1),
      map((cargoUsuario) => {
        if (!cargoUsuario) {

          return this.router.createUrlTree(['/login']);
        }

        const userCargoNormalized = String(cargoUsuario).toUpperCase();

        if (normalizedAllowed.includes(userCargoNormalized)) {
          return true;
        }


        return this.router.createUrlTree(['/login']);
      })
    );
  }
}
