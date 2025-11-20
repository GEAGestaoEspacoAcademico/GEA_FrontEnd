import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { AgendamentoState } from './agendamento.state';

export const AGENDAMENTO_FEATURE_KEY = 'agendamento';

// 1. Seletor que pega a "fatia" inteira do estado de agendamento
const selectAgendamentoState = createFeatureSelector<AgendamentoState>(AGENDAMENTO_FEATURE_KEY);

// 2. Seletores que pegam pedaços específicos da fatia
export const selectTodasOsAgendamentos = createSelector(
  selectAgendamentoState,
  (state) => state.agendamentos
);

export const selectAgendamentoLoading = createSelector(
  selectAgendamentoState,
  (state) => state.loading
);

export const selectAgendamentoError = createSelector(
  selectAgendamentoState,
  (state) => state.error
);

export const selectAulaById = (id: number) => createSelector(
  selectTodasOsAgendamentos,
  (agendamentos) => agendamentos.find(agendamento => agendamento.agendamentoAulaId === id)
);

export const selectSelectedAgendamento = createSelector(
  selectAgendamentoState,
  (state) => state.selectedAgendamento
);