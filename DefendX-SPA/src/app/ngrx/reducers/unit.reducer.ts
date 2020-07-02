import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import { AppDataActionTypes, AppDataActions } from '../actions/appData.actions';
import { Unit } from 'src/app/models/mil/unit';

export interface UnitsState extends EntityState<Unit> {
    unitsRequested: boolean;
}

export const adapter: EntityAdapter<Unit> = createEntityAdapter<Unit>();

export const initialUnitState: UnitsState = adapter.getInitialState({
    unitsRequested: false
});

export function unitsReducer(state = initialUnitState, action: AppDataActions): UnitsState {
    switch (action.type) {
        case AppDataActionTypes.UnitsLoaded:
            return adapter.addAll(action.payload.units, {...state, unitsRequested: false});
        case AppDataActionTypes.UnitsByNameRequested:
            return {...state, unitsRequested: true};
        case AppDataActionTypes.UnitsRequestCancelled:
            return {...state, unitsRequested: false};
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
