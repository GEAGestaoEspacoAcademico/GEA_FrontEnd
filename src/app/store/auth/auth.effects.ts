import { inject, Injectable } from '@angular/core';
import { Actions} from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { AuthActions } from './auth.actions';
import { Router } from '@angular/router';
import type { HttpErrorResponse} from '@angular/common/http';
import { TIPOUSUARIO } from '../../models/enums/tipoUsuario.enum';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions)
  private authService = inject(AuthService)
  private router = inject(Router)

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(action =>
        this.authService.logarUsuario(action.AuthLoginRequest).pipe(
          map(user => AuthActions.loginSuccess({ user })),
          catchError((apiError: HttpErrorResponse) => {
            const errorMessage = apiError.error?.message || 'Credenciais inválidas.';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap((login) => {
        if(login.user.usuarioCargo === TIPOUSUARIO.AUXILIAR_DOCENTE){
          this.router.navigate(['ad/home'])
        }else if(login.user.usuarioCargo === TIPOUSUARIO.PROFESSOR){
          this.router.navigate(['/aulas']);
        }else if(login.user.usuarioCargo === TIPOUSUARIO.SECRETARIA){
          this.router.navigate(['secretaria/home']);
        }
      })
    ),
    { dispatch: false }
  );
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      tap(() => {
        this.router.navigate(['/login']); 
      })
    ),
    { dispatch: false }
  );
}