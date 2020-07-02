import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import { Service } from 'src/app/models/mil/service';
import { AppDataActionTypes, AppDataActions } from '../actions/appData.actions';

export interface ServicesState extends EntityState<Service> {
    allServicesLoaded: boolean;
}

export const adapter: EntityAdapter<Service> = createEntityAdapter<Service>();

export const initialServiceState: ServicesState = adapter.getInitialState({
    allServicesLoaded: false
  });

  export function servicesReducer(state = initialServiceState, action: AppDataActions): ServicesState {
    switch (action.type) {
        case AppDataActionTypes.AllServicesLoaded:
            return adapter.addAll(action.payload.services, {...state, allServicesLoaded: true});
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
