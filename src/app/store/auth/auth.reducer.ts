import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import { AuthActions } from './auth.actions';

export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),

  on(AuthActions.loginSuccess, (state, { user }) => {
    return {
      ...state,
      user: user,
      error: null,
      isLoading: false,
    };
  }),

  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    isLoading: false,
    error: error,
  })),

  on(AuthActions.logout, (state) => {
    return {
      ...state,
      user: null,
      isLoading: false,
      error: null,
    };
  }),
);
