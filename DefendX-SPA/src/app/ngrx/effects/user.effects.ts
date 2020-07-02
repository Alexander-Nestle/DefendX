import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import { mergeMap, map, catchError, withLatestFrom, filter } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import {
    UserRequested,
    UserActionTypes,
    UserLoaded,
    UserAccountsPageRequested,
    UserAccountsPageCancelled,
    UserAccountsPageLoaded, 
    AllAccountTypesRequested,
    AllAccountTypesLoaded} from 'src/app/ngrx/actions/user.actions';
import { UsersService } from 'src/app/services/users/users.service';
import { SearchResult } from 'src/app/models/app/searchResult';
import { UserSearchResult } from 'src/app/models/user/userSearchResult';
import { of } from 'rxjs';
import { AppDataService } from 'src/app/services/common/appData.service';
import { selectAllAccountTypesLoaded } from '../selectors/user.selector';

@Injectable()
export class UserEffects {
    @Effect()
    loadUser$ = this.actions$
        .pipe(
            ofType<UserRequested>(UserActionTypes.UserRequested),
            mergeMap(action => this.userService.getUser(action.payload.id)),
            map(user => new UserLoaded({user}))
        );

    @Effect()
    loadUsersPage$ = this.actions$
        .pipe(
            ofType<UserAccountsPageRequested>(UserActionTypes.UserAccountsPageRequested),
            mergeMap(({payload}) =>
                this.userService.searchUsers(payload.queryString, payload.page.pageIndex, payload.page.pageSize)
                    .pipe(
                        catchError(err => {
                            console.log('error loading a users page', err);
                            this.store.dispatch(new UserAccountsPageCancelled());
                            return of({results: [], totalCount: 0} as SearchResult<UserSearchResult>);
                        })
                    )
            ),
            map(searchResult => new UserAccountsPageLoaded({
                    userSearchResults: searchResult.results,
                    totalCount: searchResult.totalCount
                }))
        );

    @Effect()
    loadAllAccountTypes$ = this.actions$
        .pipe(
            ofType<AllAccountTypesRequested>(UserActionTypes.AllAccountTypesRequested),
            withLatestFrom(this.store.pipe(select(selectAllAccountTypesLoaded))),
            filter(([action, allAccountTypesLoaded]) => !allAccountTypesLoaded),
            mergeMap(action => this.appDataService.GetAccountTypes()),
            map(accountTypes => new AllAccountTypesLoaded({accountTypes}))
        );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private userService: UsersService,
        private appDataService: AppDataService
    ) {}
}
