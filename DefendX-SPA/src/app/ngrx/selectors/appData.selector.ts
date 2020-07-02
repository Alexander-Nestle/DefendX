import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromService from '../reducers/service.reducer';
import * as fromUnit from '../reducers/unit.reducer';

import { ServicesState } from '../reducers/service.reducer';
import { UnitsState } from '../reducers/unit.reducer';

export const selectServicesState = createFeatureSelector<ServicesState>('services');
export const selectUnitsState = createFeatureSelector<UnitsState>('units');

//#region Services

export const selectServices = createSelector(
    selectServicesState,
    fromService.selectAll
  );

  export const selectAllServicesLoaded = createSelector(
    selectServicesState,
    servicesState => servicesState.allServicesLoaded
  );

//#endregion Services

//#region Ranks

  export const selectRanksByServiceId = (serviceId: number) => createSelector(
    selectServices,
    services => {
      const s = services.find(service => service.id === serviceId);
      return (s == null) ? [] : s.ranks;
    }
  );

//#endregion Ranks

//#region Units

  export const selectAllUnits = createSelector(
    selectUnitsState,
    fromUnit.selectAll
  );

  export const selectUnitByName = (name: string) => createSelector(
    selectAllUnits,
    allUnits => {
      const nameArray = name.split(' ');
      return allUnits.filter(unit => (
        nameArray.every(n => unit.name.toUpperCase().includes(n.toUpperCase())) ||
        (unit.unitAbbreviation && nameArray.every(n => unit.unitAbbreviation.toUpperCase().includes(n.toUpperCase())))
      ));
    }
  );

  export const selectUnitsRequested = createSelector(
    selectUnitsState,
    unitsState => unitsState.unitsRequested
  );

//#endregion Units
