import { Action } from '@ngrx/store';
import { Service } from 'src/app/models/mil/service';
import { Unit } from 'src/app/models/mil/unit';

export enum AppDataActionTypes {
    AllServicesRequested = '[License Form] All Services Requested',
    AllServicesLoaded = '[Services API] All Services Loaded',
    UnitsByNameRequested = '[License Form] Units By Name Requested',
    UnitsLoaded = '[Mil Data API] Units Loaded',
    UnitsRequestCancelled = '[Mil Data API] Units Request Cancelled'
}

export class AllServicesRequested implements Action {
    readonly type = AppDataActionTypes.AllServicesRequested;
}

export class AllServicesLoaded implements Action {
    readonly type = AppDataActionTypes.AllServicesLoaded;

    constructor(public payload: { services: Service[]}) {}
}

export class UnitsByNameRequested implements Action {
    readonly type = AppDataActionTypes.UnitsByNameRequested;

    constructor(public payload: { name: string }) {}
}

export class UnitsLoaded implements Action {
    readonly type = AppDataActionTypes.UnitsLoaded;

    constructor(public payload: { units: Unit[] }) {}
}

export class UnitsRequestCancelled implements Action {
    readonly type = AppDataActionTypes.UnitsRequestCancelled;
}

export type AppDataActions =
    AllServicesRequested
    | AllServicesLoaded
    | UnitsByNameRequested
    | UnitsLoaded
    | UnitsRequestCancelled;
