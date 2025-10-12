import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions} from '@ngrx/effects';
import { createEffect, ofType } from '@ngrx/effects';
import { catchError, delay, filter, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { AgendamentoActions } from './agendamento.actions';
import type { Class } from '../../models/class.model';
import { Store } from '@ngrx/store';
import { selectTodasAsAulas } from './agendamento.selectors';

let mockAulas: Class[] = [
  {
    id: 103,
    usuario: 'Monitoria de Física',
    sala: 'Sala de Estudos 02',
    dataInicio: new Date('2025-10-12T00:00:00'),
    dataFinal: new Date('2025-10-12T00:00:00'),
    diaDaSemana: 'Domingo',
    horaInicio: '14:00',
    horaFim: '16:00'
  },
  {
    id: 106,
    usuario: 'Grupo de Estudo TCC',
    sala: 'Sala 04',
    dataInicio: new Date('2025-10-12T00:00:00'),
    dataFinal: new Date('2025-10-12T00:00:00'),
    diaDaSemana: 'Domingo',
    horaInicio: '10:00',
    horaFim: '12:00'
  },

  // --- Segunda-feira, 13 de Outubro ---
  {
    id: 101,
    usuario: 'Prof. André Silva',
    sala: 'Sala 04',
    // Aula recorrente do semestre que acontece nesta segunda
    dataInicio: new Date('2025-08-04T00:00:00'),
    dataFinal: new Date('2025-12-15T00:00:00'),
    diaDaSemana: 'Segunda-feira',
    horaInicio: '07:40',
    horaFim: '09:20'
  },

  // --- Terça-feira, 14 de Outubro ---
  {
    id: 102,
    usuario: 'Profa. Carla Souza',
    sala: 'Laboratório 01',
    // Aula recorrente do semestre que acontece nesta terça
    dataInicio: new Date('2025-08-05T00:00:00'),
    dataFinal: new Date('2025-12-16T00:00:00'),
    diaDaSemana: 'Terça-feira',
    horaInicio: '10:00',
    horaFim: '11:40'
  },

  // --- Quarta-feira, 15 de Outubro ---
  {
    id: 104,
    usuario: 'Profa. Beatriz Lima',
    sala: 'Sala 11',
    // Aula recorrente do semestre que acontece nesta quarta
    dataInicio: new Date('2025-08-06T00:00:00'),
    dataFinal: new Date('2025-12-17T00:00:00'),
    diaDaSemana: 'Quarta-feira',
    horaInicio: '19:00',
    horaFim: '20:40'
  },

  // --- Quinta-feira, 16 de Outubro ---
  {
    id: 107,
    usuario: 'Lab. de Robótica',
    sala: 'Lab 03',
    // Evento único
    dataInicio: new Date('2025-10-16T00:00:00'),
    dataFinal: new Date('2025-10-16T00:00:00'),
    diaDaSemana: 'Quinta-feira',
    horaInicio: '15:30',
    horaFim: '17:10'
  },

  // --- Sexta-feira, 17 de Outubro ---
  {
    id: 105,
    usuario: 'Palestra Convidado',
    sala: 'Auditório Principal',
    // Evento único
    dataInicio: new Date('2025-10-17T00:00:00'),
    dataFinal: new Date('2025-10-17T00:00:00'),
    diaDaSemana: 'Sexta-feira',
    horaInicio: '19:30',
    horaFim: '21:00'
  },

  // --- Sábado, 18 de Outubro ---
  {
    id: 108,
    usuario: 'Workshop de Impressão 3D',
    sala: 'Oficina Maker',
    // Evento único de sábado
    dataInicio: new Date('2025-10-18T00:00:00'),
    dataFinal: new Date('2025-10-18T00:00:00'),
    diaDaSemana: 'Sábado',
    horaInicio: '09:00',
    horaFim: '13:00'
  }
]


@Injectable()
export class AgendamentoEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  // private http = inject(HttpClient)

loadAulas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.loadAulas),
      withLatestFrom(this.store.select(selectTodasAsAulas)),
      filter(([_, aulas]) => {
        return aulas.length === 0;
      }),
      mergeMap(() => {
        console.log('[Effects] Aulas não encontradas no state. Carregando aulas mockadas...');
        return of(mockAulas).pipe(
          delay(500), 
          map(aulas => AgendamentoActions.loadAulasSuccess({ aulas })),
          catchError(_ => of(AgendamentoActions.loadAulasFailure({ error: 'Falha ao carregar aulas mockadas' })))
        );
      })
    )
  );

  loadAulaById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.loadAulaById),
      map(action => {
        const aulaEncontrada = mockAulas.find(aula => aula.id === action.id);

        if (aulaEncontrada) {
          return AgendamentoActions.loadAulaByIdSuccess({ aula: aulaEncontrada });
        } else {
          return AgendamentoActions.loadAulaByIdFailure({ error: `Aula com ID ${action.id} não encontrada.` });
        }
      })
    )
  );

  
  deleteAula$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AgendamentoActions.deleteAula),
      mergeMap(action => {
        console.log(`[Effects] Deletando aula mockada com id: ${action.id}`);
        
        // Simula a lógica de deletar do backend
        const aulaExiste = mockAulas.find(a => a.id === action.id);

        if (!aulaExiste) {
          // Simula um erro se a aula não for encontrada
          return of(AgendamentoActions.deleteAulaFailure({ error: 'Aula não encontrada' })).pipe(delay(500));
        }

        // Remove a aula do nosso "banco de dados"
        mockAulas = mockAulas.filter(a => a.id !== action.id);

        // Retorna a ação de sucesso
        return of(AgendamentoActions.deleteAulaSuccess({ id: action.id })).pipe(delay(500));
      })
    )
  );

}