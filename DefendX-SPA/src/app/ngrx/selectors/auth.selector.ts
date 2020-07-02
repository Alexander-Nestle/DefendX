import {createSelector} from '@ngrx/store';
import { ACCOUNT_TYPES } from 'src/app/models/user/accountType';


export const selectAuthState = state => state.auth;

export const selectIsAuthLoading = createSelector(
  selectAuthState,
  authState => authState.isLoading
);

export const isLoggedIn = createSelector(
  selectAuthState,
  auth => auth.loggedIn
);

export const isLoggedOut = createSelector(
  isLoggedIn,
  loggedIn => !loggedIn
);

export const isAdmin = createSelector(
  selectAuthState,
  auth => auth.isAdmin
);

export const isBasicUser = createSelector(
  selectAuthState,
  authState => authState.user.account.accountTypeId === ACCOUNT_TYPES.User
);

export const currentUser = createSelector(
  selectAuthState,
  authState => authState.user
);
