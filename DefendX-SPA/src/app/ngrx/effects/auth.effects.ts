import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {AuthActionTypes, Login, Logout, CurrentUserUpdate} from '../actions/auth.actions';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';
import {defer, of} from 'rxjs';
import { AuthUser } from 'src/app/models/authUser';
import { User } from 'src/app/models/user/user';


@Injectable()
export class AuthEffects {

  @Effect({dispatch: false})
  login$ = this.actions$.pipe(
    ofType<Login>(AuthActionTypes.LoginAction),
    tap(action => {
      localStorage.setItem('token', action.payload.authUser.token);
      localStorage.setItem('user', JSON.stringify(action.payload.authUser.user));
    })
  );

  @Effect({dispatch: false})
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.LogoutAction),
    tap(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.router.navigateByUrl('/login');
    })
  );

  @Effect({dispatch: false})
  CurrentUserUpdate$ = this.actions$.pipe(
      ofType<CurrentUserUpdate>(AuthActionTypes.CurrentUserUpdate),
      tap(action => {
          localStorage.removeItem('user');
          localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
  );

  @Effect()
  init$ = defer(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const authUser: AuthUser = {token: token, user: JSON.parse(user) as User};

      // microseconds difference converted to hours
      if (((Date.now() - new Date(authUser.user.account.lastLoginDate).getTime()) / 36e5) > 1) {
        return <any>of(new Logout());
      }
      return of(new Login({authUser}));
    } else {
      return <any>of(new Logout());
    }
  });

  constructor(private actions$: Actions, private router: Router) {


  }
}
