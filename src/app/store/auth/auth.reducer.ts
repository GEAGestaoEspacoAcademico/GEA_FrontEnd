import { createReducer, on } from '@ngrx/store';
import { initialState } from './auth.state';
import { AuthActions } from './auth.actions';

export const authReducer = createReducer(
  initialState,

  on(AuthActions.loginSuccess, (state, {user}) => {
    return {
      ...state,
      user: user
    };
  }),

  on(AuthActions.logout, (state) => {
    return {
      ...state,
      user: null
    };
  })
);