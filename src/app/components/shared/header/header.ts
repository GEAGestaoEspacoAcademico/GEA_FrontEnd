import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { switchMap, take, type Observable } from 'rxjs';
import { HeaderTitleService } from '../../../services/header-title/header-title.service';
import { selectUserCargo } from '../../../store/auth/auth.selectors';
import { AuthActions } from '../../../store/auth/auth.actions';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

/**
 * Componente de UI responsável por exbir o header da aplicação
 * @usage
 * <app-header></app-header>
 */

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private store = inject(Store);
  private headerTitleService = inject(HeaderTitleService);
  private router = inject(Router)

  public cargo$: Observable<string | undefined> = this.store.select(selectUserCargo);

  public title$: Observable<string> = this.headerTitleService.title$;

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }



voltarHome() {
  this.cargo$
    .pipe(
      take(1)
    )
    .subscribe((cargo) => {
      switch (cargo) {
        case 'AUXILIAR_DOCENTE':
          this.router.navigate(['ad/home']);
          break;
        
        case 'PROFESSOR':
          this.router.navigate(['aulas']);
          break;
        case 'SECRETARIA':
          this.router.navigate(['secretaria/home']);  
          break
        default:
          this.router.navigate(['/login']);
          break;
      }
    });
}

  showBackButton$ = this.headerTitleService.showBackButton$;
}
