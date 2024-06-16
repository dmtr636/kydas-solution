import styles from "./EmployeeInfo.module.scss";
import { observer } from "mobx-react-lite";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import { useEffect, useState } from "react";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { Tab, Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import { Avatar } from "src/ui/components/solutions/Avatar/Avatar.tsx";
import { getFullName } from "src/shared/utils/getFullName.ts";
import {
    EmployeeStatus,
    getEmployeeStatus,
} from "src/features/admin/employees/components/EmployeeStatus/EmployeeStatus.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { RequestStatus } from "src/features/admin/requests/components/RequestStatus/RequestStatus.tsx";
import { TripRoute } from "src/features/admin/requests/components/TripRoute/TripRoute.tsx";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { RequestAssignedEmployees } from "src/features/admin/requests/components/RequestAssignedEmployees/RequestAssignedEmployees.tsx";
import { notificationActions } from "src/features/admin/notifications/constants/notificationActions.ts";
import { Chip } from "src/ui/components/controls/Chip/Chip.tsx";
import stations from "src/features/request/stations.ts";
import { MetroStation } from "src/features/admin/refs/stations/components/MetroStation/MetroStation.tsx";
import { formatPhoneNumber } from "src/shared/utils/phone.ts";
import { Select } from "src/ui/components/inputs/Select/Select.tsx";
import { IconClose, IconPlus, IconTime } from "src/ui/assets/icons";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import { DateInput } from "src/ui/components/inputs/DateInput/DateInput.tsx";
import { IEmployee } from "src/features/admin/employees/types/IEmployee.ts";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { getTimeForShift } from "src/features/admin/employees/utils/shift.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { employeeStatuses } from "src/features/admin/employees/constants/employeeStatuses.ts";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { EmployeeLocation } from "src/features/admin/employees/components/EmployeeLocation/EmployeeLocation.tsx";

const tabs: Tab[] = [
    {
        name: "Основная информация",
        value: "main",
    },
    {
        name: "График работы",
        value: "schedule",
    },
    {
        name: "Заявки",
        value: "requests",
    },
    {
        name: "Параметры",
        value: "params",
    },
    {
        name: "История действий",
        value: "history",
    },
];

export const EmployeeInfo = observer((props: { editMode: boolean }) => {
    const employee = store.employee.employee;
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString());
    const tab = store.employee.tab;

    useEffect(() => {
        store.employee.tab = "main";
        return () => {
            if (store.employee.employee && props.editMode) {
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
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, [props.editMode]);

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (props.editMode) {
            e.preventDefault();
            if (store.employee.employee) {
                store.employee.updateEmployeeWithoutLoader(
                    {
                        ...store.employee.employee,
                        lockedEdit: null,
                    },
                    false,
                );
            }
        }
        return false;
    };

    const localizeTag = (tag: string) => {
        const map: Record<string, string> = {
            responsible: "Ответственный",
        };
        return map[tag] ?? tag;
    };

    const getEmployeeActiveRequest = (employee: IEmployee) => {
        const requests = store.request.requests.filter((r) =>
            r.assignedEmployees?.some((ae) => ae.employeeId === employee.id),
        );
        const sortedRequests = requests.sort((a, b) =>
            a.info.tripDate.localeCompare(b.info.tripDate),
        );
        const currentDate = new Date().toISOString();
        const nextRequestIndex = sortedRequests.findIndex(
            (r) => r.info.tripDate > currentDate && r.status === "CONFIRMED",
        );
        if (nextRequestIndex !== -1) {
            if (nextRequestIndex > 0 && requests[nextRequestIndex - 1].status === "CONFIRMED") {
                return requests[nextRequestIndex - 1];
            }
            return requests[nextRequestIndex];
        }
    };

    useEffect(() => {
        store.request.requests = [];
        if (employee) {
            store.request.fetchAllByFilter({ tripDate: selectedDate, employeeId: employee.id });
        }
    }, [selectedDate, employee?.id]);

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    {employee ? (
                        <>
                            <Avatar userName={getFullName(employee)} size={"large"} />
                            <div className={styles.employeeInfoCol}>
                                <Typo variant={"actionXL"} className={styles.fullName}>
                                    {getFullName(employee)}{" "}
                                </Typo>
                                <Typo
                                    variant={"subheadM"}
                                    style={{
                                        color: "var(--color-components-text-neutral-secondary, #393939)",
                                    }}
                                >
                                    {employee?.position === "ЦСИ"
                                        ? "Старший инспектор"
                                        : "Инспектор"}{" "}
                                    ({employee.area})
                                </Typo>
                            </div>
                            {getEmployeeStatus(employee) === "WORKING" && (
                                <>
                                    <div className={styles.divider} />
                                    <div className={styles.employeeInfoCol}>
                                        {getEmployeeActiveRequest(employee) && (
                                            <>
                                                <Typo
                                                    variant={"subheadM"}
                                                    className={styles.currentLocation}
                                                >
                                                    Текущее местоположение
                                                </Typo>
                                                <EmployeeLocation
                                                    activeRequest={
                                                        getEmployeeActiveRequest(employee)!
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                            <div className={styles.status}>
                                <EmployeeStatus employee={employee} />
                            </div>
                        </>
                    ) : (
                        <Skeleton height={80} width={"100%"} />
                    )}
                </div>
                <Tabs tabs={tabs} value={tab} onChange={(t) => (store.employee.tab = t)} />
            </div>

            {(tab === "requests" || tab === "history") && (
                <div className={styles.tableFilters}>
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
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                    <DatePicker
                        size={"large"}
                        value={dayjs(selectedDate, "DD.MM.YYYY").toISOString()}
                        onChange={(date) => {
                            if (date) {
                                setSelectedDate(new Date(date).toLocaleDateString());
                            } else {
                                setSelectedDate(new Date().toLocaleDateString());
                            }
                        }}
                        disableTime={true}
                        disableClear={true}
                    />
                </div>
            )}

            {tab === "main" && (
                <>
                    <div className={styles.section}>
                        <Typo variant={"h5"} className={styles.sectionHeader}>
                            Личные данные
                        </Typo>
                        <div className={styles.infoRow}>
                            <div style={{ width: 328 }}>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    ФИО
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {getFullName(employee)}
                                </Typo>
                            </div>
                            <div className={styles.divider} />
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Пол
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {employee?.sex === "male" ? "Мужской" : "Женский"}
                                </Typo>
                            </div>
                            <div className={styles.divider} />
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Табельный номер
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {employee?.number.slice(0, 4) +
                                        "-" +
                                        employee?.number.slice(4, 8)}
                                </Typo>
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <Typo variant={"h5"} className={styles.sectionHeader}>
                            Контактные данные
                        </Typo>
                        <div className={styles.infoRow}>
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Рабочий телефон
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {formatPhoneNumber(employee?.phone ?? "")}
                                </Typo>
                            </div>
                            <div className={styles.divider} />
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Личный телефон
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {formatPhoneNumber(employee?.phonePersonal ?? "")}
                                </Typo>
                            </div>
                            <div className={styles.divider} />
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Почта
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {store.user.users.find((u) => u.id === employee?.userId)?.email}
                                </Typo>
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <Typo variant={"h5"} className={styles.sectionHeader}>
                            Рабочая информация
                        </Typo>
                        <div className={styles.infoRow}>
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Должность
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {employee?.position === "ЦСИ"
                                        ? "Старший инспектор"
                                        : "Инспектор"}
                                </Typo>
                            </div>
                            <div className={styles.divider} />
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Участок
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {employee?.area}
                                </Typo>
                            </div>
                            <div className={styles.divider} />
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Руководитель участка
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {employee?.supervisor}
                                </Typo>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {tab === "requests" && (
                <Table
                    data={store.request
                        .sortRequests(store.request.requests.slice())
                        .filter((r) => r.status === "CONFIRMED" || r.status === "COMPLETED")}
                    onRowClick={(data) => navigate(`/admin/requests/${data.id}`)}
                    columns={[
                        {
                            name: "№ Заявки",
                            width: 153,
                            render: (request) => (
                                <Typo variant={"actionL"}>M-{request.number}</Typo>
                            ),
                            sortField: "number",
                        },
                        {
                            name: "Дата",
                            width: 104,
                            render: (request) => (
                                <div className={styles.dateField}>
                                    <Typo variant={"actionL"}>
                                        {formatDate(request.info.tripDate)}
                                    </Typo>
                                    <Typo variant={"actionL"} className={styles.time}>
                                        {formatTime(request.info.tripDate)}
                                    </Typo>
                                </div>
                            ),
                            sortField: "tripDate",
                        },
                        {
                            name: "Статус",
                            width: 170,
                            render: (request) => <RequestStatus request={request} />,
                            sortField: "status",
                        },
                        {
                            name: "Назначенные инспекторы",
                            width: 246,
                            render: (request) => <RequestAssignedEmployees request={request} />,
                        },
                        {
                            name: "Маршрут",
                            width: 262,
                            render: (request) => (
                                <TripRoute
                                    arrivalStationId={request.info.arrivalStationId}
                                    departureStationId={request.info.departureStationId}
                                />
                            ),
                        },
                    ]}
                    filterStore={store.request.filter}
                    loading={store.request.loader.loading || store.employee.loader.loading}
                    card={false}
                />
            )}

            {tab === "params" && (
                <div className={styles.params}>
                    <div className={styles.paramsText}>
                        <Typo variant={"bodyXL"}>
                            Выбранные параметры влияют на работу алгоритма. Они позволяют учитывать
                            гибкие настройки и оптимально назначать инспекторов для сопровождения
                        </Typo>
                    </div>
                    <div className={styles.paramsList}>
                        {employee?.tags.map((tag) => (
                            <Chip
                                key={tag}
                                onDelete={() => {
                                    if (employee && employee.tags) {
                                        employee.tags = employee.tags.filter((t) => t !== tag);
                                        store.employee.updateEmployeeWithoutLoader(employee);
                                    }
                                }}
                            >
                                {localizeTag(tag)}
                            </Chip>
                        ))}
                        {!!tagOptions.filter((o) => !employee?.tags.includes(o.value)).length && (
                            <div style={{ width: 232 }}>
                                <Select
                                    value={null}
                                    onValueChange={(value) => {
                                        if (employee && !employee.tags) {
                                            employee.tags = [];
                                        }
                                        if (employee && value) {
                                            employee.tags = [...employee.tags, value];
                                            store.employee.updateEmployeeWithoutLoader(employee);
                                        }
                                    }}
                                    options={tagOptions.filter(
                                        (o) => !employee?.tags.includes(o.value),
                                    )}
                                    placeholder={"Новый параметр"}
                                    iconBefore={<IconPlus />}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {tab === "schedule" && !props.editMode && (
                <>
                    <div className={styles.section}>
                        <Typo variant={"h5"} className={styles.sectionHeader}>
                            График работы
                        </Typo>
                        <div className={styles.infoRow}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto 166px 166px",
                                    gap: 20,
                                }}
                            >
                                {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((d, index) => (
                                    <>
                                        <Typo
                                            variant={"actionXL"}
                                            style={{
                                                color:
                                                    employee?.[
                                                        `timeWorkStart${index + 1}` as keyof IEmployee
                                                    ] ?? ""
                                                        ? "var(--color-components-text-accent, #003EDE)"
                                                        : "#6A6A6A",
                                                marginTop: index === 0 ? 43 : 15,
                                            }}
                                        >
                                            {d}
                                        </Typo>
                                        <DateInput
                                            formName={index === 0 ? "Начало" : undefined}
                                            dateType={"time"}
                                            startIcon={
                                                employee?.[
                                                    `timeWorkStart${index + 1}` as keyof IEmployee
                                                ] ?? "" ? (
                                                    <IconTime />
                                                ) : undefined
                                            }
                                            value={
                                                (employee?.[
                                                    `timeWorkStart${index + 1}` as keyof IEmployee
                                                ] ?? "") as string
                                            }
                                            onChange={() => {}}
                                            readonly={true}
                                            placeholder={" "}
                                        />
                                        <DateInput
                                            formName={index === 0 ? "Завершение" : undefined}
                                            dateType={"time"}
                                            startIcon={
                                                employee?.[
                                                    `timeWorkEnd${index + 1}` as keyof IEmployee
                                                ] ?? "" ? (
                                                    <IconTime />
                                                ) : undefined
                                            }
                                            value={
                                                (employee?.[
                                                    `timeWorkEnd${index + 1}` as keyof IEmployee
                                                ] ?? "") as string
                                            }
                                            onChange={() => {}}
                                            readonly={true}
                                            placeholder={" "}
                                        />
                                    </>
                                ))}
                            </div>
                            <div className={styles.divider} style={{ height: 155 }} />
                            <div style={{ width: 340 }}>
                                <TextArea
                                    formName={"Смена"}
                                    height={52}
                                    value={employee?.shift}
                                    readonly={true}
                                    appendTextToValue={
                                        employee?.timeWorkStart1 !==
                                            getTimeForShift(employee?.shift ?? "")?.[0] ||
                                        employee?.timeWorkEnd1 !==
                                            getTimeForShift(employee?.shift ?? "")?.[1] ||
                                        employee?.timeWorkStart2 !==
                                            getTimeForShift(employee?.shift ?? "")?.[0] ||
                                        employee?.timeWorkEnd2 !==
                                            getTimeForShift(employee?.shift ?? "")?.[1] ||
                                        employee?.timeWorkStart3 !==
                                            getTimeForShift(employee?.shift ?? "")?.[0] ||
                                        employee?.timeWorkEnd3 !==
                                            getTimeForShift(employee?.shift ?? "")?.[1] ||
                                        employee?.timeWorkStart4 !==
                                            getTimeForShift(employee?.shift ?? "")?.[0] ||
                                        employee?.timeWorkEnd4 !==
                                            getTimeForShift(employee?.shift ?? "")?.[1] ||
                                        employee?.timeWorkStart5 !==
                                            getTimeForShift(employee?.shift ?? "")?.[0] ||
                                        employee?.timeWorkEnd5 !==
                                            getTimeForShift(employee?.shift ?? "")?.[1] ||
                                        employee?.timeWorkStart6 !==
                                            getTimeForShift(employee?.shift ?? "")?.[0] ||
                                        employee?.timeWorkEnd6 !==
                                            getTimeForShift(employee?.shift ?? "")?.[1] ||
                                        employee?.timeWorkStart7 !==
                                            getTimeForShift(employee?.shift ?? "")?.[0] ||
                                        employee?.timeWorkEnd7 !==
                                            getTimeForShift(employee?.shift ?? "")?.[1]
                                            ? " (Изменённое)"
                                            : ""
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <Typo variant={"h5"} className={styles.sectionHeader}>
                            Запланированные события
                        </Typo>

                        {!employee?.schedule.length && (
                            <Typo
                                variant={"actionL"}
                                style={{ color: "var(--color-components-text-neutral-secondary" }}
                            >
                                Для добавления новых событий перейдите в режим редактирования
                                графика
                            </Typo>
                        )}

                        {!props.editMode &&
                            !!employee?.schedule.length &&
                            employee?.schedule.map((e, i) => (
                                <>
                                    <div
                                        key={i}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "132px 132px 360px",
                                            gap: 20,
                                            marginBottom:
                                                i === employee.schedule.length - 1 ? 0 : 24,
                                            marginTop: 24,
                                        }}
                                    >
                                        <DateInput
                                            dateType={"fulldate"}
                                            size={"large"}
                                            value={e.dateStart}
                                            onChange={(d) => (e.dateStart = d)}
                                            formName={"С этой даты"}
                                            readonly={true}
                                        />
                                        <DateInput
                                            dateType={"fulldate"}
                                            size={"large"}
                                            value={e.dateEnd}
                                            onChange={(d) => (e.dateEnd = d)}
                                            formName={"До этой"}
                                            readonly={true}
                                        />
                                        <TextArea
                                            formName={"Событие"}
                                            height={52}
                                            value={
                                                employeeStatuses[
                                                    e.event as keyof typeof employeeStatuses
                                                ]
                                            }
                                            readonly={true}
                                        />
                                    </div>
                                    <div className={styles.dividerHorizontal} />
                                </>
                            ))}
                    </div>
                </>
            )}

            {tab === "schedule" && props.editMode && (
                <>
                    <div className={styles.section}>
                        <Typo variant={"h5"} className={styles.sectionHeader}>
                            График работы
                        </Typo>
                        <div className={styles.infoRow}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "auto 166px 166px",
                                    gap: 20,
                                }}
                            >
                                {["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"].map((d, index) => (
                                    <>
                                        <div
                                            style={{
                                                color: "var(--color-components-text-accent, #003EDE)",
                                                marginTop: index === 0 ? 43 : 15,
                                            }}
                                        >
                                            <Checkbox
                                                color={"accent"}
                                                checked={
                                                    !!(
                                                        store.employee.editingEmployee?.[
                                                            `timeWorkStart${index + 1}` as keyof IEmployee
                                                        ] ?? ""
                                                    )
                                                }
                                                onChange={(checked) => {
                                                    if (!checked) {
                                                        if (
                                                            store.employee.editingEmployee?.[
                                                                `timeWorkStart${index + 1}` as keyof IEmployee
                                                            ]
                                                        ) {
                                                            (store.employee.editingEmployee as any)[
                                                                `timeWorkStart${index + 1}`
                                                            ] = null;
                                                        }
                                                        if (
                                                            store.employee.editingEmployee?.[
                                                                `timeWorkEnd${index + 1}` as keyof IEmployee
                                                            ]
                                                        ) {
                                                            (store.employee.editingEmployee as any)[
                                                                `timeWorkEnd${index + 1}`
                                                            ] = null;
                                                        }
                                                    } else {
                                                        (store.employee.editingEmployee as any)[
                                                            `timeWorkStart${index + 1}`
                                                        ] = getTimeForShift(
                                                            store.employee.editingEmployee?.shift ??
                                                                "",
                                                        )?.[0];
                                                        (store.employee.editingEmployee as any)[
                                                            `timeWorkEnd${index + 1}`
                                                        ] = getTimeForShift(
                                                            store.employee.editingEmployee?.shift ??
                                                                "",
                                                        )?.[1];
                                                    }
                                                }}
                                                title={d}
                                            />
                                        </div>
                                        <DateInput
                                            formName={index === 0 ? "Начало" : undefined}
                                            dateType={"time"}
                                            startIcon={<IconTime />}
                                            value={
                                                (store.employee.editingEmployee?.[
                                                    `timeWorkStart${index + 1}` as keyof IEmployee
                                                ] ?? "") as string
                                            }
                                            onChange={(d) => {
                                                if (
                                                    store.employee.editingEmployee?.[
                                                        `timeWorkStart${index + 1}` as keyof IEmployee
                                                    ]
                                                ) {
                                                    (store.employee.editingEmployee as any)[
                                                        `timeWorkStart${index + 1}`
                                                    ] = d;
                                                }
                                            }}
                                        />
                                        <DateInput
                                            formName={index === 0 ? "Завершение" : undefined}
                                            dateType={"time"}
                                            startIcon={<IconTime />}
                                            value={
                                                (store.employee.editingEmployee?.[
                                                    `timeWorkEnd${index + 1}` as keyof IEmployee
                                                ] ?? "") as string
                                            }
                                            onChange={(d) => {
                                                if (
                                                    store.employee.editingEmployee?.[
                                                        `timeWorkEnd${index + 1}` as keyof IEmployee
                                                    ]
                                                ) {
                                                    (store.employee.editingEmployee as any)[
                                                        `timeWorkEnd${index + 1}`
                                                    ] = d;
                                                }
                                            }}
                                        />
                                    </>
                                ))}
                            </div>
                            <div className={styles.divider} style={{ height: 155 }} />
                            <div style={{ width: 340 }}>
                                <Select
                                    appendTextToValue={
                                        store.employee.editingEmployee?.timeWorkStart1 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[0] ||
                                        store.employee.editingEmployee?.timeWorkEnd1 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[1] ||
                                        store.employee.editingEmployee?.timeWorkStart2 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[0] ||
                                        store.employee.editingEmployee?.timeWorkEnd2 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[1] ||
                                        store.employee.editingEmployee?.timeWorkStart3 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[0] ||
                                        store.employee.editingEmployee?.timeWorkEnd3 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[1] ||
                                        store.employee.editingEmployee?.timeWorkStart4 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[0] ||
                                        store.employee.editingEmployee?.timeWorkEnd4 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[1] ||
                                        store.employee.editingEmployee?.timeWorkStart5 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[0] ||
                                        store.employee.editingEmployee?.timeWorkEnd5 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[1] ||
                                        store.employee.editingEmployee?.timeWorkStart6 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[0] ||
                                        store.employee.editingEmployee?.timeWorkEnd6 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[1] ||
                                        store.employee.editingEmployee?.timeWorkStart7 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[0] ||
                                        store.employee.editingEmployee?.timeWorkEnd7 !==
                                            getTimeForShift(
                                                store.employee.editingEmployee?.shift ?? "",
                                            )?.[1]
                                            ? " (Изменённое)"
                                            : ""
                                    }
                                    onValueChange={(v) => {
                                        if (store.employee.editingEmployee) {
                                            store.employee.editingEmployee.shift = v as string;
                                            store.employee.editingEmployee.timeWorkStart1 =
                                                getTimeForShift(v ?? "")?.[0] ?? null;
                                            store.employee.editingEmployee.timeWorkEnd1 =
                                                getTimeForShift(v ?? "")?.[1] ?? null;
                                            store.employee.editingEmployee.timeWorkStart2 =
                                                getTimeForShift(v ?? "")?.[0] ?? null;
                                            store.employee.editingEmployee.timeWorkEnd2 =
                                                getTimeForShift(v ?? "")?.[1] ?? null;
                                            store.employee.editingEmployee.timeWorkStart3 =
                                                getTimeForShift(v ?? "")?.[0] ?? null;
                                            store.employee.editingEmployee.timeWorkEnd3 =
                                                getTimeForShift(v ?? "")?.[1] ?? null;
                                            store.employee.editingEmployee.timeWorkStart4 =
                                                getTimeForShift(v ?? "")?.[0] ?? null;
                                            store.employee.editingEmployee.timeWorkEnd4 =
                                                getTimeForShift(v ?? "")?.[1] ?? null;
                                            store.employee.editingEmployee.timeWorkStart5 =
                                                getTimeForShift(v ?? "")?.[0] ?? null;
                                            store.employee.editingEmployee.timeWorkEnd5 =
                                                getTimeForShift(v ?? "")?.[1] ?? null;
                                            store.employee.editingEmployee.timeWorkStart6 =
                                                getTimeForShift(v ?? "")?.[0] ?? null;
                                            store.employee.editingEmployee.timeWorkEnd6 =
                                                getTimeForShift(v ?? "")?.[1] ?? null;
                                            store.employee.editingEmployee.timeWorkStart7 =
                                                getTimeForShift(v ?? "")?.[0] ?? null;
                                            store.employee.editingEmployee.timeWorkEnd7 =
                                                getTimeForShift(v ?? "")?.[1] ?? null;
                                        }
                                    }}
                                    formName={"Смена"}
                                    options={[
                                        {
                                            name: "1",
                                            value: "1",
                                        },
                                        {
                                            name: "2",
                                            value: "2",
                                        },
                                        {
                                            name: "1(Н)",
                                            value: "1Н",
                                        },
                                        {
                                            name: "2(Н)",
                                            value: "2Н",
                                        },
                                        {
                                            name: "5",
                                            value: "5",
                                        },
                                    ]}
                                    size={"large"}
                                    value={store.employee.editingEmployee?.shift}
                                    disableClear={true}
                                    formNotification={
                                        "При выборе смены график работы проставляется автоматически"
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className={styles.section}>
                        <Typo variant={"h5"} className={styles.sectionHeader}>
                            Запланированные события
                        </Typo>

                        <div style={{ width: 664 }}>
                            {!props.editMode && !employee?.schedule.length && (
                                <Typo
                                    variant={"actionL"}
                                    style={{
                                        color: "var(--color-components-text-neutral-secondary",
                                    }}
                                >
                                    Для добавления новых событий перейдите в режим редактирования
                                    графика
                                </Typo>
                            )}

                            <div>
                                {props.editMode &&
                                    !!store.employee.editingEmployee?.schedule.length &&
                                    store.employee.editingEmployee?.schedule.map((e, i) => (
                                        <>
                                            <div
                                                key={i}
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns: "132px 132px 304px 36px",
                                                    gap: 20,
                                                    marginBottom: 24,
                                                    marginTop: 24,
                                                }}
                                            >
                                                <DateInput
                                                    dateType={"fulldate"}
                                                    size={"large"}
                                                    value={e.dateStart}
                                                    onChange={(d) => (e.dateStart = d)}
                                                    formName={"С этой даты"}
                                                />
                                                <DateInput
                                                    dateType={"fulldate"}
                                                    size={"large"}
                                                    value={e.dateEnd}
                                                    onChange={(d) => (e.dateEnd = d)}
                                                    formName={"До этой"}
                                                />
                                                <Select
                                                    size={"large"}
                                                    value={e.event}
                                                    onValueChange={(v) => (e.event = v as string)}
                                                    disableClear={true}
                                                    formName={"Событие"}
                                                    options={[
                                                        {
                                                            name: "Выходной",
                                                            value: "DAY_OFF",
                                                        },
                                                        {
                                                            name: "Отпуск",
                                                            value: "VACATION",
                                                        },
                                                        {
                                                            name: "Больничный",
                                                            value: "SICK_LEAVE",
                                                        },
                                                        {
                                                            name: "Учёба",
                                                            value: "STUDY",
                                                        },
                                                    ]}
                                                />
                                                <ButtonIcon
                                                    size={"small"}
                                                    type={"tertiary"}
                                                    mode={"neutral"}
                                                    pale
                                                    style={{
                                                        marginTop: 36,
                                                    }}
                                                    onClick={() => {
                                                        store.employee.editingEmployee?.schedule?.splice(
                                                            i,
                                                            1,
                                                        );
                                                    }}
                                                >
                                                    <IconClose />
                                                </ButtonIcon>
                                            </div>
                                            <div className={styles.dividerHorizontal} />
                                        </>
                                    ))}
                            </div>

                            {props.editMode && (
                                <Button
                                    iconBefore={<IconPlus />}
                                    type={"outlined"}
                                    fullWidth={true}
                                    style={{ marginTop: 24 }}
                                    onClick={() => {
                                        if (store.employee.editingEmployee) {
                                            store.employee.editingEmployee.schedule = [
                                                ...store.employee.editingEmployee.schedule,
                                                {
                                                    dateStart: dayjs()
                                                        .toDate()
                                                        .toLocaleDateString(),
                                                    dateEnd: dayjs().toDate().toLocaleDateString(),
                                                    event: "DAY_OFF",
                                                },
                                            ];
                                        }
                                    }}
                                >
                                    Добавить событие
                                </Button>
                            )}
                        </div>
                    </div>
                </>
            )}

            {tab === "history" && (
                <Table
                    data={store.notification.sortNotifications(
                        store.notification.notifications.filter(
                            (n) =>
                                n.userId === employee?.userId &&
                                new Date(n.createDate).toLocaleDateString() === selectedDate,
                        ),
                    )}
                    onRowClick={(data) => {
                        navigate(`/admin/requests/${data.requestId}/history`);
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
                            width: 214,
                            render: (notification) => (
                                <Typo variant={"bodyL"} className={styles.action}>
                                    {notificationActions[notification.action]}
                                </Typo>
                            ),
                        },
                    ]}
                    loading={store.notification.loader.loading || store.employee.loader.loading}
                    filterStore={store.notification.filter}
                    card={false}
                />
            )}
        </div>
    );
});

export const tagOptions = [
    {
        name: "Лёгкий труд",
        value: "Лёгкий труд",
    },
    { name: "Язык жестов", value: "Язык жестов" },
    { name: "Ответственный", value: "Ответственный" },
];
