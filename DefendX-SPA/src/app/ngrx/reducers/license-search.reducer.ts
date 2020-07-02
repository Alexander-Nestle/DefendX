import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { LicenseSearchResult } from 'src/app/models/license/licenseSearchResult';
import { LicenseActions, LicenseActionTypes } from '../actions/license.actions';

export interface LicensesSearchState extends EntityState<LicenseSearchResult> {
    loading: boolean;
    totalCount: number;
    queryString: string;
}

export const adapter: EntityAdapter<LicenseSearchResult> = createEntityAdapter<LicenseSearchResult>();

export const initialLicenseSearchState: LicensesSearchState = adapter.getInitialState({
    loading: false,
    totalCount: 0,
    queryString: null
});

export function licensesSearchReducer(state = initialLicenseSearchState, action: LicenseActions): LicensesSearchState {
    switch (action.type) {
        case LicenseActionTypes.LicenseSearchEnded:
            return adapter.removeAll({...state, totalCount: 0, queryString: null});

        case LicenseActionTypes.LicensesPageCancelled:
            return {
                ...state,
                loading: false,
                totalCount: 0
            };

        case LicenseActionTypes.LicensesPageRequested:
            return {
                ...state,
                loading: true,
                queryString: action.payload.queryString
            };

        case LicenseActionTypes.UserLicensesPageRequested:
            return {
                ...state,
                loading: true,
                queryString: null
            };

        case LicenseActionTypes.LicensesPageLoaded:
            return adapter.addMany(
                action.payload.licenseSearchResults, {
                    ...state, loading: false, totalCount: action.payload.totalCount
                });

        case LicenseActionTypes.LicenseDeleted:
            return adapter.removeOne(action.payload.id, state);

        case LicenseActionTypes.LicenseDeletedMany:
                return adapter.removeMany(action.payload.ids, state);
        
        default:
            return state;
    }

}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
} = adapter.getSelectors();
