import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { IconBasket, IconEdit, IconUser } from "src/ui/assets/icons";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BreadCrumb } from "src/ui/components/solutions/Breadcrumbs/BreadCrumbs.tsx";
import { EmployeeInfo } from "src/features/admin/employees/components/EmployeeInfo/EmployeeInfo.tsx";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import styles from "src/features/admin/requests/pages/RequestViewPage/RequestViewPage.module.scss";
import { DeleteOverlay } from "src/ui/components/segments/overlays/DeleteOverlay/DeleteOverlay.tsx";

export const EmployeeViewPage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const currentEmployee = store.employee.employee;
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useLayoutEffect(() => {
        if (id && currentEmployee?.id?.toString() !== id) {
            store.employee.fetchById(id);
        }
        return () => {
            store.employee.employee = null;
        };
    }, [id]);

    const getBreadcrumbs = () => {
        const breadcrumbs: BreadCrumb[] = [];
        breadcrumbs.push({
            name: "Инспекторы",
            icon: <IconUser />,
            onClick: () => navigate("/admin/employees"),
        });
        breadcrumbs.push({
            name: currentEmployee ? getFullName(currentEmployee) : "...",
        });
        return breadcrumbs;
    };

    const getActions = () => {
        const actions = [];
        if (!currentEmployee) {
            actions.push(<Skeleton height={44} key={"skeleton"} width={608} />);
        } else {
            if (editMode) {
                actions.push(
                    <Button
                        key={"save"}
                        onClick={() => {
                            setEditMode(false);
                            store.employee.updateEmployee({
                                ...currentEmployee,
                                ...store.employee.editingEmployee,
                                lockedEdit: null,
                            });
                        }}
                        loading={store.employee.loader.loading}
                    >
                        Сохранить изменения
                    </Button>,
                    <Button
                        key={"cancel"}
                        type={"secondary"}
                        onClick={() => {
                            setEditMode(false);
                            store.employee.updateEmployeeWithoutLoader(
                                {
                                    ...currentEmployee,
                                    lockedEdit: null,
                                },
                                false,
                            );
                        }}
                    >
                        Отменить редактирование
                    </Button>,
                );
            } else {
                if (
                    ["ROOT", "ADMIN", "SPECIALIST"].includes(store.account.currentUser?.role ?? "")
                ) {
                    actions.push(
                        <Button
                            key={"edit"}
                            type={"secondary"}
                            iconBefore={<IconEdit />}
                            onClick={() => {
                                navigate(`/admin/employees/${id}/edit`);
                                store.employee.updateEmployeeWithoutLoader(
                                    {
                                        ...currentEmployee,
                                        lockedEdit: true,
                                    },
                                    false,
                                );
                            }}
                            disabled={currentEmployee.lockedEdit === true}
                        >
                            Редактировать основную информацию
                        </Button>,
                    );
                }
                actions.push(
                    <Button
                        key={"edit"}
                        type={"secondary"}
                        iconBefore={<IconEdit />}
                        onClick={() => {
                            setEditMode(true);
                            store.employee.tab = "schedule";
                            store.employee.editingEmployee = { ...currentEmployee };
                            store.employee.updateEmployeeWithoutLoader(
                                {
                                    ...currentEmployee,
                                    lockedEdit: true,
                                },
                                false,
                            );
                        }}
                        disabled={currentEmployee.lockedEdit === true}
                    >
                        Редактировать график
                    </Button>,
                );
            }
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
                        disabled={currentEmployee.lockedEdit === true}
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
            title={currentEmployee ? getFullName(currentEmployee) : "Инспектор"}
            breadCrumbs={getBreadcrumbs()}
            actions={getActions()}
        >
            <EmployeeInfo editMode={editMode} />
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
