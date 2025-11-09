import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, type Observable } from 'rxjs';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { selectCurrentUser, selectUserCargo } from '../../../store/auth/auth.selectors';
import { AuthActions } from '../../../store/auth/auth.actions';

/**
 * Componente de UI responsável por exbir o header da aplicação
 * @usage
 * <app-header></app-header>
 */

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private store = inject(Store);
  private headerTitleService = inject(HeaderTitleService);

  public user$ = this.store.select(selectCurrentUser);

  public userCargo$: Observable<string | undefined> = this.store.select(selectUserCargo);

  public isProfessor$: Observable<boolean> = this.userCargo$.pipe(
    map(cargo => (cargo ?? '').toUpperCase() === 'PROFESSOR')
  );

  public isAdminOrSecretaria$: Observable<boolean> = this.userCargo$.pipe(
    map(cargo => {
      const c = (cargo ?? '').toUpperCase();
      return c === 'AD' || c === 'SECRETARIA';
    })
  );

  public title$: Observable<string> = this.headerTitleService.title$;

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
