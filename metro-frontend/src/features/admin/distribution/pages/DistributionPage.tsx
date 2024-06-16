import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { store } from "src/app/AppStore.ts";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import dayjs from "dayjs";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import styles from "./DistributionPage.module.scss";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { TripRoute } from "src/features/admin/requests/components/TripRoute/TripRoute.tsx";
import { useEffect, useState } from "react";
import { numDecl } from "src/shared/utils/numDecl.ts";
import { Switch } from "src/ui/components/controls/Switch/Switch.tsx";
import { Link } from "src/ui/components/controls/Link/Link.tsx";
import { DistributionAssignedEmployees } from "src/features/admin/distribution/components/DistributionAssignedEmployees/DistributionAssignedEmployees.tsx";
import { DistributionRequestFilter } from "src/features/admin/distribution/components/DistributionRequestFilter/DistributionRequestFilter.tsx";
import { getDistributionFilterChips } from "src/features/admin/distribution/utils/getFilterChips.ts";
import { Gant } from "src/features/admin/analytics/gant/Gant.tsx";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import {
    IconBasket,
    IconCheckmark,
    IconMan,
    IconPlus,
    IconTime,
    IconWoman,
} from "src/ui/assets/icons";
import { Person } from "src/ui/components/solutions/Person/Person.tsx";
import { intRange } from "src/ui/utils/intRange.ts";
import { getNameInitials } from "src/shared/utils/getFullName.ts";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { DISTRIBUTION_ENDPOINT } from "src/shared/api/endpoints.ts";

