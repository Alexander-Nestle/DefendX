import { Action } from '@ngrx/store';
import { User } from 'src/app/models/user/user';
import { PageQuery } from 'src/app/models/app/pageQuery';
import { Update } from '@ngrx/entity';
import { UserSearchResult } from 'src/app/models/user/userSearchResult';
import { AccountType } from 'src/app/models/user/accountType';
import { Faq } from 'src/app/models/user/faq';

export enum UserActionTypes {
    UserRequested = '[User Account View] User Requested',
    UserLoaded = '[Users API] User Loaded',
    UserSearchEnded = '[User Accounts View] User Account Search Ended',
    UserAccountsPageRequested = '[User Accounts View] Users Query Submitted',
    UserAccountsPageLoaded = '[Users API] Users Page Loaded',
    UserAccountsPageCancelled = '[Users API] Users Page Cancelled',
    UserUpdateRequested = '[User Account Dialog] User Update Requested',
    UserUpdateCancelled = '[User Account Dialog] User Update Cancelled',
    UserUpdated = '[User Account Form] User Updated',
    AllAccountTypesRequested = '[Account Form] All Account Types Requested',
    AllAccountTypesLoaded = '[AppData API] All Account Types Loaded',
    FaqAddedSuccess = '[AppData API] FAQ Added Successfully',
    FaqEditedSuccess = '[AppData API] FAQ Edited Successfully',
    FaqDeletedSuccess = '[AppData API] FAQ Deleted Successfully', 
    EmailSendRequest = '[Profile | Support] Email Request Sent by User',
    EmailResponce = '[API] API Email Sent'
}

export class UserRequested implements Action {
    readonly type = UserActionTypes.UserRequested;

    constructor(public payload: { id: number }) {}
}

export class UserLoaded implements Action {
    readonly type = UserActionTypes.UserLoaded;

    constructor(public payload: {user: User}) {}
}

export class UserSearchEnded implements Action {
    readonly type = UserActionTypes.UserSearchEnded;
}

export class UserAccountsPageRequested implements Action {
    readonly type = UserActionTypes.UserAccountsPageRequested;

    constructor(public payload: {queryString: string, page: PageQuery}) {}
}

export class UserAccountsPageLoaded implements Action {
    readonly type = UserActionTypes.UserAccountsPageLoaded;

    constructor(public payload: {userSearchResults: UserSearchResult[], totalCount: number}) {}
}

export class UserAccountsPageCancelled implements Action {
    readonly type = UserActionTypes.UserAccountsPageCancelled;
}

export class UserUpdateRequested implements Action {
    readonly type = UserActionTypes.UserUpdateRequested;
}

export class UserUpdateCancelled implements Action {
    readonly type = UserActionTypes.UserUpdateCancelled;
}

export class UserUpdated implements Action {
    readonly type = UserActionTypes.UserUpdated;

    constructor(public payload: { user: Update<User> }) {}
}

export class AllAccountTypesRequested implements Action {
    readonly type = UserActionTypes.AllAccountTypesRequested;
}

export class AllAccountTypesLoaded implements Action {
    readonly type = UserActionTypes.AllAccountTypesLoaded;

    constructor(public payload: { accountTypes: AccountType[] }) {}
}

export class FaqAddedSuccess implements Action {
    readonly type = UserActionTypes.FaqAddedSuccess;

    constructor(public payload: { faq: Faq }) {}
}

export class FaqEditedSuccess implements Action {
    readonly type = UserActionTypes.FaqEditedSuccess;

    constructor(public payload: { faq: Faq }) {}
}

export class FaqDeletedSuccess implements Action {
    readonly type = UserActionTypes.FaqDeletedSuccess;

    constructor(public payload: {faq: Faq}) {}
}

export class EmailSendRequest implements Action {
    readonly type = UserActionTypes.EmailSendRequest;
}

export class EmailResponce implements Action {
    readonly type = UserActionTypes.EmailResponce;
}

export type UserActions =
UserRequested
| UserLoaded
| UserSearchEnded
| UserAccountsPageRequested
| UserAccountsPageLoaded
| UserAccountsPageCancelled
| UserUpdateRequested
| UserUpdateCancelled
| UserUpdated
| AllAccountTypesRequested
| AllAccountTypesLoaded
| FaqAddedSuccess
| FaqEditedSuccess
| FaqDeletedSuccess
| EmailSendRequest
| EmailResponce;
