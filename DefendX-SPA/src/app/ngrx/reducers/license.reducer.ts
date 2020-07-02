import { EntityState, createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { License } from 'src/app/models/license/license';
import { LicenseActions, LicenseActionTypes } from 'src/app/ngrx/actions/license.actions';

export interface LicensesState extends EntityState<License> {
    loading: boolean;
    printQueueLoading: boolean;
    printQueueIds: Array<number>;
    printQueueCount: number;
}

export const adapter: EntityAdapter<License> = createEntityAdapter<License>();

export const initialLicenseState: LicensesState = adapter.getInitialState({
    loading: false,
    printQueueLoading: false,
    printQueueIds: [],
    printQueueCount: 0
});

export function licensesReducer(state = initialLicenseState, action: LicenseActions): LicensesState {
    switch (action.type) {
        case LicenseActionTypes.LicenseAdded:
            return adapter.addOne(action.payload.license, state);
        case LicenseActionTypes.LicenseRequested:
            return {...state, loading: true};
        case LicenseActionTypes.UserLicensesPageRequested:
            return {...state, loading: true};
        case LicenseActionTypes.LicenseLoaded:
            if (action.payload.license == null || !(<License>action.payload.license).id) {
                return state;
            }
            return adapter.addOne(action.payload.license, {
                ...state, loading: false
            });
        case LicenseActionTypes.LicenseLoadCancelled:
            return {...state, loading: false};
        case LicenseActionTypes.LicenseDeleted:
            return adapter.removeOne(action.payload.id, state);
        case LicenseActionTypes.LicenseDeletedMany:
            return adapter.removeMany(action.payload.ids, state);
        case LicenseActionTypes.LicenseUpdated:
            return adapter.updateOne(action.payload.license, state);
        case LicenseActionTypes.LicenseManyUpdated:
            return adapter.updateMany(action.payload.licenses, state);
        case LicenseActionTypes.LicensePrintQueueRequested:
            return { ...state, printQueueLoading: true };
        case LicenseActionTypes.LicensePrintQueueLoaded:
            return adapter.addMany(
                action.payload.printQueue.licenses,
                {
                    ...state,
                    printQueueIds: action.payload.printQueue.licenseIds,
                    printQueueLoading: false,
                    printQueueCount: action.payload.printQueue.licenseIds.length
                }
            );
        case LicenseActionTypes.LicensePrintQueueCancelled:
            return { ...state, printQueueLoading: false };
        case LicenseActionTypes.LicensePrintQueueEntryAdded:
            return {
                ...state, 
                printQueueIds: state.printQueueIds.concat(action.payload.id),
                printQueueCount: state.printQueueIds.length + 1
            };
        case LicenseActionTypes.LicensePrintQueueListAdded:
            return {
                ...state,
                printQueueIds: state.printQueueIds.concat(action.payload.ids),
                printQueueCount: state.printQueueIds.length + action.payload.ids.length
            };
        case LicenseActionTypes.LicensePrintQueueEntryRemoved:
            state.printQueueIds.splice(state.printQueueIds.indexOf(action.payload.licenseId), 1);
            return {...state, printQueueIds: state.printQueueIds, printQueueCount: state.printQueueIds.length};
        case LicenseActionTypes.LicensePrintQueueManyRemoved:
            const idsToRemove = action.payload.licenseIds.filter( (id) => state.printQueueIds.includes(id));
            idsToRemove.forEach( i =>  state.printQueueIds.splice(state.printQueueIds.indexOf(i), 1));
            return {...state, printQueueIds: state.printQueueIds, printQueueCount: state.printQueueIds.length};
        case LicenseActionTypes.AllLicensePrintQueueEntitiesRemoved:
            return {...state, printQueueIds: [], printQueueCount: 0};
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

export const getPrintQueueIds = (state: LicensesState) => state.printQueueIds;
