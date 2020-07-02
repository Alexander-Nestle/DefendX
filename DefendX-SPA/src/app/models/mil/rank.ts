import { Service } from './service';

export interface Rank {
    id: number;
    serviceId: number;
    service: Service;
    name: string;
    tier: string;
    grade: number;
}
