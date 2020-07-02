import { Rank } from './rank';

export interface Service {
    id: number;
    name: string;
    ranks: Rank[];
}
