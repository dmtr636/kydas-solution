import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import styles from "./DistributionAssignedEmployees.module.scss";
import { getNameInitials } from "src/shared/utils/getFullName.ts";
import { Counter } from "src/ui/components/info/Counter/Counter.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { IconEdit } from "src/ui/assets/icons";

export const DistributionAssignedEmployees = (props: { request: IRequest }) => {
    const employees = props.request.assignedEmployees?.map((employee) =>
        store.employee.findById(employee.employeeId),
    );

    const requiredCount =
        (props.request.inspectorMaleCount ?? 0) + (props.request.inspectorFemaleCount ?? 0);

    if (!employees?.length) {
        return (
            <div
                className={styles.container}
                style={{ color: "var(--color-components-text-negative)" }}
            >
                <ButtonIcon size={"small"} type={"secondary"} mode={"negative"}>
                    <IconEdit />
                </ButtonIcon>
                <div className={styles.column}>
                    <div className={styles.row}>
                        <Typo variant={"actionL"}>Требуются инспекторы</Typo>
                        <Counter
                            value={
                                (props.request.inspectorMaleCount ?? 0) +
                                (props.request.inspectorFemaleCount ?? 0)
                            }
                            mode={"negative"}
                        />
                    </div>
                </div>
            </div>
        );
    }

    const requiredMoreEmployees = employees.length < requiredCount;

    return (
        <div className={styles.container}>
            <ButtonIcon size={"small"} type={"secondary"}>
                <IconEdit />
            </ButtonIcon>
            <div className={styles.column}>
                {!requiredMoreEmployees &&
                    employees.slice(0, 3).map((e, index) => (
                        <div className={styles.row} key={e?.id}>
                            <Typo variant={"actionL"}>{getNameInitials(e)}</Typo>
                            {employees.length > 3 && index === 2 && (
                                <Counter
                                    value={employees.length - 3}
                                    mode={"neutral"}
                                    showPlus={true}
                                />
                            )}
                        </div>
                    ))}

                {requiredMoreEmployees &&
                    employees.slice(0, 2).map((e, index) => (
                        <div className={styles.row} key={e?.id}>
                            <Typo variant={"actionL"}>{getNameInitials(e)}</Typo>
                            {employees.length > 2 && index === 1 && (
                                <Counter
                                    value={employees.length - 2}
                                    mode={"neutral"}
                                    showPlus={true}
                                />
                            )}
                        </div>
                    ))}

                {requiredMoreEmployees && (
                    <div
                        className={styles.row}
                        style={{ color: "var(--color-components-text-negative)" }}
                    >
                        <Typo variant={"actionL"}>Требуются инспекторы</Typo>
                        <Counter value={requiredCount - employees.length} mode={"negative"} />
                    </div>
                )}
            </div>
        </div>
    );
};
