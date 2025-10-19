import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(
  selectAuthState,
  (state: AuthState) => state.user
);

export const selectIsLoggedIn = createSelector(
  selectCurrentUser,
  (user) => user !== null 
);