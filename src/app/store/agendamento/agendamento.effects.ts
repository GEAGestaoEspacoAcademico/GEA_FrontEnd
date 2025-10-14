import { inject, Injectable } from '@angular/core';
import { Actions} from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { AgendamentoActions } from './agendamento.actions';
import type { Agendamento } from '../../models/agendamento.model';
import { Store } from '@ngrx/store';
import { selectTodasAsAulas } from './agendamento.selectors';

let mockAgendamentos: Agendamento[] = [
   {
    id: 1,
    local: 'Sala C-205',
    dataInicio: new Date('2025-10-13T08:00:00'),
    dataFinal: new Date('2025-10-14T10:00:00'),
    diaDaSemana: 'Segunda-feira',
    horario: '08:00 - 10:00',
    disciplina: 'Cálculo I',
    semestre: '2025.2',
    curso: 'ADS'
  },
  {
    id: 2,
    local: 'Laboratório de Redes',
    dataInicio: new Date('2025-10-14T10:00:00'),
    dataFinal: new Date('2025-10-15T12:00:00'),
    diaDaSemana: 'Terça-feira',
    horario: '10:00 - 12:00',
    disciplina: 'Redes de Computadores',
    semestre: '2025.2',
    curso: 'Mecatrônica'
  },
  {
    id: 3,
    local: 'Auditório Bloco D',
    dataInicio: new Date('2025-10-15T19:00:00'),
    dataFinal: new Date('2025-10-16T22:30:00'),
    diaDaSemana: 'Quarta-feira',
    horario: '19:00 - 22:30',
    disciplina: 'Inteligência Artificial',
    semestre: '2025.2',
    curso: 'GTI'
  },
  {
    id: 4,
    local: 'Sala B-112',
    dataInicio: new Date('2025-10-16T14:00:00'),
    dataFinal: new Date('2025-10-17T16:00:00'),
    diaDaSemana: 'Quinta-feira',
    horario: '14:00 - 16:00',
    disciplina: 'Estrutura de Dados',
    semestre: '2025.2',
    curso: 'ADS'
  },
  {
    id: 5,
    local: 'Sala de Reuniões - Coordenação',
    dataInicio: new Date('2025-10-17T09:30:00'),
    dataFinal: new Date('2025-10-18T11:00:00'),
    diaDaSemana: 'Sexta-feira',
    horario: '09:30 - 11:00',
    disciplina: 'Projeto Integrador I',
    semestre: '2025.2',
    curso: 'Mecatrônica'
  },
  {
    id: 6,
    local: 'Sala A-301',
    dataInicio: new Date('2025-10-18T19:00:00'),
    dataFinal: new Date('2025-10-19T21:00:00'),
    diaDaSemana: 'Segunda-feira',
    horario: '19:00 - 21:00',
    disciplina: 'Direito Constitucional',
    semestre: '2025.2',
    curso: 'GTI'
  },
  {
    id: 7,
    local: 'Laboratório de Física',
    dataInicio: new Date('2025-10-19T15:00:00'),
    dataFinal: new Date('2025-10-20T18:00:00'),
    diaDaSemana: 'Quarta-feira',
    horario: '15:00 - 18:00',
    disciplina: 'Física Experimental II',
    semestre: '2025.2',
    curso: 'ADS'
  },
  {
    id: 8,
    local: 'Sala B-112',
    dataInicio: new Date('2025-10-20T16:00:00'),
    dataFinal: new Date('2025-10-21T18:00:00'),
    diaDaSemana: 'Quinta-feira',
    horario: '16:00 - 18:00',
    disciplina: 'Estrutura de Dados - Monitoria',
    semestre: '2025.2',
    curso: 'ADS'
  },
]


@Injectable()
export class AgendamentoEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  // private http = inject(HttpClient)

  loadAgendamentos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.loadAgendamentos),
      withLatestFrom(this.store.select(selectTodasAsAulas)),
      filter(([_, agendamentos]) => {
        return agendamentos.length === 0;
      }),
      mergeMap(() => {
        return of(mockAgendamentos).pipe(
          delay(500), 
          map(agendamentos => AgendamentoActions.loadAgendamentosSuccess({ agendamentos })),
          catchError(_ => of(AgendamentoActions.loadAgendamentosFailure({ error: 'Falha ao carregar aulas mockadas' })))
        );
      })
    )
  );

  loadAgendamentosById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.loadAgendamentoById),
      map(action => {
        const aulaEncontrada = mockAgendamentos.find(aula => aula.id === action.id);

        if (aulaEncontrada) {
          return AgendamentoActions.loadAgendamentoByIdSuccess({ agendamento: aulaEncontrada });
        } else {
          return AgendamentoActions.loadAgendamentoByIdFailure({ error: `Aula com ID ${action.id} não encontrada.` });
        }
      })
    )
  );

  
  deleteAgendamento$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.deleteAgendamento),
      mergeMap(action => {
        const agendamentoExiste = mockAgendamentos.find(a => a.id === action.id);

        if (!agendamentoExiste) {
          return of(AgendamentoActions.deleteAgendamentoFailure({ error: 'Aula não encontrada' })).pipe(delay(500));
        }
        mockAgendamentos = mockAgendamentos.filter(a => a.id !== action.id);
        return of(AgendamentoActions.deleteAgendamentoSuccess({ id: action.id })).pipe(delay(500));
      })
    )
  );

   editAgendamento$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.editAgendamento),
      mergeMap(({ agendamento }) => {
        const index = mockAgendamentos.findIndex(a => a.id === agendamento.id);

        if (index === -1) {
          return of(AgendamentoActions.editAgendamentoFailure({ error: `Aula com ID ${agendamento.id} não encontrada para edição.` })).pipe(delay(500));
        }
        mockAgendamentos = mockAgendamentos.map(item => 
          item.id === agendamento.id ? agendamento : item
        );
        return of(AgendamentoActions.editAgendamentoSuccess({ agendamento })).pipe(delay(500));
      })
    )
  );

}