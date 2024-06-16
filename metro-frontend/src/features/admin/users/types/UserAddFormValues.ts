import { UserRole } from "./User.ts";

export interface UserAddFormValues {
    email: string;
    role: UserRole | null;
    name: string | null;
}

export interface UserEditFormValues {
    email: string;
    role: UserRole;
    name: string | null;
}
