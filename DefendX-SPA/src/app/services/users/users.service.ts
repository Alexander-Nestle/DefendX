import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user/user';
import { SearchResult } from '../../models/app/searchResult';
import { UserSearchResult } from 'src/app/models/user/userSearchResult';
import { AccountTypeChangeRequest } from 'src/app/models/app/accountTypeChangeRequest';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
    private baseUrl = environment.apiUrl;

    constructor(
        private http: HttpClient
    ) { }

    //#region Public Interface Functions

    //#region User Functions

    public getUser(id: number): Observable<User> {
        return this.http.get<User>(this.baseUrl + 'users/' + id);
    }

    public updateUser(user: User): Observable<User> {
        return this.http.post<User>(this.baseUrl + 'users', user, {
        headers: new HttpHeaders()
            .set('Content-Type', 'application/json')
        });
    }

    public requestAccountTypeChange(changeRequest: AccountTypeChangeRequest): Observable<any> {
        const formData = new FormData();
        formData.append('attachment', changeRequest.attachment as File, (changeRequest.attachment as File).name);
        formData.append('accountTypeName', changeRequest.accountTypeName);
        formData.append('justification', changeRequest.justification);
        formData.append('emailAddress', changeRequest.emailAddress);
        return this.http.post<AccountTypeChangeRequest>(
            this.baseUrl + 'users/request/', formData);
    }

    //#endregion User Functions

    //#region User Search Functions

    public searchUsers(
        queryString: string,
        pageNumber: number = 0,
        pageSize: number = 10): Observable<SearchResult<UserSearchResult>> {
            return this.http.get<SearchResult<UserSearchResult>>(
                this.baseUrl + 'users/search', {
                    params: new HttpParams()
                        .set('queryString', queryString)
                        .set('pageNumber', pageNumber.toString())
                        .set('pageSize', pageSize.toString())
                }
            );
    }

    //#endregion User Search Functions

    //#endregion Public Interface Functions

}
