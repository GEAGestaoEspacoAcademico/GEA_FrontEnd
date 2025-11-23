import { inject, Injectable } from '@angular/core';
import { Actions} from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import type { Observable} from 'rxjs';
import { catchError, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { AgendamentoActions } from './agendamento.actions'; 
import { Store } from '@ngrx/store';
import { AgendamentoService } from '../../services/agendamento/agendamento.service';
import type { Usuario } from '../../models/usuario.model';
import { selectCurrentUser } from '../auth/auth.selectors';
import type { AgendamentoAula } from '../../models/agendamentoAula.model';

@Injectable()
export class AgendamentoEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private agendamentoService = inject(AgendamentoService)
  
  private user$!: Observable<Usuario | null>;

  loadAgendamentos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.loadAgendamentos),
      withLatestFrom(
        this.store.select(selectCurrentUser),
      ),
      filter(([_, user]) => {
        return user !== null;
      }),
      mergeMap(([_, user]) => {
        const userId = user!.usuarioId;
        return this.agendamentoService.getAgendamentosPorfessor(userId).pipe(
          map(agendamentos => {
            return AgendamentoActions.loadAgendamentosSuccess({ agendamentos })}),
          catchError(_ => of(AgendamentoActions.loadAgendamentosFailure({ error: 'Falha ao carregar agendamentos' })))
        );
      })
    )
  );

  loadAgendamentosById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.loadAgendamentoById),
      mergeMap(action => this.agendamentoService.getAgendamentoAulaPorId(action.id).pipe(
        map((agendamentoEncontrado: AgendamentoAula) => 
          AgendamentoActions.loadAgendamentoByIdSuccess({ agendamento: agendamentoEncontrado })
        ),
        catchError(error => of(AgendamentoActions.loadAgendamentoByIdFailure({ error: error.message || 'Erro ao carregar' })))
      ))
    )
  );

  
  deleteAgendamento$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.deleteAgendamento),
      mergeMap(action => {
        return this.agendamentoService.deleteAgendamentoAula(action.id).pipe(
          map(() => AgendamentoActions.deleteAgendamentoSuccess({ id: action.id })),
          catchError(_ => of(AgendamentoActions.deleteAgendamentoFailure({ error: 'Falha ao deletar agendamento' }))
          )
        );
      })
    )
  );

  editAgendamento$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.editAgendamento),
      mergeMap(({ id, agendamento }) => {
        return this.agendamentoService.editAgendamentoAula(id, agendamento).pipe (
          map((response: any) => AgendamentoActions.editAgendamentoSuccess({ agendamento: response })),
          catchError(error => of(AgendamentoActions.editAgendamentoFailure({ error: error.message })))
        )
      })
    )
  );

}