import { Faq } from "./faq";

export interface AccountType {
    id: number;
    type: string;
    accounts: Account[];
    faqs: Faq[];
}

export enum ACCOUNT_TYPES {
    User = 1,
    Administrator,
    Css
}
