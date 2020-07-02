import { Account } from './account';
import { Service } from '../mil/service';
import { Rank } from '../mil/rank';
import { Unit } from 'src/app/models/mil/unit';

export interface User {
    dodId: number;
    accountId: number;
    account: Account;
    unitId: number;
    unit: Unit;
    serviceId: number;
    service: Service;
    rankId: number;
    rank: Rank;
    firstName: string;
    middleInitial: string;
    lastName: string;
    dsnPhone: string;
    commPhone: string;
    email: string;
    signatureData: string;
}
