import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import {
  AllServicesRequested,
  AppDataActionTypes,
  AllServicesLoaded,
  UnitsByNameRequested,
  UnitsLoaded,
  UnitsRequestCancelled
} from 'src/app/ngrx/actions/appData.actions';
import { mergeMap, filter, map, catchError } from 'rxjs/operators';
import { withLatestFrom } from 'rxjs/internal/operators/withLatestFrom';
import { AppDataService } from '../../services/common/appData.service';
import { selectAllServicesLoaded, selectUnitsRequested } from '../selectors/appData.selector';
import { of } from 'rxjs';
import { Rank } from 'src/app/models/mil/rank';

@Injectable()
export class AppDataEffects {

  @Effect()
  loadAllServices$ = this.actions$
    .pipe(
      ofType<AllServicesRequested>(AppDataActionTypes.AllServicesRequested),
      withLatestFrom(this.store.pipe(select(selectAllServicesLoaded))),
      filter(([action, allServicesLoaded]) => !allServicesLoaded),
      mergeMap(action => this.appDataService.GetServices()),
      map(services => {
        services.forEach(service => {
          service.ranks.sort(
            (a: Rank, b: Rank) => {
              if (a.tier < b.tier) {
                return -1;
              } else if (a.tier > b.tier) {
                return 1;
              } else {
                if (a.grade < b.grade) {
                  return -1;
                } else if (a.grade > b.grade) {
                  return 1;
                } else {
                  return 0;
                }
              }
            }
          );
        });
        return new AllServicesLoaded({services});
      })
    );

  @Effect()
  loadUnitsByName$ = this.actions$
    .pipe(
      ofType<UnitsByNameRequested>(AppDataActionTypes.UnitsByNameRequested),
      withLatestFrom(this.store.pipe(select(selectUnitsRequested))),
      filter(([action, selectUnitsRequested]) => !(action.payload.name === '') && selectUnitsRequested),
      mergeMap(([action, selectUnitsRequested]) => 
                this.appDataService.GetUnitsByName(action.payload.name)
              .pipe(
                catchError(err => {
                  console.log('error loading units', err);
                  this.store.dispatch(new UnitsRequestCancelled());
                    return of([]);
                })
              )),
      map(units => new UnitsLoaded({units}))
    );

  constructor(private actions$: Actions, private appDataService: AppDataService,
              private store: Store<AppState>) { }

}
