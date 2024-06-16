import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import styles from "./RequestHistoryPage.module.scss";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { INotification } from "src/features/admin/notifications/types/INotification.ts";
import { Person } from "src/ui/components/solutions/Person/Person.tsx";
import { notificationActions } from "src/features/admin/notifications/constants/notificationActions.ts";
import { useEffect, useMemo, useState } from "react";
import { IconBack, IconDocument, IconEdit, IconError, IconNotification } from "src/ui/assets/icons";
import { BreadCrumb } from "src/ui/components/solutions/Breadcrumbs/BreadCrumbs.tsx";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { getFullName, getNameInitials } from "src/shared/utils/getFullName.ts";

export const RequestHistoryPage = observer((props?: { fromNotifications?: boolean }) => {
    const navigate = useNavigate();
    const params = useParams<{ id: string }>();
    const [showCancelReasonOverlay, setShowCancelReasonOverlay] = useState(false);
    const [cancelReasonEditMode, setCancelReasonEditMode] = useState(false);

    const request = store.request.request;

    useEffect(() => {
        if (!request && params.id) {
            store.request.fetchById(params.id);
        }
        if (request) {
            store.request.requestForm = JSON.parse(JSON.stringify(request));
        }
        return () => {
            store.request.requestForm = null;
        };
    }, [request]);

    const renderAuthor = (notification: INotification) => {
        if (notification.userId) {
            const user = store.user.getById(notification.userId);
            if (user) {
                const employee = store.employee.findByUserId(user.id);
                if (employee) {
                    return <Person fullName={getNameInitials(employee)} />;
                } else {
                    return <Person fullName={user.name ?? user.email.split("@")[0]} />;
                }
            }
        }
        return (
            <Typo variant={"actionL"} className={styles.action}>
                Пассажир
            </Typo>
        );
    };

    const getActions = () => {
        const actions = [];
        actions.push(
            <Button
                key={"goToRequest"}
                type={"secondary"}
                iconBefore={!props?.fromNotifications && <IconBack />}
                onClick={() => {
                    if (props?.fromNotifications) {
                        navigate(`/admin/notifications/request/${request?.id}`);
                    } else {
                        navigate(`/admin/requests/${request?.id}`);
                    }
                }}
            >
                {props?.fromNotifications ? `Перейти к заявке` : `К заявке`}
            </Button>,
        );
        if (request?.status === "CANCELED") {
            actions.push(
                <Button
                    key={"cancelReason"}
                    type={"outlined"}
                    iconBefore={<IconError />}
                    onClick={() => {
                        setShowCancelReasonOverlay(true);
                    }}
                >
                    Причина отмены
                </Button>,
            );
        }
        return actions;
    };

    const getBreadcrumbs = () => {
        const breadcrumbs: BreadCrumb[] = [];
        if (props?.fromNotifications) {
            breadcrumbs.push({
                name: "Уведомления",
                icon: <IconNotification />,
                onClick: () => navigate("/admin/notifications"),
            });
        } else {
            breadcrumbs.push({
                name: "Заявки",
                icon: <IconDocument />,
                onClick: () => navigate("/admin/requests"),
            });
        }
        breadcrumbs.push({
            name: `Заявка M-${request?.number ?? ".."}`,
            onClick: () => navigate(`/admin/request/${request?.id}`),
        });
        breadcrumbs.push({
            name: "История заявки",
        });
        return breadcrumbs;
    };

    const getCancelReasonOverlayActions = () => {
        const actions = [];
        if (!cancelReasonEditMode) {
            actions.push(
                <Button
                    key={"edit"}
                    iconBefore={<IconEdit />}
                    onClick={() => {
                        setCancelReasonEditMode(true);
                    }}
                >
                    Редактировать
                </Button>,
            );
        } else {
            actions.push(
                <Button
                    key={"edit"}
                    onClick={async () => {
                        if (store.request.requestForm) {
                            await store.request.updateRequest(store.request.requestForm);
                        }
                        setShowCancelReasonOverlay(false);
                        setCancelReasonEditMode(false);
                    }}
                    loading={store.request.loader.loading}
                >
                    Сохранить
                </Button>,
            );
        }
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={`История заявки M-${request?.number ?? ".."}`}
            actions={getActions()}
            breadCrumbs={getBreadcrumbs()}
        >
            <Table
                data={store.notification.getNotificationsByRequestId(request?.id ?? "")}
                columns={[
                    {
                        name: "Дата",
                        width: 142,
                        render: (notification) => (
                            <div className={styles.dateField}>
                                <Typo variant={"actionL"}>
                                    {formatDate(notification.createDate)}
                                </Typo>
                                <Typo variant={"actionL"} className={styles.time}>
                                    {formatTime(notification.createDate)}
                                </Typo>
                            </div>
                        ),
                        sortField: "createDate",
                    },
                    {
                        name: "Действие",
                        width: 440,
                        render: (notification) => (
                            <Typo variant={"bodyL"} className={styles.action}>
                                {notificationActions[notification.action]}{" "}
                                {notification.action === "CHANGE_STATUS"
                                    ? `«${requestStatuses[notification.status]}»`
                                    : ""}
                            </Typo>
                        ),
                        borderRight: true,
                    },
                    {
                        name: "Автор",
                        width: 241,
                        render: renderAuthor,
                    },
                ]}
                loading={store.notification.loader.loading}
                filterStore={store.notification.filter}
                tableHeaderBorderRadius={true}
            />
            <Overlay
                open={showCancelReasonOverlay}
                onClose={() => {
                    setShowCancelReasonOverlay(false);
                }}
                title={"Причина отмены заявки"}
                actions={getCancelReasonOverlayActions()}
            >
                <div style={{ width: 360 }}>
                    <TextArea
                        height={230}
                        value={store.request.requestForm?.cancelReason}
                        onChange={(event) => {
                            store.request.requestForm &&
                                (store.request.requestForm.cancelReason = event.target.value);
                        }}
                        size={"large"}
                        placeholder={
                            !cancelReasonEditMode
                                ? "Причина не указана"
                                : "Опишите причину отмены заявки в свободной форме"
                        }
                        readonly={!cancelReasonEditMode}
                    />
                </div>
            </Overlay>
        </AdminPageContentLayout>
    );
});
