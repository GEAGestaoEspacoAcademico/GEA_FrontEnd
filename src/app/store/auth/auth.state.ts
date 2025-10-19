import type { User } from "../../models/user.model";

export interface AuthState {
  user: User | null;
  error: string | null,
  isLoading: boolean
}

export const initialState: AuthState = {
  user: null,
  error: null,
  isLoading: false
};