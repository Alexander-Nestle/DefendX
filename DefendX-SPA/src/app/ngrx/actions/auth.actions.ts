export class Auth {
}
import { Action } from '@ngrx/store';
import { AuthUser } from 'src/app/models/authUser';
import { User } from 'src/app/models/user/user';



export enum AuthActionTypes {
  LoginAction = '[Login] Action',
  LogoutAction = '[Logout] Action',
  CurrentUserUpdate = '[User Profile] Update Current User'
}


export class Login implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public payload: {authUser: AuthUser}) {}
}

export class Logout implements Action {

  readonly type = AuthActionTypes.LogoutAction;
}

export class CurrentUserUpdate implements Action {
  readonly type = AuthActionTypes.CurrentUserUpdate;

  constructor(public payload: {user: User}) {}
}


export type AuthActions =
Login
| Logout
| CurrentUserUpdate;
