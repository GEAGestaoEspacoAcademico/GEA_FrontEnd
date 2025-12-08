import type { Usuario } from '../../models/usuario.model';

export interface AuthState {
  user: Usuario | null;
  error: string | null;
  isLoading: boolean;
}

export const initialState: AuthState = {
  user: null,
  error: null,
  isLoading: false,
};
