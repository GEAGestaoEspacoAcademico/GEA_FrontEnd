// src/app/guards/role.guard.ts
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import type { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserCargo } from '../store/auth/auth.selectors';
import { map, take } from 'rxjs/operators';
import type { Observable } from 'rxjs';
import { of } from 'rxjs';
import { NotificationService } from '../services/notificacoes/notification.service';

/**
 * Guarda de rota funcional (`CanActivateFn`) que verifica se o usuário
 * autenticado possui um cargo (role) permitido para acessar a rota.
 *
 * Ele lê o cargo do usuário a partir do NgRx Store (`selectUserCargo`)
 * e o compara com um array de 'roles' (cargos) fornecido no
 * `data` da rota.
 *
 * @usage
 * // No seu app-routing.module.ts ou similar:
 * {
 * path: 'admin-dashboard',
 * component: AdminDashboardComponent,
 * canActivate: [RoleGuard], // <-- Como é usado
 * data: {
 *  roles: ['ADMIN', 'SUPERVISOR'] // <-- Como é configurado
 *  }
 * }
 *
 * @param route A snapshot da rota atual. Usado para extrair o array `data['roles']`.
 * @returns Um `Observable<boolean | UrlTree>`.
 * - `true` se o usuário tiver a permissão.
 * - `UrlTree` (redirecionando para '/login') se o usuário não tiver
 * permissão ou não estiver logado.
 */
export const RoleGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  _state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const router = inject(Router);
  const store = inject(Store);
  const notificationService = inject(NotificationService);

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    return of(true);
  }

  const normalizedAllowed = allowedRoles.map((r) => String(r).toUpperCase());

  return store.select(selectUserCargo).pipe(
    take(1),
    map((cargoUsuario) => {
      if (!cargoUsuario) {
        notificationService.showError('Usuário não permitidos');
        return router.createUrlTree(['/login']);
      }

      const userCargoNormalized = String(cargoUsuario).toUpperCase();

      if (normalizedAllowed.includes(userCargoNormalized)) {
        return true;
      }

      notificationService.showError('Usuário não permitido');
      return router.createUrlTree(['/login']);
    })
  );
};