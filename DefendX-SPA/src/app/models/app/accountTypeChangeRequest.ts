export interface AccountTypeChangeRequest {
    accountTypeName: string;
    justification: string;
    emailAddress: string;
    attachment: File | FormData;
}
