import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconBasket, IconUser } from "src/ui/assets/icons";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EmployeeEditPage.module.scss";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { DeleteOverlay } from "src/ui/components/segments/overlays/DeleteOverlay/DeleteOverlay.tsx";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { EmployeeForm } from "src/features/admin/employees/components/EmployeeForm/EmployeeForm.tsx";

export const EmployeeEditPage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const navigate = useNavigate();
    const currentEmployee = store.employee.employee;

    useEffect(() => {
        return () => {
            if (store.employee.employee && store.employee.employee.lockedEdit) {
                store.employee.updateEmployeeWithoutLoader(
                    {
                        ...store.employee.employee,
                        lockedEdit: null,
                    },
                    false,
                );
            }
        };
    }, []);

    useEffect(() => {
        if (store.employee.employee) {
            store.employee.updateEmployeeWithoutLoader(
                {
                    ...store.employee.employee,
                    lockedEdit: true,
                },
                false,
            );
        }
    }, [!!store.employee.employee]);

    useEffect(() => {
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("unload", onUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("unload", onUnload);
        };
    }, [JSON.stringify(currentEmployee), JSON.stringify(store.employee.employeeForm)]);

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (JSON.stringify(currentEmployee) !== JSON.stringify(store.employee.employeeForm)) {
            e.preventDefault();
        }
        return false;
    };

    const onUnload = () => {
        if (store.employee.employee) {
            store.employee.updateEmployeeWithoutLoader(
                {
                    ...store.employee.employee,
                    lockedEdit: null,
                },
                false,
            );
        }
    };

    useLayoutEffect(() => {
        if (id && currentEmployee?.id.toString() !== id) {
            store.employee.clearEmployee();
            store.employee.fetchById(id);
        }
        return () => {
            store.employee.employeeForm = null;
        };
    }, [id]);

    useLayoutEffect(() => {
        store.employee.employeeForm = JSON.parse(JSON.stringify(currentEmployee));
        if (
            store.employee.employee &&
            store.employee.employeeForm &&
            store.user.getById(store.employee.employeeForm.userId)?.email
        ) {
            store.employee.employee.email =
                store.user.getById(store.employee.employeeForm.userId)?.email ?? "";
            store.employee.employeeForm.email =
                store.user.getById(store.employee.employeeForm.userId)?.email ?? "";
        }
    }, [currentEmployee]);

    const handleSave = async () => {
        if (store.employee.employeeForm) {
            const result = await store.employee.updateEmployee({
                ...store.employee.employeeForm,
            });
            await store.employee.updateEmployeeWithoutLoader(
                {
                    ...store.employee.employeeForm,
                    lockedEdit: null,
                },
                false,
            );
            if (currentEmployee) {
                currentEmployee.lockedEdit = null;
            }
            if (result.status) {
                navigate(`/admin/employees/${id}`, { replace: true });
            }
        }
    };

    const getActions = () => {
        const actions = [];
        if (!currentEmployee) {
            actions.push(<Skeleton height={44} key={"skeleton"} width={608} />);
        } else {
            actions.push(
                <Button
                    key={"save"}
                    type={"primary"}
                    onClick={handleSave}
                    loading={store.employee.loader.loading}
                    disabled={
                        !store.employee.isFormValid ||
                        JSON.stringify(currentEmployee) ===
                            JSON.stringify(store.employee.employeeForm)
                    }
                >
                    Сохранить изменения
                </Button>,
            );
            actions.push(
                <Button
                    key={"edit"}
                    type={"secondary"}
                    onClick={() => {
                        navigate(`/admin/employees/${id}`, { replace: true });
                        store.employee.updateEmployeeWithoutLoader(
                            {
                                ...currentEmployee,
                                lockedEdit: null,
                            },
                            false,
                        );
                        if (currentEmployee) {
                            currentEmployee.lockedEdit = null;
                        }
                    }}
                >
                    Отменить редактирование
                </Button>,
            );
            if (["ROOT", "ADMIN"].includes(store.account.currentUser?.role ?? "")) {
                actions.push(
                    <Button
                        key={"delete"}
                        type={"secondary"}
                        mode={"negative"}
                        iconBefore={<IconBasket />}
                        className={styles.deleteRequestButton}
                        onClick={() => {
                            setShowDeleteOverlay(true);
                        }}
                    >
                        Удалить инспектора
                    </Button>,
                );
            }
        }
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={getFullName(currentEmployee)}
            actions={getActions()}
            breadCrumbs={[
                {
                    name: "Инспекторы",
                    icon: <IconUser />,
                    onClick: () => navigate("/admin/employees"),
                },
                {
                    name: `${getFullName(currentEmployee) ?? ""}`,
                },
            ]}
        >
            <EmployeeForm type={"edit"} />
            <DeleteOverlay
                open={showDeleteOverlay}
                title={"Удаление инспектора"}
                subtitle={"Будет удален следующий инспектор"}
                info={getFullName(currentEmployee)}
                deleteButtonLabel={"Подтвердить удаление"}
                onDelete={() =>
                    currentEmployee &&
                    store.employee.deleteEmployee(currentEmployee, () =>
                        navigate("/admin/employees"),
                    )
                }
                onCancel={() => setShowDeleteOverlay(false)}
                loading={store.employee.loader.loading}
            />
        </AdminPageContentLayout>
    );
});
