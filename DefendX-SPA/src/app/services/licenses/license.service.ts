import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { License } from 'src/app/models/license/license';
import { LicenseSearchResult } from 'src/app/models/license/licenseSearchResult';
import { SearchResult } from 'src/app/models/app/searchResult';
import { PrintQueueTuple } from 'src/app/models/license/printQueueTuple';

@Injectable({
  providedIn: 'root'
})
export class LicenseService {
    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }

    //#region Public Interface Functions

    //#region License Functions

    public saveLicense(newLicense: License): Observable<License> {
        // GMT causes convertion error on back end
        newLicense.dateExpired.setHours(9);
        newLicense.dob.setHours(9);

        return this.http.put<License>(this.baseUrl + 'licenses', newLicense, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    public updateLicense(license: License): Observable<License> {
        if (typeof license.dateExpired !== 'string') {
            // GMT causes convertion error on back end
            license.dateExpired.setHours(9);
        }

        if (typeof license.dob !== 'string') {
            // GMT causes convertion error on back end
            license.dob.setHours(9);
        }

        return this.http.post<License>(this.baseUrl + 'licenses', license, {
            headers: new HttpHeaders()
                .set('Content-Type', 'application/json')
        });
    }

    public getLicense(id: number): Observable<License> {
        return this.http.get<License>(this.baseUrl + 'licenses/' + id);
    }

    public deleteLicense(id: number): Observable<object> {
        return this.http.delete(this.baseUrl + 'licenses/' + id);
    }

    public deleteManyLicenses(ids: number[]): Observable<object> {
        let params = new HttpParams();
        ids.forEach(id => {
            params = params.append('ids', id.toString());
        });
        return this.http.delete(this.baseUrl + 'licenses/many', {params});
    }

    //#endregion License Functions

    //#region License Search/Display Functions

    public searchLicenses(
        queryString: string,
        pageNumber: number = 0,
        pageSize: number = 10): Observable<SearchResult<LicenseSearchResult>> {
            return this.http.get<SearchResult<LicenseSearchResult>>(
                this.baseUrl + 'licenses/search/', {
                    params: new HttpParams()
                        .set('queryString', queryString)
                        .set('pageNumber', pageNumber.toString())
                        .set('pageSize', pageSize.toString())
                    }
            );
    }

    public getUserLicenses(): Observable<SearchResult<LicenseSearchResult>> {
        return this.http.get<SearchResult<LicenseSearchResult>>(
            this.baseUrl + 'licenses/user'
        );
    }

    //#endregion License Search Functions

    //#region PrintQueue Functions

    public getPrintQueue(): Observable<PrintQueueTuple> {
        return this.http.get<PrintQueueTuple>(this.baseUrl + 'licenses/printQueue');
    }

    public addToPrintQueue( id: number): Observable<object> {
        return this.http.put(this.baseUrl + 'licenses/printQueue', id);
    }

    public addToPrintQueueMany( ids: number[] ): Observable<object> {
        return this.http.put(this.baseUrl + 'licenses/printQueue/many', ids);
    }

    public removeFromPrintQueue(licenseId: number): Observable<object> {
        return this.http.delete(this.baseUrl + 'licenses/printQueue/' + licenseId);
    }

    public removeAllFromPrintQueue(): Observable<object> {
        return this.http.delete(this.baseUrl + 'licenses/printQueue');
    }

    public licensePrinted(ids: number[]): Observable<object> {
        return this.http.put(this.baseUrl + 'licenses/printed', ids);
    }

    //#endregion PrintQueue Functions

    //#endregion Public Interface Functions

}
