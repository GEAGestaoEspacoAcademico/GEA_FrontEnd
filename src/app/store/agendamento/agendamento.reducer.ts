import { createReducer, on } from '@ngrx/store';
import { AgendamentoActions } from './agendamento.actions';
import type { AgendamentoState } from './agendamento.state';
import { initialState } from './agendamento.state';
import type { Class } from '../../models/class.model';

export const agendamentoReducer = createReducer(
  initialState,

  // Quando a ação 'Load Aulas' é disparada
  on(AgendamentoActions.loadAulas, (state): AgendamentoState => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Quando as aulas são carregadas com sucesso
  on(AgendamentoActions.loadAulasSuccess, (state, { aulas }): AgendamentoState => ({
    ...state,
    aulas: aulas,
    loading: false,
  })),

  // Quando ocorre falha ao carregar as aulas
  on(AgendamentoActions.loadAulasFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),
  
  // Quando a ação 'Delete Aula' é disparada
  on(AgendamentoActions.deleteAula, (state): AgendamentoState => ({
      ...state,
      loading: true // Indica que uma operação está em andamento
  })),

  // Quando uma aula é deletada com sucesso
  on(AgendamentoActions.deleteAulaSuccess, (state, { id }): AgendamentoState => ({
      ...state,
      aulas: state.aulas.filter(aula => aula.id !== id),
      loading: false
  })),

  // Disparada quando a busca por ID começa
  on(AgendamentoActions.loadAulaById, (state): AgendamentoState => ({
    ...state,
    loading: true,
    error: null,
  })),

  // --- LÓGICA DO UPSERT ---
  // Quando uma aula individual é carregada com sucesso
  on(AgendamentoActions.loadAulaByIdSuccess, (state, { aula }): AgendamentoState => {
    const aulaJaExiste = state.aulas.some(a => a.id === aula.id);

    let aulasAtualizadas: Class[];

    if (aulaJaExiste) {
      aulasAtualizadas = state.aulas.map(a => a.id === aula.id ? aula : a);
    } else {
      aulasAtualizadas = [...state.aulas, aula];
    }
    
    return {
      ...state,
      aulas: aulasAtualizadas,
      loading: false,
    };
  }),

  // Se a busca falhar
  on(AgendamentoActions.loadAulaByIdFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  }))
);