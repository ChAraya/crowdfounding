import { Action } from '@ngrx/store';

export class AuthActions {
  static LOGIN = 'LOGIN';
  static LOGIN_SUCCESS = 'LOGIN_SUCCESS';
  static LOGOUT = 'LOGOUT';
  static LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

  login(): Action {
    return { type: AuthActions.LOGIN };
  }

  loginSuccess(user): Action {
    return {
      type: AuthActions.LOGIN_SUCCESS,
      payload: user.user
    };
  }

  logout(): Action {
    return { type: AuthActions.LOGOUT };
  }

  logoutSuccess(): Action {
    return { type: AuthActions.LOGOUT_SUCCESS };
  }
}
