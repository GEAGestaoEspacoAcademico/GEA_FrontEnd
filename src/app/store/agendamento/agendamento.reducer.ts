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

  // --- LÓGICA DO UPSERT ---
  // Quando uma aula individual é carregada com sucesso
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

  // Se a busca falhar
  on(AgendamentoActions.loadAgendamentoByIdFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  })),

  // Quando a edição começa, ativamos o estado de carregamento
  on(AgendamentoActions.editAgendamento, (state): AgendamentoState => ({
    ...state,
    loading: true,
    error: null,
  })),

  // Quando a edição é bem-sucedida, atualizamos a lista de aulas
  on(AgendamentoActions.editAgendamentoSuccess, (state, { agendamento }): AgendamentoState => ({
    ...state,
    // Usa o .map() para criar um novo array. Se o ID da aula no array for o mesmo
    // da aula que foi editada, ele a substitui. Senão, mantém a aula original.
    agendamentos: state.agendamentos.map(a => a.id === agendamento.id ? agendamento : a),
    loading: false,
  })),

  // Se a edição falhar, armazenamos o erro
  on(AgendamentoActions.editAgendamentoFailure, (state, { error }): AgendamentoState => ({
    ...state,
    loading: false,
    error: error,
  }))
);