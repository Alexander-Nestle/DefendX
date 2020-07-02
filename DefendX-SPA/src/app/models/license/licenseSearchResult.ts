import { Service } from '../mil/service';

export interface LicenseSearchResult {
    id: number;
    firstName: string;
    middleInitial: string;
    lastName: string;
    dodId: number;
    service: Service;
    permitNumber: string;
    isAuthenticated: boolean;
}
