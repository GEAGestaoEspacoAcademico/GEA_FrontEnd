import type { AgendamentoAula } from "../../models/agendamentoAula.model";

export interface AgendamentoState {
  agendamentos: AgendamentoAula[];
  selectedAgendamento: AgendamentoAula | null;
  loading: boolean;
  error: string | null;
}

export const initialState: AgendamentoState = {
  agendamentos: [],
  selectedAgendamento: null,
  loading: false,
  error: null,
};