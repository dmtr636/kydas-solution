import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import styles from "./RequestAssignedEmployees.module.scss";
import { getFullName, getNameInitials } from "src/shared/utils/getFullName.ts";
import { Counter } from "src/ui/components/info/Counter/Counter.tsx";

export const RequestAssignedEmployees = (props: { request: IRequest }) => {
    const employees = props.request.assignedEmployees?.map((employee) =>
        store.employee.findById(employee.employeeId),
    );
    const firstEmployee = employees?.[0];

    if (!employees || !firstEmployee) {
        return <div className={styles.noEmployees}>—</div>;
    }

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
            }}
        >
            <Typo variant={"actionL"}>{getNameInitials(firstEmployee)}</Typo>
            {employees.length > 1 && (
                <Counter
                    value={employees.length}
                    mode={"neutral"}
                    maxValue={employees.length - 1}
                />
            )}
        </div>
    );
};
