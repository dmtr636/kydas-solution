import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconUser } from "src/ui/assets/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigateBack } from "src/shared/hooks/useNavigateBack.ts";
import { IEmployee } from "src/features/admin/employees/types/IEmployee.ts";
import { EmployeeForm } from "src/features/admin/employees/components/EmployeeForm/EmployeeForm.tsx";
import { getNameInitials } from "src/shared/utils/getFullName.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { getTimeForShift } from "src/features/admin/employees/utils/shift.ts";

export const EmployeeAddPage = observer(() => {
    const navigate = useNavigate();
    const navigateBack = useNavigateBack();

    useEffect(() => {
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, []);

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        store.employee.employeeForm = {
            phone: "",
            phonePersonal: "",
        } as IEmployee;
    }, []);

    const handleSave = async () => {
        if (store.employee.employeeForm) {
            const userResult = await store.user.createUser({
                email: store.employee.employeeForm.email ?? "",
                role: "EMPLOYEE",
                name: getNameInitials({
                    lastName: store.employee.employeeForm.lastName,
                    firstName: store.employee.employeeForm.firstName,
                    patronymic: store.employee.employeeForm.patronymic,
                }),
            });
            if (!userResult.status) {
                snackbarStore.showNegativeSnackbar("Инспектор с такой почтой уже существует");
                return;
            }
            const shift = store.employee.employeeForm.area.includes("Н") ? "2Н" : "1";
            const result = await store.employee.createEmployee({
                ...store.employee.employeeForm,
                shift: shift,
                number: (store.employee.employees.length + 1).toString().padStart(8, "0"),
                supervisor: "Воробьёв С.В.",
                userId: userResult.data.id,
                tags: [],
                schedule: [],
                timeWorkStart1: getTimeForShift(shift)?.[0] ?? null,
                timeWorkEnd1: getTimeForShift(shift)?.[1] ?? null,
                timeWorkStart2: getTimeForShift(shift)?.[0] ?? null,
                timeWorkEnd2: getTimeForShift(shift)?.[1] ?? null,
                timeWorkStart3: getTimeForShift(shift)?.[0] ?? null,
                timeWorkEnd3: getTimeForShift(shift)?.[1] ?? null,
                timeWorkStart4: getTimeForShift(shift)?.[0] ?? null,
                timeWorkEnd4: getTimeForShift(shift)?.[1] ?? null,
                timeWorkStart5: getTimeForShift(shift)?.[0] ?? null,
                timeWorkEnd5: getTimeForShift(shift)?.[1] ?? null,
                timeWorkStart6: getTimeForShift(shift)?.[0] ?? null,
                timeWorkEnd6: getTimeForShift(shift)?.[1] ?? null,
                timeWorkStart7: getTimeForShift(shift)?.[0] ?? null,
                timeWorkEnd7: getTimeForShift(shift)?.[1] ?? null,
            });
            if (result.status) {
                navigate(`/admin/employees/${result.data.id}`, { replace: true });
                store.employee.employeeForm = {} as IEmployee;
            }
        }
    };

    const getActions = () => {
        const actions = [];
        actions.push(
            <Button
                key={"save"}
                type={"primary"}
                onClick={handleSave}
                loading={store.employee.loader.loading}
                disabled={!store.employee.isFormValid}
            >
                Добавить
            </Button>,
        );
        actions.push(
            <Button
                key={"edit"}
                type={"secondary"}
                onClick={() => {
                    navigateBack({ default: "/admin/employees" });
                }}
            >
                Отмена
            </Button>,
        );
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={`Добавить инспектора`}
            actions={getActions()}
            breadCrumbs={[
                {
                    name: "Инспекторы",
                    icon: <IconUser />,
                    onClick: () => navigate("/admin/employees"),
                },
                {
                    name: `Добавить инспектора`,
                },
            ]}
        >
            <EmployeeForm type={"add"} />
        </AdminPageContentLayout>
    );
});
