import * as fromUser from '../reducers/user.reducer';
import * as fromUserSearch from '../reducers/user-search.reducer';
import * as fromAccountTypes from '../reducers/accountType.reducer';

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UsersState } from '../reducers/user.reducer';
import { UsersSearchState } from '../reducers/user-search.reducer';
import { AccountTypeState } from '../reducers/accountType.reducer';

import { PageQuery } from 'src/app/models/app/pageQuery';

export const selectUsersState = createFeatureSelector<UsersState>('users');
export const selectUsersSearchState = createFeatureSelector<UsersSearchState>('usersSearch');
export const selectAccountTypesState = createFeatureSelector<AccountTypeState>('accountTypes');


//#region User Selectors

export const selectAllUsers = createSelector(
    selectUsersState,
    fromUser.selectAll
);

export const selectUserById = (id: number) => createSelector(
    selectUsersState,
    usersState => usersState.entities[id]
);

export const selectUserRequestLoading = createSelector(
    selectUsersState,
    usersState => usersState.loading
);

//#endregion User Selectors

//#region User Search Selectors

export const selectAllUserSearchResults = createSelector(
    selectUsersSearchState,
    fromUserSearch.selectAll
);

export const selectUserSearchPage = (queryString: string, page: PageQuery) => createSelector(
    selectAllUserSearchResults,
    allUsersSearch => {
        const start = page.pageIndex * page.pageSize;
        const end = start + page.pageSize;

        return allUsersSearch
                .slice(start, end);
    }
);

export const selectUserSearchCount = createSelector(
    selectUsersSearchState,
    usersSearchState => usersSearchState.totalCount
);

export const selectUsersSearchLoading = createSelector(
    selectUsersSearchState,
    usersSearchState => usersSearchState.loading
);

//#endregion User Search Selectors

//#region Account Type Selectors

export const selectAccountTypes = createSelector(
    selectAccountTypesState,
    fromAccountTypes.selectAll
  );

export const selectAllAccountTypesLoaded = createSelector(
    selectAccountTypesState,
    accountTypesState => accountTypesState.allAccountTypesLoaded
);

//#endregion Account Type Selectors
