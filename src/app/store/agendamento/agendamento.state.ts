import type { Agendamento } from '../../models/agendamento.model';

export interface AgendamentoState {
  agendamentos: Agendamento[];
  loading: boolean;
  error: string | null;
}

export const initialState: AgendamentoState = {
  agendamentos: [],
  loading: false,
  error: null,
};