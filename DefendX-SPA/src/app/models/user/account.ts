import { AccountType } from './accountType';

export interface Account {
    id: number;
    accountTypeId: number;
    accountType: AccountType;
    lastLoginDate: Date;
    dateCreated: Date;
}
