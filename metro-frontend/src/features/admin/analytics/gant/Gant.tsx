import React, { useEffect, useState } from "react";
import styles from "./Gant.module.scss";
import { observer } from "mobx-react-lite";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import clsx from "clsx";
import { store } from "src/app/AppStore.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { Tooltip } from "src/ui/components/info/Tooltip/Tooltip.tsx";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import dayjs from "dayjs";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { useNavigate } from "react-router-dom";

export const Gant = observer(() => {
    const tabs = [
        {
            name: `Сегодня, ${dayjs().toDate().toLocaleDateString([], {
                day: "numeric",
                month: "long",
            })}`,
            value: dayjs().toDate().toLocaleDateString(),
        },
        {
            name: `Завтра, ${dayjs().add(1, "day").toDate().toLocaleDateString([], {
                day: "numeric",
                month: "long",
            })}`,
            value: dayjs().add(1, "day").toDate().toLocaleDateString(),
        },
    ];
    const navigate = useNavigate();
    const [searchDate, setSearchDate] = useState<string>(tabs[0].value);
    const [tab, setTab] = useState<any>(tabs[0].value);
    useEffect(() => {
        store.request.fetchAllByFilter({ tripDate: searchDate });
        store.employee.employees;
    }, [searchDate]);

    function timeToDecimal(time: any) {
        const [hours, minutes] = time.split(":").map(Number);
        let decimalHours = hours;

        if (hours === 0) {
            decimalHours = 24;
        }

        return decimalHours + minutes / 60;
    }

    const convertDate = (date: string) => {
        const [day, month, year] = date.split(".");
        return `${year}-${month}-${day}`;
    };

    function filterRequestsForToday(requests: IRequest[]): IRequest[] {
        return requests.filter((request) =>
            request.info.tripDate.startsWith(convertDate(searchDate)),
        );
    }

    const requests: any[] = filterRequestsForToday(store.request.requests);
    function getDayOfWeek(dateString: any) {
        const [day, month, year] = dateString.split(".").map(Number);
        const dateObject = new Date(year, month - 1, day);
        return dateObject.getDay();
    }
    function getWeekDayRange(date: any) {
        switch (date) {
            case 1:
                return "timeWorkStart1";
            case 2:
                return "timeWorkStart2";
            case 3:
                return "timeWorkStart3";
            case 4:
                return "timeWorkStart4";
            case 5:
                return "timeWorkStart5";
            case 6:
                return "timeWorkStart6";
            default:
                return "timeWorkStart7";
        }
    }
    const newEmployees: any[] = store.employee.employees.map((emp: any) => ({
        fullName: `${emp.lastName} ${emp.firstName} ${emp.patronymic}`,
        workstart: emp[getWeekDayRange(getDayOfWeek(searchDate))],
        workend: emp[getWeekDayRange(getDayOfWeek(searchDate)).replace("Start", "End")],
        lunch: emp[getWeekDayRange(getDayOfWeek(searchDate)).replace("WorkStart", "Lunch")],
        cu: emp.area,
        id: emp.id,
        position: emp.position,
        requests: requests.filter((req) =>
            req?.assignedEmployees.some(
                (assignedEmp: { employeeId: number }) => assignedEmp.employeeId === emp.id,
            ),
        ),
    }));

    const convertToTimeFormat = (isoString: any) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div>
            <Table
                data={newEmployees
                    .sort((a, b) => a.cu.localeCompare(b.cu))
                    .filter((employee) =>
                        employee.fullName
                            .toLowerCase()
                            .includes(store.distribution.filter.search.toLowerCase()),
                    )}
                noSticky={true}
                loading={store.request.loader.loading}
                headerFilters={
                    <>
                        <Tabs
                            type={"secondary"}
                            size={"large"}
                            tabs={tabs}
                            value={tab}
                            onChange={(value) => {
                                setTab(value);
                                setSearchDate(value);
                            }}
                        />
                        <DatePicker
                            size={"large"}
                            value={dayjs(searchDate, "DD.MM.YYYY").toISOString()}
                            onChange={(date: any) => {
                                if (date) {
                                    setSearchDate(new Date(date).toLocaleDateString());
                                } else {
                                    setSearchDate(new Date(date).toLocaleDateString());
                                }
                            }}
                            disableTime={true}
                            disableClear={true}
                        />
                    </>
                }
                columns={[
                    {
                        name: "Сотрудник",
                        width: 232,
                        render: (data) => (
                            <div
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/admin/employees/${data.id}`)}
                            >
                                <Typo variant={"actionL"}>
                                    {data.fullName},{" "}
                                    <span className={styles.position}>({data.position})</span>
                                </Typo>
                            </div>
                        ),
                    },
                    {
                        name: (
                            <div className={styles.gantHead}>
                                <span className={styles.gantHeadText}>00:00</span>
                                <span className={styles.gantHeadText}>03:00</span>

                                <span className={styles.gantHeadText}>06:00</span>

                                <span className={styles.gantHeadText}>09:00</span>

                                <span className={styles.gantHeadText}>12:00</span>

                                <span className={styles.gantHeadText}>15:00</span>

                                <span className={styles.gantHeadText}>18:00</span>

                                <span className={styles.gantHeadText}>21:00</span>

                                <span className={styles.gantHeadText}>00:00</span>
                            </div>
                        ),
                        width: 728,
                        render: (data) => (
                            <div className={styles.gantrowContainer}>
                                <Tooltip
                                    mode={"neutral"}
                                    tipPosition={"bottom-center"}
                                    header={"Начало работы"}
                                >
                                    <div
                                        style={{
                                            width: 4,
                                            left:
                                                timeToDecimal(data.workstart) * (664 / 24) /*- 8*/,
                                        }}
                                        className={clsx(
                                            styles.gantrowItem,
                                            styles.workTime,
                                            styles.startWork,
                                        )}
                                    ></div>
                                </Tooltip>

                                <Tooltip
                                    mode={"neutral"}
                                    tipPosition={"bottom-center"}
                                    header={"Обед"}
                                >
                                    <div
                                        style={{
                                            width: 664 / 24 - 2,
                                            left:
                                                timeToDecimal(data?.lunch.substring(0, 5)) *
                                                (664 / 24),
                                        }}
                                        className={clsx(styles.gantrowItem, styles.lunch)}
                                    ></div>
                                </Tooltip>
                                <Tooltip
                                    mode={"neutral"}
                                    tipPosition={"bottom-center"}
                                    header={"Конец работы"}
                                >
                                    <div
                                        style={{
                                            width: 4,
                                            left: timeToDecimal(data.workend) * (664 / 24),
                                        }}
                                        className={clsx(
                                            styles.gantrowItem,
                                            styles.workTime,
                                            styles.endWork,
                                        )}
                                    ></div>
                                </Tooltip>

                                {data.requests.map((i: IRequest, index: number) => {
                                    return (
                                        <Tooltip
                                            key={index}
                                            mode={"neutral"}
                                            tipPosition={"bottom-center"}
                                            header={`Заявка М-${i.number}`}
                                        >
                                            <div
                                                onClick={() => navigate(`/admin/requests/${i.id}`)}
                                                style={{
                                                    width:
                                                        (timeToDecimal(
                                                                convertToTimeFormat(i.info.tripDateEnd),
                                                            ) -
                                                            timeToDecimal(
                                                                convertToTimeFormat(
                                                                    i.info.tripDate,
                                                                ),
                                                            )) *
                                                        (664 / 24) -
                                                        4,
                                                    left:
                                                        timeToDecimal(
                                                            convertToTimeFormat(i.info.tripDate),
                                                        ) /*- 3*/ *
                                                        (664 / 24),
                                                }}
                                                className={clsx(styles.gantrowItem, styles.request)}
                                            ></div>
                                        </Tooltip>
                                    );
                                })}
                            </div>
                        ),
                    },
                ]}
            ></Table>
        </div>
    );
});
