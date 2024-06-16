import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { useNavigate } from "react-router-dom";
import { store } from "src/app/AppStore.ts";
import { numDecl } from "src/shared/utils/numDecl.ts";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import styles from "./EventsPage.module.scss";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import { INotification } from "src/features/admin/notifications/types/INotification.ts";
import { Person } from "src/ui/components/solutions/Person/Person.tsx";
import { notificationActions } from "src/features/admin/notifications/constants/notificationActions.ts";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { getNameInitials } from "src/shared/utils/getFullName.ts";
import { TableColumn } from "src/ui/components/segments/Table/Table.types.ts";
import { IEvent } from "src/features/admin/events/types/IEvent.ts";
import { EventFilter } from "src/features/admin/events/components/EventFilter/EventFilter.tsx";
import { getEventFilterChips } from "src/features/admin/events/utils/getFilterChips.ts";
import { NotificationFilter } from "src/features/admin/notifications/components/NotificationFilter/NotificationFilter.tsx";
import { getNotificationFilterChips } from "src/features/admin/notifications/utils/getFilterChips.ts";
import {
    eventsLocaleActions,
    eventsLocalePages,
    eventsPagesLinks,
} from "src/features/admin/events/utils/eventsLocale.ts";

export const EventsPage = observer(() => {
    const navigate = useNavigate();
    const tab = store.event.tab;

    const getCountForFilterForm = () => {
        return tab === "requests"
            ? store.notification.filterNotifications(store.notification.filter.filterForm, false)
                  .length
            : store.event.filterEvents(store.event.filter.filterForm).length;
    };

    const getFilterApplyButtonLabel = () => {
        const count = getCountForFilterForm();
        let label = "Применить";
        label += ` (${count} ${numDecl(count, ["событие", "события", "событий"])})`;
        return label;
    };

    const renderAuthor = (event: IEvent) => {
        if (event.userId) {
            const user = store.user.getById(event.userId);
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

    const getColumns = () => {
        if (tab === "requests") {
            return [
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
                            <Typo variant={"actionL"}>{formatDate(notification.createDate)}</Typo>
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
            ] as TableColumn<INotification>[];
        } else {
            return [
                {
                    name: "Страница",
                    width: 170,
                    render: (event) => (
                        <Typo variant={"actionL"}>
                            {eventsLocalePages[event.objectName as keyof typeof eventsLocalePages]}
                        </Typo>
                    ),
                },
                {
                    name: "Дата",
                    width: 132,
                    render: (event) => (
                        <div className={styles.dateField}>
                            <Typo variant={"actionL"}>{formatDate(event.createDate)}</Typo>
                            <Typo variant={"actionL"} className={styles.time}>
                                {formatTime(event.createDate)}
                            </Typo>
                        </div>
                    ),
                    sortField: "createDate",
                    borderRight: true,
                },
                {
                    name: "Действие",
                    width: 320,
                    render: (event) => (
                        <Typo variant={"bodyL"} className={styles.action}>
                            {eventsLocaleActions[event.action as keyof typeof eventsLocaleActions]}
                        </Typo>
                    ),
                    borderRight: true,
                },
                {
                    name: "Автор",
                    width: 320,
                    render: renderAuthor,
                },
            ] as TableColumn<IEvent>[];
        }
    };

    return (
        <AdminPageContentLayout title={"Журнал событий"}>
            {tab === "requests" ? (
                <ExplorationWithStore
                    inputPlaceholder={"Поиск по номеру заявки"}
                    filterStore={store.notification.filter}
                    enableFilter={true}
                    filterContent={<NotificationFilter />}
                    filters={getNotificationFilterChips()}
                    applyButtonLabel={getFilterApplyButtonLabel()}
                />
            ) : (
                <ExplorationWithStore
                    inputPlaceholder={"Поиск по автору"}
                    filterStore={store.event.filter}
                    enableFilter={true}
                    filterContent={<EventFilter />}
                    filters={getEventFilterChips()}
                    applyButtonLabel={getFilterApplyButtonLabel()}
                />
            )}

            <Table
                data={
                    tab === "requests"
                        ? store.notification.getFilteredNotificationsForEvents()
                        : (store.event.filteredEvents as any)
                }
                onRowClick={(data: any) => {
                    if (tab === "requests") {
                        navigate(`/admin/requests/${data.requestId}`);
                    } else {
                        if (data.objectId) {
                            navigate(
                                `/admin/${eventsPagesLinks[data.objectName as keyof typeof eventsPagesLinks]}/${data.objectId}`,
                            );
                        } else {
                            navigate(
                                `/admin/${eventsPagesLinks[data.objectName as keyof typeof eventsPagesLinks]}`,
                            );
                        }
                    }
                }}
                columns={getColumns() as any}
                tabs={
                    <Tabs
                        value={tab}
                        onChange={(value) => (store.event.tab = value)}
                        size={"large"}
                        tabs={[
                            {
                                name: "Заявки",
                                value: "requests",
                            },
                            {
                                name: "Управление",
                                value: "system",
                            },
                        ]}
                    />
                }
                loading={store.notification.loader.loading || store.event.loader.loading}
                filterStore={tab === "requests" ? store.notification.filter : store.event.filter}
                onePageHeader
            />
        </AdminPageContentLayout>
    );
});
