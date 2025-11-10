import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { type Observable } from 'rxjs';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { selectUserCargo } from '../../../store/auth/auth.selectors';
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

  public cargo$: Observable<string | undefined> = this.store.select(selectUserCargo);

  public title$: Observable<string> = this.headerTitleService.title$;

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
