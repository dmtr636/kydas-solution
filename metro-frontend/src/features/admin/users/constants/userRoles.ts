import { UserRole } from "../types/User";
import { SelectOption } from "src/ui/components/inputs/Select/Select.types.ts";

export const userRoles: Record<UserRole, string> = {
    ROOT: "Администратор",
    ADMIN: "Администратор",
    SPECIALIST: "Специалист",
    OPERATOR: "Оператор",
    EMPLOYEE: "Инспектор",
};

export const userRolesOptions: SelectOption<string>[] = Object.entries(userRoles)
    .map(([value, name]) => ({
        name,
        value,
    }))
    .filter((option) => option.value !== "ROOT" && option.value !== "EMPLOYEE");
