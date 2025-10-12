import type { Class } from '../../models/class.model';

export interface AgendamentoState {
  aulas: Class[];
  loading: boolean;
  error: string | null;
}

export const initialState: AgendamentoState = {
  aulas: [],
  loading: false,
  error: null,
};