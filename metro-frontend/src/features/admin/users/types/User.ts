export interface User {
    id: number;
    email: string;
    role: UserRole;
    name: string | null;
}

export type UserRole = "ROOT" | "ADMIN" | "SPECIALIST" | "OPERATOR" | "EMPLOYEE";
