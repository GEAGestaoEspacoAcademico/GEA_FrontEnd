import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { AuthLoginRequest, AuthLoginResponse } from '../../types/authLogin.type';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    Login: props<{ AuthLoginRequest: AuthLoginRequest }>(),
    'Login Success': props<{ user: AuthLoginResponse }>(),
    'Login Failure': props<{ error: string }>(),
    Logout: emptyProps,
  },
});
