import { License } from 'src/app/models/license/license';
import { Action } from '@ngrx/store';
import { LicenseSearchResult } from 'src/app/models/license/licenseSearchResult';
import { PageQuery } from 'src/app/models/app/pageQuery';
import { Update } from '@ngrx/entity';
import { PrintQueueTuple } from 'src/app/models/license/printQueueTuple';
import { User } from 'src/app/models/user/user';


export enum LicenseActionTypes {
    LicenseAdded = '[License Form] License Saved',
    LicenseRequested = '[License View] License Requested',
    LicenseLoaded = '[Licenses API] License Loaded',
    LicenseLoadCancelled = '[Licenses API] License Load Cancelled',
    LicenseSearchEnded = '[Licenses View] Licenses Search Ended',
    LicensesPageRequested = '[Licenses View] Licenses Query Submitted',
    LicensesPageLoaded = '[Licenses API] Licenses Page Loaded',
    LicensesPageCancelled = '[Licenses API] Licenses Page Cancelled',
    LicenseDeleted = '[License API] License Deleted',
    LicenseDeletedMany = '[License API] Many License Deleted',
    LicenseUpdated = '[License Form] License Updated',
    LicenseManyUpdated = '[Licenses Print] Licenses Updated',
    LicenseManyPrinted = '[License API] Many Licenses Printed',
    LicensePrintQueueRequested = '[Print Queue] Print Queue Requested',
    LicensePrintQueueLoaded = '[Licenses API] Print Queue Loaded',
    LicensePrintQueueCancelled = '[Licenses API] License Print Queue Load Cancelled',
    LicensePrintQueueEntryAdded = '[License View] License Added to Print Queue',
    LicensePrintQueueListAdded = '[License View] License List Added to Print Queue',
    LicensePrintQueueEntryRemoved = '[License View] License Removed From Print Queue',
    LicensePrintQueueManyRemoved = '[License View] Many Licenses Removed From Print Queue',
    AllLicensePrintQueueEntitiesRemoved = '[License View] All Licenses Removed From Print Queue',
    UserLicensesPageRequested = '[Licenses View] Licenses of User Account Requested'
}

export class LicenseAdded implements Action {
    readonly type = LicenseActionTypes.LicenseAdded;

    constructor(public payload: { license: License }) {}
}

export class LicenseRequested implements Action {
    readonly type = LicenseActionTypes.LicenseRequested;

    constructor(public payload: { id: number }) {}
}

export class LicenseLoaded implements Action {
    readonly type = LicenseActionTypes.LicenseLoaded;

    constructor(public payload: {license: License}) {}
}

export class LicenseLoadCancelled implements Action {
    readonly type = LicenseActionTypes.LicenseLoadCancelled;
}

export class LicenseSearchEnded implements Action {

    readonly type = LicenseActionTypes.LicenseSearchEnded;

}

export class LicensesPageRequested implements Action {

    readonly type = LicenseActionTypes.LicensesPageRequested;

    constructor(public payload: {queryString: string, page: PageQuery}) {}
}

export class LicensesPageLoaded implements Action {

    readonly type = LicenseActionTypes.LicensesPageLoaded;

    constructor(public payload: {licenseSearchResults: LicenseSearchResult[], totalCount: number}) {}
}

export class LicensesPageCancelled implements Action {

    readonly type = LicenseActionTypes.LicensesPageCancelled;
}

export class LicenseDeleted implements Action {
    readonly type = LicenseActionTypes.LicenseDeleted;

    constructor(public payload: {id: number}) {}
}

export class LicenseDeletedMany implements Action {
    readonly type = LicenseActionTypes.LicenseDeletedMany;

    constructor(public payload: { ids: number[] }) {}
}

export class LicenseUpdated implements Action {
    readonly type = LicenseActionTypes.LicenseUpdated;

    constructor(public payload: { license: Update<License> }) {}
}

export class LicenseManyUpdated implements Action {
    readonly type = LicenseActionTypes.LicenseManyUpdated;

    constructor(public payload: { licenses: Update<License>[] }) {}
}

export class LicenseManyPrinted implements Action {
    readonly type = LicenseActionTypes.LicenseManyPrinted;

    constructor(public payload: {licenses: License[], user: User, time: Date}) {}
}

export class LicensePrintQueueRequested implements Action {
    readonly type = LicenseActionTypes.LicensePrintQueueRequested;
}

export class LicensePrintQueueLoaded implements Action {
    readonly type = LicenseActionTypes.LicensePrintQueueLoaded;

    constructor(public payload: { printQueue: PrintQueueTuple }){}
}

export class LicensePrintQueueCancelled implements Action {
    readonly type = LicenseActionTypes.LicensePrintQueueCancelled;
}

export class LicensePrintQueueEntryAdded implements Action {
    readonly type = LicenseActionTypes.LicensePrintQueueEntryAdded;

    constructor(public payload: { id: number }) {}
}

export class LicensePrintQueueManyAdded implements Action {
    readonly type = LicenseActionTypes.LicensePrintQueueListAdded;

    constructor(public payload: { ids: number[] }) {}
}

export class LicensePrintQueueEntryRemoved implements Action {
    readonly type = LicenseActionTypes.LicensePrintQueueEntryRemoved;

    constructor(public payload: { licenseId: number }) {}
}

export class LicensePrintQueueManyremoved implements Action {
    readonly type = LicenseActionTypes.LicensePrintQueueManyRemoved;

    constructor(public payload: { licenseIds: number[] }) {}
}

export class AllLicensePrintQueueEntyiesRemoved implements Action {
    readonly type = LicenseActionTypes.AllLicensePrintQueueEntitiesRemoved;
}

export class UserLicensesPageRequested implements Action {
    readonly type = LicenseActionTypes.UserLicensesPageRequested;
}

export type LicenseActions =
    LicenseAdded
    | LicenseRequested
    | LicenseLoaded
    | LicenseLoadCancelled
    | LicenseSearchEnded
    | LicensesPageRequested
    | LicensesPageLoaded
    | LicensesPageCancelled
    | LicenseDeleted
    | LicenseDeletedMany
    | LicenseUpdated
    | LicenseManyUpdated
    | LicenseManyPrinted
    | LicensePrintQueueRequested
    | LicensePrintQueueLoaded
    | LicensePrintQueueCancelled
    | LicensePrintQueueEntryAdded
    | LicensePrintQueueManyAdded
    | LicensePrintQueueEntryRemoved
    | LicensePrintQueueManyremoved
    | AllLicensePrintQueueEntyiesRemoved
    | UserLicensesPageRequested;
