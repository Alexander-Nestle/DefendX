import * as fromLicense from '../reducers/license.reducer';
import * as fromLicenseSearch from '../reducers/license-search.reducer';

import { LicensesState } from '../reducers/license.reducer';
import { LicensesSearchState } from '../reducers/license-search.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PageQuery } from 'src/app/models/app/pageQuery';
import { License } from 'src/app/models/license/license';

export const selectLicensesState = createFeatureSelector<LicensesState>('licenses');
export const selectLicensesSearchState = createFeatureSelector<LicensesSearchState>('licensesSearch');

//#region License Selectors

export const selectAllLicenses = createSelector(
    selectLicensesState,
    fromLicense.selectAll
);

export const selectLicenseById = (id: number) => createSelector(
    selectLicensesState,
    licenseState => {
        return licenseState.entities[id];
    }
);

export const selectLicenseRequestLoading = createSelector(
    selectLicensesState,
    licensesState => licensesState.loading
);

//#endregion License Selectors

//#region License PrintQueue Selectors

export const selectPrintQueueLicenses = createSelector(
    selectLicensesState,
    licensesState => {

        if (!licensesState) {
            return [];
        }
        const licenses: Array<License> = [];
        licensesState.printQueueIds.forEach(id => {
            licenses.push(licensesState.entities[id]);
        });
        return licenses;
    }
);

export const selectPrintQueue = createSelector(
    selectLicensesState,
    licensesState => licensesState.printQueueIds
);

export const selectPrintQueueCount = createSelector(
    selectLicensesState,
    licensesState => licensesState.printQueueCount
);

//#endregion License PrintQueue Selectors

//#region License Search Selectors

export const selectAllLicensesSearch = createSelector(
    selectLicensesSearchState,
    fromLicenseSearch.selectAll
);

export const selectLicenseSearchPage = (page: PageQuery) => createSelector(
    selectAllLicensesSearch,
    allLicensesSearch => {
        const start = page.pageIndex * page.pageSize;
        const end = start + page.pageSize;
    return allLicensesSearch
          .slice(start, end);
    }
);

export const selectLicenseSearchCount = createSelector(
    selectLicensesSearchState,
    licensesSearchState => licensesSearchState.totalCount
);

export const selectLicensesSearchLoading = createSelector(
    selectLicensesSearchState,
    licensesSearchState => licensesSearchState.loading
);

export const selectLicenseSearchQueryString = createSelector(
    selectLicensesSearchState,
    licenseSearchState => licenseSearchState.queryString
);

//#endregion License Search Selectors
