import { useEffect, useState } from "react";
import styles from "./analytics.module.scss";
import { PieChart, Pie, Tooltip, Cell } from "recharts";

import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import TimeDistributionChart from "src/features/admin/analytics/ChartAnalytics/ChatAnalytics.tsx";
import { IconTime } from "src/ui/assets/icons";
import { clsx } from "clsx";
import { Gant } from "src/features/admin/analytics/gant/Gant.tsx";
import { store } from "src/app/AppStore.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { getHealthGroupById } from "src/features/admin/requests/utils/healthArray.ts";
import { observer } from "mobx-react-lite";

const AnalyticsPage = observer(() => {
    function formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    }
    function getToday(): string {
        const today = new Date();
        return formatDate(today);
    }
    const todayDate = getToday();
    useEffect(() => {
        store.request.fetchAllByFilter({ tripDate: todayDate });
    }, []);
    const tabs1 = [
        { name: "Сегодня", value: "today" },
        { name: "Неделя", value: "week1" },
        {
            name: "Месяц",
            value: "month1",
        },
    ];
    const tabs2 = [
        { name: "Неделя", value: "week" },
        {
            name: "Месяц",
            value: "month",
        },
    ];
    const tabs3 = [
        { name: "Сегодня", value: "today2" },
        { name: "Неделя", value: "week2" },
        {
            name: "Месяц",
            value: "month2",
        },
    ];
    const tabs4 = [
        { name: "Сегодня", value: "today2" },
        { name: "Неделя", value: "week2" },
        {
            name: "Месяц",
            value: "month2",
        },
    ];
    function updateValuesWithSwitch(data: any[], requests: IRequest[]): any[] {
        data.forEach((item) => (item.value = 0));

        requests.forEach((request) => {
            switch (getHealthGroupById(request.info.groupId)?.name) {
                case "Инвалид по зрению":
                    data[0].value += 1;
                    break;
                case "Инвалид по зрению с остаточным зрением":
                    data[1].value += 1;
                    break;
                case "Инвалид по слуху":
                    data[2].value += 1;
                    break;
                case "Инвалид колясочник":
                    data[3].value += 1;
                    break;
                case "Инвалид опорник":
                    data[4].value += 1;
                    break;
                case "Ребёнок инвалид":
                    data[5].value += 1;
                    break;
                case "Пожилой человек":
                    data[6].value += 1;
                    break;
                case "Люди с ментальной инвалидностью":
                    data[7].value += 1;
                    break;
                case "Родители с детьми":
                    data[8].value += 1;
                    break;
                case "Родители с детскими колясками":
                    data[9].value += 1;
                    break;
                case "Организованные группы детей":
                    data[10].value += 1;
                    break;
                case "Временно маломобильные":
                    data[11].value += 1;
                    break;
                default:
                    // Если группа не соответствует ни одному из случаев
                    break;
            }
        });

        return data;
    }

    const [currentTab1, setCurrentTab1] = useState<string>(tabs1[0].value);
    const [currentTab2, setCurrentTab2] = useState<string>(tabs2[0].value);
    const [currentTab3, setCurrentTab3] = useState<string>(tabs3[0].value);
    const [currentTab4, setCurrentTab4] = useState<string>(tabs4[0].value);
    const dataCuDay = [
        { CU: "ЦУ-1", requests: 58 },
        { CU: "ЦУ-2", requests: 42 },
        { CU: "ЦУ-3", requests: 52 },
        { CU: "ЦУ-3(Н)", requests: 12 },
        { CU: "ЦУ-4", requests: 64 },
        { CU: "ЦУ-4(Н)", requests: 32 },
        { CU: "ЦУ-5", requests: 55 },
        { CU: "ЦУ-8", requests: 70 },
    ];
    const dataWeeklyWeek = [
        { day: "Пн", requests: 42 },
        { day: "Вт", requests: 68 },
        { day: "Ср", requests: 89 },
        { day: "Чт", requests: 15 },
        { day: "Пт", requests: 32 },
        { day: "Сб", requests: 42 },
        { day: "Вс", requests: 25 },
    ];

    const dataHourly1 = [
        { hour: "00", requests: 50 },
        { hour: "01", requests: 20 },
        { hour: "02", requests: 30 },
        { hour: "03", requests: 40 },
        { hour: "04", requests: 10 },
        { hour: "05", requests: 60 },
        { hour: "06", requests: 70 },
        { hour: "07", requests: 80 },
        { hour: "08", requests: 90 },
        { hour: "09", requests: 100 },
        { hour: "10", requests: 310 },
        { hour: "11", requests: 520 },
        { hour: "12", requests: 530 },
        { hour: "13", requests: 640 },
        { hour: "14", requests: 650 },
        { hour: "15", requests: 460 },
        { hour: "16", requests: 170 },
        { hour: "17", requests: 980 },
        { hour: "18", requests: 790 },
        { hour: "19", requests: 200 },
        { hour: "20", requests: 210 },
        { hour: "21", requests: 20 },
        { hour: "22", requests: 30 },
        { hour: "23", requests: 40 },
    ];

    function updateHourlyRequests(data: any[], requests: IRequest[]): any[] {
        // Обнуляем количество запросов
        data.forEach((item) => (item.requests = 0));

        // Проходимся по массиву заявок и увеличиваем количество запросов для соответствующего часа
        requests.forEach((request) => {
            const hour = new Date(request.info.tripDate).getHours().toString().padStart(2, "0");

            switch (hour) {
                case "00":
                    data[0].requests += 1;
                    break;
                case "01":
                    data[1].requests += 1;
                    break;
                case "02":
                    data[2].requests += 1;
                    break;
                case "03":
                    data[3].requests += 1;
                    break;
                case "04":
                    data[4].requests += 1;
                    break;
                case "05":
                    data[5].requests += 1;
                    break;
                case "06":
                    data[6].requests += 1;
                    break;
                case "07":
                    data[7].requests += 1;
                    break;
                case "08":
                    data[8].requests += 1;
                    break;
                case "09":
                    data[9].requests += 1;
                    break;
                case "10":
                    data[10].requests += 1;
                    break;
                case "11":
                    data[11].requests += 1;
                    break;
                case "12":
                    data[12].requests += 1;
                    break;
                case "13":
                    data[13].requests += 1;
                    break;
                case "14":
                    data[14].requests += 1;
                    break;
                case "15":
                    data[15].requests += 1;
                    break;
                case "16":
                    data[16].requests += 1;
                    break;
                case "17":
                    data[17].requests += 1;
                    break;
                case "18":
                    data[18].requests += 1;
                    break;
                case "19":
                    data[19].requests += 1;
                    break;
                case "20":
                    data[20].requests += 1;
                    break;
                case "21":
                    data[21].requests += 1;
                    break;
                case "22":
                    data[22].requests += 1;
                    break;
                case "23":
                    data[23].requests += 1;
                    break;
                default:
                    // Если час не распознан
                    break;
            }
        });

        return data;
    }
    const dataHourly = updateHourlyRequests(dataHourly1, store.request.requests);
    const data02 = [
        { name: "Инвалид по зрению", value: 478, color: "#A966FF", hoverColor: "#C699FF" },
        {
            name: "Инвалид по зрению с остаточным зрением",
            value: 892,
            color: "#D766FF",
            hoverColor: "#E499FF",
        },
        { name: "Инвалид по слуху", value: 1210, color: "#FF66E6", hoverColor: "#FF99EF" },
        { name: "Инвалид колясочник", value: 306, color: "#FF6694", hoverColor: "#FF99B8" },
        { name: "Инвалид опорник", value: 1143, color: "#F66", hoverColor: "#F99" },
        { name: "Ребёнок инвалид", value: 762, color: "#FFE666", hoverColor: "#FFEF99" },
        { name: "Пожилой человек", value: 1345, color: "#66C8FF", hoverColor: "#99DAFF" },
        {
            name: "Люди с ментальной инвалидностью",
            value: 1102,
            color: "#667EFF",
            hoverColor: "#99A9FF",
        },
        { name: "Родители с детьми", value: 219, color: "#66FFED", hoverColor: "#99FFF3" },
        {
            name: "Родители с детскими колясками",
            value: 1389,
            color: "#66FF91",
            hoverColor: "#99FFB6",
        },
        { name: "Организованные группы детей", value: 75, color: "#BCFF66", hoverColor: "#D2FF99" },
        { name: "Временно маломобильные", value: 505, color: "#FB6", hoverColor: "#FFD299" },
    ];
    const [currentPie, setCurrentPie] = useState<number | null>(null);
    const totalRequests1 = dataCuDay.reduce((sum, item) => sum + item.requests, 0);
    const totalRequests2 = dataWeeklyWeek.reduce((sum, item) => sum + item.requests, 0);
    const totalRequests3 = dataHourly.reduce((sum, item) => sum + item.requests, 0);
    const data01 = updateValuesWithSwitch(data02, store.request.requests);
    const totalRequestsPie = data01.reduce((sum, item) => sum + item.value, 0);

    const onPieEnter = (_data: any, index: number) => {
        setCurrentPie(index);
    };

    const onPieLeave = () => {
        setCurrentPie(null);
    };

    return (
        <AdminPageContentLayout title={"Аналитика"}>
            <div>
                <div style={{ width: 960 }}>
                    <div className={styles.tableHead}>
                        <Typo className={styles.headlast} variant={"h5"}>
                            Распределение заявок по времени суток <IconTime />
                        </Typo>
                        <Tabs tabs={tabs3} value={currentTab3} onChange={setCurrentTab3}></Tabs>
                    </div>
                    <TimeDistributionChart data={dataHourly} total={totalRequests3} />
                </div>
                <div className={styles.headTable} style={{ marginTop: 40 }}>
                    <div style={{ width: 460 }}>
                        <div className={styles.tableHead}>
                            <Typo style={{ paddingBottom: 24 }} variant={"h5"}>
                                Нагруженность по участкам
                            </Typo>
                            <Tabs tabs={tabs1} value={currentTab1} onChange={setCurrentTab1}></Tabs>
                        </div>
                        <Table
                            data={dataCuDay}
                            noSticky={true}
                            columns={[
                                {
                                    name: "Участок",
                                    width: 109,
                                    render: (data) => (
                                        <Typo
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                            variant={"actionL"}
                                        >
                                            {data.CU}
                                        </Typo>
                                    ),
                                },
                                {
                                    name: "Количество заявок",
                                    width: 351,
                                    render: (data) => (
                                        <div className={styles.rowContainer}>
                                            <div className={styles.row}>
                                                {data.requests / totalRequests1 < 0.3 ? (
                                                    <div className={styles.lowRow}>
                                                        <div
                                                            style={{
                                                                /* minWidth: `${(data.requests / totalRequests1) * 100}%`,*/
                                                                width: `${(data.requests / totalRequests1) * 100}%`,
                                                                backgroundColor: "#DBE5FF",
                                                                borderRadius: "4px",
                                                                height: "100%",
                                                            }}
                                                        ></div>
                                                        <Typo
                                                            style={{
                                                                color: "#003EDE",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                            variant={"subheadL"}
                                                        >{`${((data.requests / totalRequests1) * 100).toFixed(1)}%`}</Typo>
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: `${(data.requests / totalRequests1) * 100}%`,
                                                            backgroundColor: "#DBE5FF",
                                                            borderRadius: "4px",
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typo
                                                            style={{
                                                                color: "#003EDE",
                                                                paddingLeft: "12px",
                                                            }}
                                                            variant={"subheadL"}
                                                        >{`${((data.requests / totalRequests1) * 100).toFixed(1)}%`}</Typo>
                                                    </div>
                                                )}
                                            </div>
                                            <Typo
                                                style={{
                                                    color: "#003EDE",
                                                    textAlign: "right",
                                                    width: 40,
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    alignItems: "center",
                                                }}
                                                variant={"actionL"}
                                            >
                                                {data.requests}
                                            </Typo>
                                        </div>
                                    ),
                                },
                            ]}
                        ></Table>
                    </div>
                    <div style={{ width: 460 }}>
                        <div className={styles.tableHead}>
                            <Typo style={{ paddingBottom: 24 }} variant={"h5"}>
                                Распределение по дням
                            </Typo>
                            <Tabs tabs={tabs2} value={currentTab2} onChange={setCurrentTab2}></Tabs>
                        </div>
                        <Table
                            data={dataWeeklyWeek}
                            noSticky={true}
                            columns={[
                                {
                                    name: "День недели",
                                    width: 109,
                                    render: (data) => <Typo variant={"actionL"}>{data.day}</Typo>,
                                },
                                {
                                    name: "Количество заявок",
                                    width: 351,
                                    render: (data) => (
                                        <div className={styles.rowContainer}>
                                            <div className={styles.row}>
                                                {data.requests / totalRequests2 < 0.3 ? (
                                                    <div className={styles.lowRow}>
                                                        <div
                                                            style={{
                                                                /* minWidth: `${(data.requests / totalRequests1) * 100}%`,*/
                                                                width: `${(data.requests / totalRequests2) * 100}%`,
                                                                backgroundColor: "#DBE5FF",
                                                                borderRadius: "4px",
                                                                height: "100%",
                                                            }}
                                                        ></div>
                                                        <Typo
                                                            style={{ color: "#003EDE" }}
                                                            variant={"subheadL"}
                                                        >{`${((data.requests / totalRequests2) * 100).toFixed(1)}%`}</Typo>
                                                    </div>
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: `${(data.requests / totalRequests1) * 100}%`,
                                                            backgroundColor: "#DBE5FF",
                                                            borderRadius: "4px",
                                                            height: "100%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Typo
                                                            style={{
                                                                color: "#003EDE",
                                                                paddingLeft: "12px",
                                                            }}
                                                            variant={"subheadL"}
                                                        >{`${((data.requests / totalRequests1) * 100).toFixed(1)}%`}</Typo>
                                                    </div>
                                                )}
                                            </div>
                                            <Typo
                                                style={{
                                                    color: "#003EDE",
                                                    textAlign: "right",
                                                    width: 40,
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    alignItems: "center",
                                                }}
                                                variant={"actionL"}
                                            >
                                                {data.requests}
                                            </Typo>
                                        </div>
                                    ),
                                },
                            ]}
                        ></Table>
                    </div>
                </div>

                <div className={styles.block} style={{ marginBottom: 100 }}>
                    <Typo style={{ marginBottom: 24 }} variant={"h5"}>
                        Распределение заявок по категориям пассажиров
                    </Typo>
                    <Tabs tabs={tabs4} value={currentTab4} onChange={setCurrentTab4}></Tabs>
                    <div className={styles.body}>
                        <PieChart
                            width={330}
                            height={330}
                            style={{ backgroundColor: "#FAFAFA", borderRadius: "8px" }}
                        >
                            <Pie
                                data={data01}
                                cx="50%"
                                cy="50%"
                                style={{ outline: "none" }}
                                labelLine={false}
                                onMouseEnter={onPieEnter}
                                onMouseLeave={onPieLeave}
                                onClick={() => {}}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {data01.map((_entry, index) => {
                                    return (
                                        <Cell
                                            /*stroke={data01[index].color}*/
                                            key={`cell-${index}`}
                                            fill={
                                                index !== currentPie
                                                    ? data01[index].color
                                                    : data01[index].hoverColor
                                            }
                                        />
                                    );
                                })}
                            </Pie>
                            <Tooltip
                                itemStyle={{ fontFamily: "Manrope", fontSize: 14, color: "white" }}
                                labelStyle={{ fontFamily: "Manrope", fontSize: 14, color: "white" }}
                                contentStyle={{
                                    borderRadius: 12,
                                    backgroundColor: "#070707",
                                    border: "none",
                                }}
                            />
                        </PieChart>
                        <div>
                            <Typo style={{ marginBottom: 20 }} variant={"subheadXL"}>
                                Категории
                            </Typo>
                            <div className={styles.healthArray}>
                                <div className={styles.column} style={{ width: 242 }}>
                                    {data01.slice(0, 6).map((item, index) => (
                                        <div className={styles.healthItem} key={item.name}>
                                            <div
                                                style={{ backgroundColor: `${item.color}` }}
                                                className={styles.cub}
                                            ></div>
                                            <div
                                                className={clsx(styles.text, {
                                                    [styles.active]: index === currentPie,
                                                })}
                                            >
                                                {item.name} (
                                                {((item.value / totalRequestsPie) * 100).toFixed(0)}
                                                %)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.column} style={{ width: 305 }}>
                                    {" "}
                                    {data01.slice(6).map((item, index) => (
                                        <div className={styles.healthItem} key={item.name}>
                                            <div
                                                style={{ backgroundColor: `${item.color}` }}
                                                className={styles.cub}
                                            ></div>
                                            <div
                                                className={clsx(styles.text, {
                                                    [styles.active]: index + 6 === currentPie,
                                                })}
                                            >
                                                {item.name} (
                                                {((item.value / totalRequestsPie) * 100).toFixed(0)}
                                                %)
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/*<Gant />*/}
        </AdminPageContentLayout>
    );
});

export default AnalyticsPage;
