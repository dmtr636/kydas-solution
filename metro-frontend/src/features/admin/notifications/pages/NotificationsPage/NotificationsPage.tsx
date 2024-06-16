import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { useNavigate } from "react-router-dom";
import { store } from "src/app/AppStore.ts";
import { numDecl } from "src/shared/utils/numDecl.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconCheckmark } from "src/ui/assets/icons";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import styles from "./NotificationsPage.module.scss";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import { INotification } from "src/features/admin/notifications/types/INotification.ts";
import { Person } from "src/ui/components/solutions/Person/Person.tsx";
import { notificationActions } from "src/features/admin/notifications/constants/notificationActions.ts";
import { getNotificationFilterChips } from "src/features/admin/notifications/utils/getFilterChips.ts";
import { NotificationFilter } from "src/features/admin/notifications/components/NotificationFilter/NotificationFilter.tsx";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { getFullName, getNameInitials } from "src/shared/utils/getFullName.ts";

export const NotificationsPage = observer(() => {
    const navigate = useNavigate();

    const getCountForFilterForm = () => {
        return store.notification.filterNotifications(store.notification.filter.filterForm).length;
    };

    const getFilterApplyButtonLabel = () => {
        const count = getCountForFilterForm();
        let label = "Применить";
        label += ` (${count} ${numDecl(count, ["уведомление", "уведомления", "уведомлений"])})`;
        return label;
    };

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

    return (
        <AdminPageContentLayout
            title={"Уведомления"}
            actions={[
                <Button
                    key={"readAll"}
                    type={"primary"}
                    iconBefore={<IconCheckmark />}
                    onClick={async () => {
                        await store.notification.readAll();
                    }}
                    loading={store.notification.loader.loading}
                    disabled={
                        !store.notification.filteredNotifications.length ||
                        store.notification.tab === "read"
                    }
                >
                    Прочитать все
                </Button>,
            ]}
        >
            <ExplorationWithStore
                inputPlaceholder={"Поиск по номеру заявки"}
                filterStore={store.notification.filter}
                enableFilter={true}
                filterContent={<NotificationFilter disableAction={true} />}
                filters={getNotificationFilterChips()}
                applyButtonLabel={getFilterApplyButtonLabel()}
            />
            <Table
                data={store.notification.filteredNotifications}
                onRowClick={(data) => {
                    navigate(`/admin/notifications/request/${data.requestId}`);
                    store.notification.updateNotification({
                        ...data,
                        isRead: true,
                    });
                }}
                columns={[
                    {
                        name: "№ Заявки",
                        width: 129,
                        render: (notification) => (
                            <Typo variant={"actionL"}>M-{notification.requestNumber}</Typo>
                        ),
                    },
                    {
                        name: "Дата",
                        width: 132,
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
                        borderRight: true,
                    },
                    {
                        name: "Действие",
                        width: 360,
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
                        width: 330,
                        render: renderAuthor,
                    },
                ]}
                tabs={
                    <Tabs
                        value={store.notification.tab}
                        onChange={(value) => (store.notification.tab = value)}
                        size={"large"}
                        tabs={[
                            {
                                name: "Опоздания",
                                value: "late",
                                counter: store.notification.filterByTab(
                                    store.notification.notifications,
                                    "late",
                                ).length,
                            },
                            {
                                name: "Нужно перенести",
                                value: "reschedule",
                                counter: store.notification.filterByTab(
                                    store.notification.notifications,
                                    "reschedule",
                                ).length,
                            },
                            {
                                name: "Отменённые",
                                value: "cancel",
                                counter: store.notification.filterByTab(
                                    store.notification.notifications,
                                    "cancel",
                                ).length,
                            },
                            {
                                name: "Прочитанные",
                                value: "read",
                            },
                        ]}
                    />
                }
                loading={store.notification.loader.loading}
                filterStore={store.notification.filter}
            />
        </AdminPageContentLayout>
    );
});
