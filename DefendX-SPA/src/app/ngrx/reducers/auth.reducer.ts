import { Action } from '@ngrx/store';
import {AuthActions, AuthActionTypes} from '../actions/auth.actions';
import { User } from 'src/app/models/user/user';
import { ACCOUNT_TYPES } from '../../models/user/accountType';

export interface AuthState {
  loggedIn: boolean;
  isAdmin: boolean;
  token: string;
  user: User;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  isAdmin: false,
  token: undefined,
  user: undefined
};

export function authReducer(state = initialAuthState,
                            action: AuthActions): AuthState {
  switch (action.type) {

    case AuthActionTypes.LoginAction:
      return {
        loggedIn: true,
        isAdmin: action.payload.authUser.user.account.accountTypeId === ACCOUNT_TYPES.Administrator,
        token: action.payload.authUser.token,
        user: action.payload.authUser.user
      };

    case AuthActionTypes.LogoutAction:
        return {
          loggedIn: false,
          isAdmin: false,
          token: undefined,
          user: undefined
        };

    case AuthActionTypes.CurrentUserUpdate:
        return {
          ...state,
          user: action.payload.user
        };

    default:
      return state;
  }
}
