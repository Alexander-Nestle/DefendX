import { User } from "./user/user";

export interface AuthUser {
    token: string;
    user: User;
}
