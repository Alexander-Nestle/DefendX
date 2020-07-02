import { UserSearchResult } from 'src/app/models/user/userSearchResult';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';
import { UserActions, UserActionTypes } from 'src/app/ngrx/actions/user.actions';


export interface UsersSearchState extends EntityState<UserSearchResult> {
    loading: boolean;
    totalCount: number;
}

export const adapter: EntityAdapter<UserSearchResult> = createEntityAdapter<UserSearchResult>({
    selectId: (userSearchResult: UserSearchResult) => userSearchResult.dodId
});

export const initialUserSearchState: UsersSearchState = adapter.getInitialState({
    loading: false,
    totalCount: 0
});

export function usersSearchReducer(state = initialUserSearchState, action: UserActions): UsersSearchState {
    switch (action.type) {
        case UserActionTypes.UserSearchEnded:
            return adapter.removeAll({...state, totalcount: 0});
        case UserActionTypes.UserAccountsPageCancelled:
            return {
                ...state,
                loading: false,
                totalCount: 0
            };
        case UserActionTypes.UserAccountsPageRequested:
            return {
                ...state,
                loading: true
            };
        case UserActionTypes.UserAccountsPageLoaded:
            return adapter.addMany(
                action.payload.userSearchResults, {
                    ...state, loading: false, totalCount: action.payload.totalCount
                }
            );
        default: return state;
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
