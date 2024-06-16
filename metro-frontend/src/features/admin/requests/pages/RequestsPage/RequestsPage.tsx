import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconPlus } from "src/ui/assets/icons";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { requestTabs } from "src/features/admin/requests/constants/requestTabs.ts";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { TripRoute } from "src/features/admin/requests/components/TripRoute/TripRoute.tsx";
import { RequestFilter } from "src/features/admin/requests/components/RequestFilter/RequestFilter.tsx";
import { numDecl } from "src/shared/utils/numDecl.ts";
import styles from "./RequestsPage.module.scss";
import { getFilterChips } from "src/features/admin/requests/utils/getFilterChips.ts";
import { useNavigate } from "react-router-dom";
import { RequestStatus } from "src/features/admin/requests/components/RequestStatus/RequestStatus.tsx";
import { RequestAssignedEmployees } from "src/features/admin/requests/components/RequestAssignedEmployees/RequestAssignedEmployees.tsx";
import dayjs from "dayjs";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { useEffect, useRef } from "react";

export const RequestsPage = observer(() => {
    const navigate = useNavigate();
    const oldSortRef = useRef("");

    const getCountForFilterForm = () => {
        return store.request.filterRequests(store.request.filter.filterForm).length;
    };

    const getFilterApplyButtonLabel = () => {
        const count = getCountForFilterForm();
        let label = "Применить";
        label += ` (${count} ${numDecl(count, ["заявка", "заявки", "заявок"])})`;
        return label;
    };

    useEffect(() => {
        store.request.fetchAll();
    }, [store.request.date, store.request.filter.search]);

    useEffect(() => {
        if (store.request.filter.search) {
            store.request.tab = "all";
            if (!oldSortRef.current) {
                oldSortRef.current = store.request.filter.sort ?? "";
            }
            store.request.filter.sort = "number-asc";
        } else {
            if (oldSortRef.current) {
                store.request.filter.sort = oldSortRef.current;
            }
        }
    }, [store.request.filter.search]);

    return (
        <AdminPageContentLayout
            title={"Заявки"}
            actions={[
                <Button
                    key={"add"}
                    type={"primary"}
                    iconBefore={<IconPlus />}
                    onClick={() => {
                        navigate("/admin/requests/add");
                    }}
                >
                    Создать новую заявку
                </Button>,
            ]}
        >
            <ExplorationWithStore
                inputPlaceholder={"Поиск по номеру заявки"}
                filterStore={store.request.filter}
                enableFilter={true}
                filterContent={<RequestFilter />}
                filters={getFilterChips()}
                applyButtonLabel={getFilterApplyButtonLabel()}
            />
            <Table
                data={store.request.filteredRequests}
                onRowClick={(data) => navigate(`/admin/requests/${data.id}`)}
                headerFilters={
                    store.request.tab !== "new" && (
                        <>
                            <Tabs
                                type={"secondary"}
                                size={"large"}
                                tabs={[
                                    {
                                        name: `Сегодня, ${dayjs().toDate().toLocaleDateString([], {
                                            day: "numeric",
                                            month: "long",
                                        })}`,
                                        value: dayjs().toDate().toLocaleDateString(),
                                    },
                                    {
                                        name: `Завтра, ${dayjs()
                                            .add(1, "day")
                                            .toDate()
                                            .toLocaleDateString([], {
                                                day: "numeric",
                                                month: "long",
                                            })}`,
                                        value: dayjs().add(1, "day").toDate().toLocaleDateString(),
                                    },
                                ]}
                                value={store.request.date}
                                onChange={(value) => (store.request.date = value)}
                            />
                            <DatePicker
                                size={"large"}
                                value={dayjs(store.request.date, "DD.MM.YYYY").toISOString()}
                                onChange={(date) => {
                                    if (date) {
                                        store.request.date = new Date(date).toLocaleDateString();
                                    } else {
                                        store.request.date = new Date().toLocaleDateString();
                                    }
                                }}
                                disableTime={true}
                                disableClear={true}
                            />
                        </>
                    )
                }
                columns={[
                    {
                        name: "№ Заявки",
                        width: 153,
                        render: (request) => <Typo variant={"actionL"}>M-{request.number}</Typo>,
                        sortField: "number",
                    },
                    {
                        name: "Дата",
                        width: 104,
                        render: (request) => (
                            <div className={styles.dateField}>
                                <Typo variant={"actionL"}>{formatDate(request.info.tripDate)}</Typo>
                                <Typo variant={"actionL"} className={styles.time}>
                                    {formatTime(request.info.tripDate)}
                                </Typo>
                            </div>
                        ),
                        sortField: "tripDate",
                    },
                    {
                        name: "Статус",
                        width: 213,
                        render: (request) => <RequestStatus request={request} />,
                        sortField: "status",
                    },
                    {
                        name: "Назначенные инспекторы",
                        width: 226,
                        render: (request) => <RequestAssignedEmployees request={request} />,
                    },
                    {
                        name: "Маршрут",
                        width: 242,
                        render: (request) => (
                            <TripRoute
                                arrivalStationId={request.info.arrivalStationId}
                                departureStationId={request.info.departureStationId}
                            />
                        ),
                    },
                ]}
                tabs={
                    <Tabs<keyof typeof requestTabs>
                        value={store.request.tab}
                        onChange={(value) => store.request.setTab(value)}
                        size={"large"}
                        tabs={[
                            { name: "Все", value: "all" },
                            {
                                name: "Не подтверждена",
                                value: "new",
                                counter: store.request
                                    .filterRequests(store.request.filter.filterValues, false, false)
                                    .filter((request) => request.status === "NEW").length,
                            },
                            { name: "Принята", value: "confirmed" },
                            {
                                name: "Лист ожидания",
                                value: "waitingList",
                                counter: store.request
                                    .filterRequests(store.request.filter.filterValues, false, true)
                                    .filter((request) => request.status === "WAITING_LIST").length,
                            },
                            { name: "Архив", value: "archive" },
                        ]}
                    />
                }
                loading={store.request.loader.loading}
                filterStore={store.request.filter}
            />
        </AdminPageContentLayout>
    );
});
