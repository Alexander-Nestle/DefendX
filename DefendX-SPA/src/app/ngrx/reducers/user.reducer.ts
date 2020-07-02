import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { User } from 'src/app/models/user/user';
import { UserActions, UserActionTypes } from 'src/app/ngrx/actions/user.actions';

export interface UsersState extends EntityState<User> {
    loading: boolean;
}

export const adapter: EntityAdapter<User> = createEntityAdapter<User>({
    selectId: (user: User) => user.dodId
});

export const initialLicenseState: UsersState = adapter.getInitialState({
    loading: false
});

export function usersReducer(state = initialLicenseState, action: UserActions): UsersState {
    switch (action.type) {
        case UserActionTypes.UserRequested:
            return {...state, loading: true};

        case UserActionTypes.UserLoaded:
            return adapter.addOne(action.payload.user, {
                ...state, loading: false
            });

        case UserActionTypes.UserUpdateRequested:
            return { ...state, loading: true };

        case UserActionTypes.UserUpdateCancelled:
            return { ...state, loading: false };

        case UserActionTypes.UserUpdated:
            return adapter.updateOne(action.payload.user, {...state, loading: false});

        case UserActionTypes.EmailSendRequest:
            return {...state, loading: true };

        case UserActionTypes.EmailResponce:
            return {...state, loading: false };

        default: {
            return state;
        }
    }
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
