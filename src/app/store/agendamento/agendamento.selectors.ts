import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { AgendamentoState } from './agendamento.state';

export const AGENDAMENTO_FEATURE_KEY = 'agendamento';

// 1. Seletor que pega a "fatia" inteira do estado de agendamento
const selectAgendamentoState = createFeatureSelector<AgendamentoState>(AGENDAMENTO_FEATURE_KEY);

// 2. Seletores que pegam pedaços específicos da fatia
export const selectTodasAsAulas = createSelector(
  selectAgendamentoState,
  (state) => state.aulas
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
  selectTodasAsAulas,
  (aulas) => aulas.find(aula => aula.id === id)
);