export const DistributionPage = observer(() => {
    const [graphicMode, setGraphicMode] = useState(false);
    const [showDistributionOverlay, setShowDistributionOverlay] = useState(false);
    const [currentRequest, setCurrentRequest] = useState<IRequest | null>(null);
    const [rescheduleDisabled, setRescheduleDisabled] = useState(false);
    const [oldCurrentRequest, setOldCurrentRequest] = useState<IRequest | null>(null);

    const getCountForFilterForm = () => {
        return store.distribution.filterRequests(
            store.request.requests,
            store.distribution.filter.filterForm,
        ).length;
    };

    const getFilterApplyButtonLabel = () => {
        const count = getCountForFilterForm();
        let label = "Применить";
        label += ` (${count} ${numDecl(count, ["заявка", "заявки", "заявок"])})`;
        return label;
    };

    useEffect(() => {
        store.request.setTab("all");
        store.request.fetchAll();
        store.employee.fetchAllEmployees();
    }, [store.request.date]);

    const getActions = () => {
        const actions = [];
        if (store.request.date === new Date().toLocaleDateString()) {
            actions.push(
                <Button
                    key={"adaptive"}
                    type={"primary"}
                    onClick={async () => {
                        await store.distribution.adaptiveDistribution();
                    }}
                    loading={store.distribution.loader.loading}
                >
                    Адаптивное распределение
                </Button>,
            );
        } else {
            actions.push(
                <Button
                    key={"adaptive"}
                    type={"primary"}
                    onClick={() => {
                        store.distribution.plannedDistribution(store.request.date);
                    }}
                    loading={store.distribution.loader.loading}
                >
                    Плановое распределение
                </Button>,
            );
        }
        actions.push(
            <div style={{ marginLeft: "auto" }}>
                <Switch
                    checked={graphicMode}
                    onChange={setGraphicMode}
                    title={"Графический режим"}
                    placeText={"left"}
                />
            </div>,
        );
        return actions;
    };

    return (
        <AdminPageContentLayout title={"Распределение"} actions={getActions()}>
            <ExplorationWithStore
                inputPlaceholder={
                    graphicMode ? "Поиск по ФИО сотрудника" : "Поиск по номеру заявки"
                }
                filterStore={store.distribution.filter}
                enableFilter={!graphicMode}
                filterContent={<DistributionRequestFilter />}
                filters={getDistributionFilterChips()}
                applyButtonLabel={getFilterApplyButtonLabel()}
            />
            {graphicMode ? (
                <Gant />
            ) : (
                <Table
                    data={store.distribution.filteredRequests}
                    onRowClick={(data) => {
                        setCurrentRequest(JSON.parse(JSON.stringify(data)));
                        setOldCurrentRequest(JSON.parse(JSON.stringify(data)));
                        setShowDistributionOverlay(true);
                        setRescheduleDisabled(false);
                    }}
                    rowHeight={110}
                    headerFilters={
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
                    }
                    columns={[
                        {
                            name: "№ Заявки",
                            width: 133,
                            render: (request) => (
                                <Link
                                    size={"large"}
                                    href={`/admin/requests/${request.id}`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                    firstLine={`M-${request.number}`}
                                    disableVisited
                                />
                            ),
                        },
                        {
                            name: "Дата",
                            width: 148,
                            render: (request) => (
                                <div className={styles.dateField}>
                                    {store.notification.rescheduleNotifications.some(
                                        (n) => n.requestId === request.id,
                                    ) && (
                                        <Typo
                                            variant={"subheadL"}
                                            style={{
                                                color: "var(--color-components-text-negative)",
                                                marginBottom: 4,
                                            }}
                                        >
                                            Перенести!
                                        </Typo>
                                    )}
                                    <Typo variant={"actionL"}>
                                        {formatDate(request.info.tripDate)}
                                    </Typo>
                                    <Typo variant={"actionL"} className={styles.time}>
                                        {formatTime(request.info.tripDate)} —{" "}
                                        {formatTime(request.info.tripDateEnd)}
                                    </Typo>
                                </div>
                            ),
                            sortField: "tripDate",
                            borderRight: true,
                        },
                        {
                            name: "Назначенные инспекторы",
                            width: 321,
                            render: (request) => (
                                <DistributionAssignedEmployees request={request} />
                            ),
                        },
                        {
                            name: "Маршрут",
                            width: 342,
                            render: (request) => (
                                <TripRoute
                                    arrivalStationId={request.info.arrivalStationId}
                                    departureStationId={request.info.departureStationId}
                                />
                            ),
                        },
                    ]}
                    tabs={
                        <Tabs
                            value={store.distribution.tab}
                            onChange={(value) => (store.distribution.tab = value)}
                            size={"large"}
                            tabs={[
                                { name: "Назначены", value: "assigned" },
                                {
                                    name: "Не назначены",
                                    value: "notAssigned",
                                    counter: store.distribution.filterByTab("notAssigned").length,
                                },
                                {
                                    name: "Нужно перенести",
                                    value: "reschedule",
                                    counter: store.distribution.filterByTab("reschedule").length,
                                },
                            ]}
                        />
                    }
                    loading={store.request.loader.loading}
                    filterStore={store.distribution.filter}
                />
            )}

            <Overlay
                open={showDistributionOverlay}
                title={"Назначенные инспекторы"}
                actions={[
                    <div
                        key={"actions"}
                        style={{ width: 469, display: "grid", gap: 12, marginTop: -24 }}
                    >
                        <Button
                            iconBefore={<IconPlus />}
                            fullWidth={true}
                            disabled={
                                (currentRequest?.inspectorMaleCount ?? 0) +
                                    (currentRequest?.inspectorFemaleCount ?? 0) ===
                                    (currentRequest?.assignedEmployees?.length ?? 0) ||
                                store.notification.rescheduleNotifications.some(
                                    (n) => n.requestId === currentRequest?.id,
                                )
                            }
                            onClick={() => {
                                if (store.distribution.tab === "assigned") {
                                    if (oldCurrentRequest?.assignedEmployees && currentRequest) {
                                        currentRequest.assignedEmployees =
                                            oldCurrentRequest.assignedEmployees;
                                        setCurrentRequest({ ...currentRequest });
                                        store.request.updateRequestWithoutLoader(
                                            currentRequest,
                                            false,
                                        );
                                        snackbarStore.showPositiveSnackbar(
                                            "Инспекторы назначены автоматически",
                                        );
                                    }
                                }
                                if (store.distribution.tab === "notAssigned") {
                                    snackbarStore.showNegativeSnackbar(
                                        "Все сотрудники заняты. Необходим перенос",
                                    );
                                }
                            }}
                        >
                            Подобрать автоматически
                        </Button>
                        <Button
                            type={"outlined"}
                            iconBefore={<IconTime />}
                            fullWidth={true}
                            disabled={
                                (currentRequest?.inspectorMaleCount ?? 0) +
                                    (currentRequest?.inspectorFemaleCount ?? 0) ===
                                    (currentRequest?.assignedEmployees?.length ?? 0) ||
                                store.notification.rescheduleNotifications.some(
                                    (n) => n.requestId === currentRequest?.id,
                                )
                            }
                            onClick={() => {
                                setRescheduleDisabled(true);
                                store.notification.createNotification({
                                    requestId: currentRequest?.id,
                                    requestNumber: currentRequest?.number,
                                    action: "RESCHEDULE",
                                    status: "WAITING_LIST",
                                    convoyStatus: currentRequest?.convoyStatus,
                                    userId: store.account.currentUser?.id,
                                });
                                snackbarStore.showPositiveSnackbar(
                                    "Отправлено уведомление о необходимости переноса",
                                );
                            }}
                        >
                            Перенести заявку
                        </Button>
                    </div>,
                ]}
                mode={"accent"}
                onClose={() => {
                    setShowDistributionOverlay(false);
                    setCurrentRequest(null);
                }}
            >
                <div>
                    <div className={styles.rowFirst}>
                        <Typo variant={"subheadL"}>Требуются для сопровождения заявки</Typo>
                        <Link
                            size={"large"}
                            href={`/admin/requests/${currentRequest?.id}`}
                            firstLine={`M-${currentRequest?.number}`}
                            disableVisited
                        />
                    </div>
                    <div className={styles.rowCounts}>
                        {!!currentRequest?.inspectorMaleCount && (
                            <Person
                                fullName={"Мужчина"}
                                icon={<IconMan />}
                                additionalText={
                                    <span
                                        style={{
                                            color: "var(--color-components-text-neutral-tertiary)",
                                        }}
                                    >
                                        {" "}
                                        ({currentRequest?.inspectorMaleCount})
                                    </span>
                                }
                            />
                        )}
                        {!!currentRequest?.inspectorFemaleCount && (
                            <Person
                                fullName={"Женщина"}
                                icon={<IconWoman />}
                                additionalText={
                                    <span
                                        style={{
                                            color: "var(--color-components-text-neutral-tertiary)",
                                        }}
                                    >
                                        {" "}
                                        ({currentRequest?.inspectorFemaleCount})
                                    </span>
                                }
                            />
                        )}
                    </div>
                    <div style={{ marginTop: 24, marginBottom: 16 }}>
                        <Typo variant={"subheadL"}>Сформированная команда</Typo>
                    </div>
                    <div className={styles.inspectorsCard}>
                        <div className={styles.inspectorsList}>
                            {currentRequest?.assignedEmployees?.map((ae) => (
                                <>
                                    <div className={styles.inspectorsListItem} key={ae.employeeId}>
                                        <Person
                                            fullName={getNameInitials(
                                                store.employee.findById(ae.employeeId),
                                            )}
                                            iconAfter={
                                                <div className={styles.iconCheckmark}>
                                                    <IconCheckmark />
                                                </div>
                                            }
                                            onDelete={() => {
                                                if (currentRequest?.assignedEmployees) {
                                                    currentRequest.assignedEmployees =
                                                        currentRequest?.assignedEmployees.filter(
                                                            (_ae) =>
                                                                _ae.employeeId !== ae.employeeId,
                                                        );
                                                    currentRequest.status = "WAITING_LIST";
                                                    setCurrentRequest({ ...currentRequest });
                                                    store.request.updateRequestWithoutLoader(
                                                        currentRequest,
                                                    );
                                                }
                                            }}
                                            deleteIcon={<IconBasket />}
                                            disabledDelete={store.notification.rescheduleNotifications.some(
                                                (n) => n.requestId === currentRequest?.id,
                                            )}
                                        />
                                    </div>
                                    <div className={styles.dividerHorizontal} />
                                </>
                            ))}

                            {intRange(
                                0,
                                (currentRequest?.inspectorMaleCount ?? 0) -
                                    (currentRequest?.assignedEmployees?.filter(
                                        (e) =>
                                            store.employee.findById(e.employeeId)?.sex === "male",
                                    ).length ?? 0),
                            ).map((i) => (
                                <>
                                    <div className={styles.inspectorsListItem} key={i}>
                                        <Person
                                            fullName={"Мужчина"}
                                            icon={<IconMan />}
                                            iconAfter={
                                                <div style={{ width: 270, marginLeft: "auto" }}>
                                                    <Autocomplete
                                                        size={"medium"}
                                                        placeholder={"Подобрать вручную"}
                                                        value={null}
                                                        onValueChange={(v) => {
                                                            if (
                                                                currentRequest?.assignedEmployees &&
                                                                v
                                                            ) {
                                                                const newEmployee =
                                                                    store.employee.findById(v);
                                                                if (newEmployee) {
                                                                    currentRequest.assignedEmployees.push(
                                                                        {
                                                                            employeeId:
                                                                                newEmployee.id,
                                                                            assignedManually: true,
                                                                            responsible: false,
                                                                        },
                                                                    );
                                                                    setCurrentRequest({
                                                                        ...currentRequest,
                                                                    });
                                                                    store.request.updateRequestWithoutLoader(
                                                                        currentRequest,
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                        options={store.employee.employees
                                                            .filter(
                                                                (e) =>
                                                                    !currentRequest?.assignedEmployees?.some(
                                                                        (ae) =>
                                                                            ae.employeeId === e.id,
                                                                    ) && e.sex === "male",
                                                            )
                                                            .map((e) => ({
                                                                name: getNameInitials(e),
                                                                value: e.id,
                                                            }))}
                                                        disabled={store.notification.rescheduleNotifications.some(
                                                            (n) =>
                                                                n.requestId === currentRequest?.id,
                                                        )}
                                                    />
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className={styles.dividerHorizontal} />
                                </>
                            ))}
                            {intRange(
                                0,
                                (currentRequest?.inspectorFemaleCount ?? 0) -
                                    (currentRequest?.assignedEmployees?.filter(
                                        (e) =>
                                            store.employee.findById(e.employeeId)?.sex === "female",
                                    ).length ?? 0),
                            ).map((i) => (
                                <>
                                    <div className={styles.inspectorsListItem} key={i}>
                                        <Person
                                            fullName={"Женщина"}
                                            icon={<IconWoman />}
                                            iconAfter={
                                                <div style={{ width: 270, marginLeft: "auto" }}>
                                                    <Autocomplete
                                                        size={"medium"}
                                                        placeholder={"Подобрать вручную"}
                                                        value={null}
                                                        onValueChange={(v) => {
                                                            if (
                                                                currentRequest?.assignedEmployees &&
                                                                v
                                                            ) {
                                                                const newEmployee =
                                                                    store.employee.findById(v);
                                                                if (newEmployee) {
                                                                    currentRequest.assignedEmployees.push(
                                                                        {
                                                                            employeeId:
                                                                                newEmployee.id,
                                                                            assignedManually: true,
                                                                            responsible: false,
                                                                        },
                                                                    );
                                                                    setCurrentRequest({
                                                                        ...currentRequest,
                                                                    });
                                                                    store.request.updateRequestWithoutLoader(
                                                                        currentRequest,
                                                                    );
                                                                }
                                                            }
                                                        }}
                                                        options={store.employee.employees
                                                            .filter(
                                                                (e) =>
                                                                    !currentRequest?.assignedEmployees?.some(
                                                                        (ae) =>
                                                                            ae.employeeId === e.id,
                                                                    ) && e.sex === "male",
                                                            )
                                                            .map((e) => ({
                                                                name: getNameInitials(e),
                                                                value: e.id,
                                                            }))}
                                                        disabled={store.notification.rescheduleNotifications.some(
                                                            (n) =>
                                                                n.requestId === currentRequest?.id,
                                                        )}
                                                    />
                                                </div>
                                            }
                                        />
                                    </div>
                                    <div className={styles.dividerHorizontal} />
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </Overlay>
        </AdminPageContentLayout>
    );
});
