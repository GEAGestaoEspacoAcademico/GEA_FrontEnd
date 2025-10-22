import { createReducer, on } from '@ngrx/store';
import { AgendamentoActions } from './agendamento.actions';
import type { AgendamentoState } from './agendamento.state';
import { initialState } from './agendamento.state';
import type { Agendamento } from '../../models/agendamento.model';

export const agendamentoReducer = createReducer(
  initialState,

  // Quando a ação 'Load Aulas' é disparada
  on(AgendamentoActions.loadAgendamentos, (state): AgendamentoState => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Quando as aulas são carregadas com sucesso
  on(AgendamentoActions.loadAgendamentosSuccess, (state, { agendamentos }): AgendamentoState => ({
    ...state,
    agendamentos: agendamentos,
    loading: false,
  })),

  // Quando ocorre falha ao carregar as aulas
  on(AgendamentoActions.loadAgendamentosFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),
  
  // Quando a ação 'Delete Aula' é disparada
  on(AgendamentoActions.deleteAgendamento, (state): AgendamentoState => ({
      ...state,
      loading: true // Indica que uma operação está em andamento
  })),

  // Quando uma aula é deletada com sucesso
  on(AgendamentoActions.deleteAgendamentoSuccess, (state, { id }): AgendamentoState => ({
      ...state,
      agendamentos: state.agendamentos.filter(agendamento => agendamento.id !== id),
      loading: false
  })),

  on(AgendamentoActions.deleteAgendamentoFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),

  // Disparada quando a busca por ID começa
  on(AgendamentoActions.loadAgendamentoById, (state): AgendamentoState => ({
    ...state,
    loading: true,
    error: null,
  })),


  on(AgendamentoActions.loadAgendamentoByIdSuccess, (state, { agendamento }): AgendamentoState => {
    const aulaJaExiste = state.agendamentos.some(a => a.id === agendamento.id);

    let aulasAtualizadas: Agendamento[];

    if (aulaJaExiste) {
      aulasAtualizadas = state.agendamentos.map(a => a.id === agendamento.id ? agendamento : a);
    } else {
      aulasAtualizadas = [...state.agendamentos, agendamento];
    }
    
    return {
      ...state,
      agendamentos: aulasAtualizadas,
      loading: false,
    };
  }),

  on(AgendamentoActions.loadAgendamentoByIdFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),

  on(AgendamentoActions.editAgendamento, (state): AgendamentoState => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(AgendamentoActions.editAgendamentoSuccess, (state, { agendamento }): AgendamentoState => ({
    ...state,
    agendamentos: state.agendamentos.map(a => a.id === agendamento.id ? agendamento : a),
    loading: false,
  })),

  on(AgendamentoActions.editAgendamentoFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  }))
);