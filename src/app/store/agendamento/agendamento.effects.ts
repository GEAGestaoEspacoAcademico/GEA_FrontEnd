import { inject, Injectable } from '@angular/core';
import { Actions} from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import type { Observable} from 'rxjs';
import { catchError, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { AgendamentoActions } from './agendamento.actions'; 
import { Store } from '@ngrx/store';
import { selectTodasOsAgendamentos } from './agendamento.selectors';
import { AgendamentoService } from '../../services/agendamentos/agendamento.service';
import type { User } from '../../models/user.model';
import { selectCurrentUser } from '../auth/auth.selectors';

@Injectable()
export class AgendamentoEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private agendamentoService = inject(AgendamentoService)
  
  private user$!: Observable<User | null>;

  loadAgendamentos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.loadAgendamentos),
      withLatestFrom(
        this.store.select(selectTodasOsAgendamentos),
        this.store.select(selectCurrentUser)
      ),
      filter(([_, agendamentos, user]) => {
        return agendamentos.length === 0 && user !== null;
      }),
      mergeMap(([_,, user]) => {
        const userId = user!.id;
        return this.agendamentoService.getAgendamentosProfessor(userId).pipe(
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
      mergeMap(action => this.agendamentoService.getAgendamentoById(action.id).pipe(
        map(agendamentoEncontrado => AgendamentoActions.loadAgendamentoByIdSuccess({ agendamento: agendamentoEncontrado })
        ),
        catchError(_ => of(AgendamentoActions.loadAgendamentoByIdFailure({ error: `Falha ao carregar agendamento com ID ${action.id}` }))
        )
      ))
    )
  );

  
  deleteAgendamento$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.deleteAgendamento),
      mergeMap(action => {
        return this.agendamentoService.deleteAgendamento(action.id).pipe(
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
        return this.agendamentoService.editAgendamento(id, agendamento).pipe(
          map(AgendamentoAtualizado => AgendamentoActions.editAgendamentoSuccess({agendamento: AgendamentoAtualizado})),
          catchError(_ => 
            of(AgendamentoActions.editAgendamentoFailure({ error: `Falha ao editar agendamento ${id}` }))
          )
        )
      })
    )
  );

}