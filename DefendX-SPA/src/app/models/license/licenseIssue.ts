import { UserSearchResult } from '../user/userSearchResult';

export interface LicenseIssue {
    id: number;
    user: UserSearchResult;
    issueDate: Date;
}
