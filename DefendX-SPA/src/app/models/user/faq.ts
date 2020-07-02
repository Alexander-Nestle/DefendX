import { AccountType } from './accountType';

export interface Faq {
    id: number;
    question: string;
    answer: string;
    accountTypeId?: number;
    accountType?: AccountType;
}
