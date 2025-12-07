import { createFeatureSelector, createSelector } from '@ngrx/store';
import type { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectCurrentUser = createSelector(selectAuthState, (state: AuthState) => state.user);

export const selectIsLoggedIn = createSelector(selectCurrentUser, (user) => user !== null);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectAuthIsLoading = createSelector(selectAuthState, (state) => state.isLoading);

export const selectUserCargo = createSelector(selectCurrentUser, (user) => user?.usuarioCargo);

export const selectUserId = createSelector(selectCurrentUser, (user) => user?.usuarioId);
