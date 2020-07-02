import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import {
    LicensesPageRequested,
    LicenseActionTypes,
    LicensesPageLoaded,
    LicensesPageCancelled,
    LicenseRequested,
    LicenseLoaded,
    LicenseLoadCancelled,
    LicensePrintQueueRequested,
    LicensePrintQueueLoaded,
    LicensePrintQueueCancelled,
    UserLicensesPageRequested,
    LicenseDeleted,
    LicensePrintQueueEntryRemoved,
    LicenseDeletedMany,
    LicensePrintQueueManyremoved,
    LicenseManyPrinted,
    LicenseManyUpdated
} from 'src/app/ngrx/actions/license.actions';
import { mergeMap, map, catchError, withLatestFrom, filter, tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { LicenseService } from 'src/app/services/licenses/license.service';
import { of } from 'rxjs';
import { SearchResult } from '../../models/app/searchResult';
import { LicenseSearchResult } from 'src/app/models/license/licenseSearchResult';
import { PrintQueueTuple } from 'src/app/models/license/printQueueTuple';
import { selectPrintQueue } from 'src/app/ngrx/selectors/license.selector';
import { select } from '@ngrx/store';
import { License } from 'src/app/models/license/license';
import { Router } from '@angular/router';
import { LicenseIssue } from 'src/app/models/license/licenseIssue';
import { Update } from '@ngrx/entity';
import { UserSearchResult } from 'src/app/models/user/userSearchResult';


@Injectable()
export class LicenseEffects {
    @Effect()
    loadLicense$ = this.actions$
        .pipe(
            ofType<LicenseRequested>(LicenseActionTypes.LicenseRequested),
            mergeMap(action => this.licenseService.getLicense(action.payload.id)
                .pipe(
                    catchError(err => {
                        console.log('error loading license ', err);
                        this.store.dispatch(new LicenseLoadCancelled());
                        return of({} as License);
                    })
                )
            ),
            map(license => new LicenseLoaded({license}))
        );

    @Effect()
    loadLicensesPage$ = this.actions$
        .pipe(
            ofType<LicensesPageRequested>(LicenseActionTypes.LicensesPageRequested),
            mergeMap(({payload}) =>
                this.licenseService.searchLicenses(payload.queryString, payload.page.pageIndex, payload.page.pageSize)
                .pipe(
                    catchError(err => {
                        console.log('error loading a lessons page ', err);
                        this.store.dispatch(new LicensesPageCancelled());
                        return of({results: [], totalCount: 0} as SearchResult<LicenseSearchResult>);
                    })
                )
            ),
            map(searchResult => new LicensesPageLoaded({licenseSearchResults: searchResult.results, totalCount: searchResult.totalCount}))
        );

    @Effect()
    loadPrintQueue$ = this.actions$
        .pipe(
            ofType<LicensePrintQueueRequested>(LicenseActionTypes.LicensePrintQueueRequested),
            mergeMap( action => {
                return this.licenseService.getPrintQueue()
                .pipe(
                    catchError(err => {
                        console.log('error loading print queue ', err);
                        this.store.dispatch(new LicensePrintQueueCancelled());
                        return of({licenseIds: [], licenses: []} as PrintQueueTuple);
                    })
                );
            }),
            map(printQueueTuple => {
                return new LicensePrintQueueLoaded({printQueue: printQueueTuple});
            })
        );

    @Effect()
    loadUserLicensesPage$ = this.actions$
        .pipe(
            ofType<UserLicensesPageRequested>(LicenseActionTypes.UserLicensesPageRequested),
            mergeMap(action => {
                return this.licenseService.getUserLicenses()
                .pipe(
                    catchError(err => {
                        console.log('error loading user licenses', err);
                        this.store.dispatch(new LicensesPageCancelled());
                        return of({results: [], totalCount: 0} as SearchResult<LicenseSearchResult>);
                    })
                );
            }),
            map(userLicenses => new LicensesPageLoaded({licenseSearchResults: userLicenses.results, totalCount: userLicenses.totalCount})
            )
        );

    @Effect()
    licenseDeleted$ = this.actions$
        .pipe(
            ofType<LicenseDeleted>(LicenseActionTypes.LicenseDeleted),
            tap((action) => {
                if (this.router.url === '/licenses/edit/' + action.payload.id) {
                    this.router.navigate(['/licenses']);
                }
            }),
            withLatestFrom(this.store.pipe(select(selectPrintQueue))),
            filter(([action, printQueue]) => printQueue.indexOf(action.payload.id) >= 0),
            map(([action, printQueue]) => new LicensePrintQueueEntryRemoved({licenseId: action.payload.id}))
        );

    @Effect()
    licenseDeletedMany$ = this.actions$
        .pipe(
            ofType<LicenseDeletedMany>(LicenseActionTypes.LicenseDeletedMany),
            withLatestFrom(this.store.pipe(select(selectPrintQueue))),
            filter(([action, printQueue]) => action.payload.ids.some(id => printQueue.indexOf(id) >= 0)),
            map(([action, printQueue]) => {
                return new LicensePrintQueueManyremoved({licenseIds: action.payload.ids});
            })
        );

    @Effect()
    licenseManyPrinted$ = this.actions$
        .pipe(
            ofType<LicenseManyPrinted>(LicenseActionTypes.LicenseManyPrinted),
            tap((action) => {
                action.payload.licenses.forEach(l => {
                    const userCompressed: UserSearchResult = {
                        dodId: action.payload.user.dodId,
                        firstName: action.payload.user.firstName,
                        middleInitial: action.payload.user.middleInitial,
                        lastName: action.payload.user.lastName,
                        lastLoginDate: action.payload.user.account.lastLoginDate,
                        accountTypeName: action.payload.user.account.accountType.type
                    };

                    // The API that logs that issues doesn't return an ID, only added ID on SPA to easily enable a delete feature
                    l.issues.push({ id: 0, user: userCompressed, issueDate: action.payload.time } as LicenseIssue);
                });
            }),
            map((action) => {
                const updatedLicenses: Update<License>[] = action.payload.licenses.map((l) => {
                    return {
                        id: l.id,
                        changes: l
                    };
                });
                return new LicenseManyUpdated({licenses: updatedLicenses});
            })
        );

    constructor(
        private actions$: Actions,
        private store: Store<AppState>,
        private licenseService: LicenseService,
        private router: Router) { }
}
