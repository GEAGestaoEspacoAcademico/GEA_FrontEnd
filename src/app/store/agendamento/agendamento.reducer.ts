import { createReducer, on } from '@ngrx/store';
import { AgendamentoActions } from './agendamento.actions';
import { initialState, type AgendamentoState } from './agendamento.state';

export const agendamentoReducer = createReducer(
  initialState,

  on(AgendamentoActions.loadAgendamentos, (state): AgendamentoState => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(AgendamentoActions.loadAgendamentosSuccess, (state, { agendamentos }): AgendamentoState => ({
    ...state,
    agendamentos: agendamentos,
    loading: false,
  })),
  on(AgendamentoActions.loadAgendamentosFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),

  on(AgendamentoActions.deleteAgendamento, (state): AgendamentoState => ({
    ...state,
    loading: true
  })),
  on(AgendamentoActions.deleteAgendamentoSuccess, (state, { id }): AgendamentoState => ({
    ...state,
    agendamentos: state.agendamentos.filter(a => a.agendamentoAulaId !== id),
    loading: false
  })),
  on(AgendamentoActions.deleteAgendamentoFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),

  on(AgendamentoActions.loadAgendamentoById, (state): AgendamentoState => ({
    ...state,
    selectedAgendamento: null, 
    loading: true,
    error: null,
  })),
  on(AgendamentoActions.loadAgendamentoByIdSuccess, (state, { agendamento }): AgendamentoState => ({
    ...state,
    selectedAgendamento: agendamento,
    loading: false,
  })),
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
  on(AgendamentoActions.editAgendamentoSuccess, (state, { agendamento }): AgendamentoState => {
    return {
      ...state,
      selectedAgendamento: agendamento,
      loading: false,
    };
  }),
  on(AgendamentoActions.editAgendamentoFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),

  on(AgendamentoActions.clearSelectedAgendamento, (state): AgendamentoState => ({
    ...state,
    selectedAgendamento: null
  }))
);