import { inject } from '@angular/core';
import type { CanActivateFn} from '@angular/router';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectUserCargo } from '../store/auth/auth.selectors'; // Importe o novo seletor

export const professorGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(selectUserCargo).pipe(
    take(1),
    map(cargo => {
      if (cargo === 'PROFESSOR') {
        return true;
      } else {
        window.alert("Usuário não permitido")
        return router.createUrlTree(['/login']);
      }
    })
  );
};