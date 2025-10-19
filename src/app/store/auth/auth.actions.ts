import { createActionGroup, emptyProps, props } from '@ngrx/store';
import type { User } from '../../models/user.model';
import type { UserCredencials } from '../../types/auth.type';

export const AuthActions = createActionGroup({
  source: "Auth",
  events: {
    'Login': props<{ userCredencials: UserCredencials }>(),
    'Login Success': props<{user: User}>(),
    'Login Failure': props<{error: string}>(),
    'Logout': emptyProps
  }
})