import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles.module.scss";
import { clsx } from "clsx";
import TaskCard from "src/features/staff-app/TaskCardStaff/TaskCard.tsx";
import { store } from "src/app/AppStore.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { observer } from "mobx-react-lite";

function resetTime(date: Date) {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
}

function getDifferenceInDays(date1: Date, date2: Date) {
    const timeDifference = date2.getTime() - date1.getTime();
    return timeDifference / (1000 * 3600 * 24);
}

const StaffAppRequest = observer(() => {
    const [activeday, setActiveday] = useState<string>("today");
    const formatDate = (date: Date) => {
        return date.toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    };
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(today.getDate() + 2);
    const todayRef = useRef<HTMLButtonElement | null>(null);
    const tomorrowRef = useRef<HTMLButtonElement | null>(null);
    const dayAfterTomorrowRef = useRef<HTMLButtonElement | null>(null);
    useEffect(() => {
        if (activeday === "today" && todayRef.current) {
            todayRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        } else if (activeday === "tomorrow" && tomorrowRef.current) {
            tomorrowRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        } else if (activeday === "lastday" && dayAfterTomorrowRef.current) {
            dayAfterTomorrowRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }
    }, [activeday]);

    function sortByTripDate(array: IRequest[]): IRequest[] {
        return array
            .slice()
            .sort(
                (a, b) => new Date(a.info.tripDate).getTime() - new Date(b.info.tripDate).getTime(),
            );
    }

    const confirmedRequests = sortByTripDate(store.request.requests).filter(
        (request) => request.status === "CONFIRMED",
    );
    /*    const requestArray = confirmedRequests.map((request: IRequest) => (
            <TaskCard
                key={request.id}
                number={request.number}
                startStation={request.info.arrivalStationId}
                endStation={request.info.departureStationId}
                date={request.info.tripDate}
                id={request.id}
                endDate={request.info.tripDateEnd}
                /!*tripTime={request.}*!/
            />
        ));*/
    const todayT = useMemo(() => resetTime(new Date()), []);

    const { todayTasks, tomorrowTasks, dayAfterTomorrowTasks } = useMemo(() => {
        const todayTasks: IRequest[] = [];
        const tomorrowTasks: IRequest[] = [];
        const dayAfterTomorrowTasks: IRequest[] = [];

        confirmedRequests.forEach((station) => {
            const tripDate = new Date(station.info.tripDate);
            const dayDifference = getDifferenceInDays(todayT, resetTime(tripDate));

            if (dayDifference === 0) {
                todayTasks.push(station);
            } else if (dayDifference === 1) {
                tomorrowTasks.push(station);
            } else if (dayDifference === 2) {
                dayAfterTomorrowTasks.push(station);
            }
        });

        return { todayTasks, tomorrowTasks, dayAfterTomorrowTasks };
    }, [confirmedRequests, today]);
    const requestArrayToday = todayTasks.map((request: IRequest) => (
        <TaskCard
            key={request.id}
            number={request.number}
            startStation={request.info.arrivalStationId}
            endStation={request.info.departureStationId}
            date={request.info.tripDate}
            id={request.id}
            endDate={request.info.tripDateEnd}
            /*tripTime={request.}*/
        />
    ));
    const requestArrayTommorow = tomorrowTasks.map((request: IRequest) => (
        <TaskCard
            key={request.id}
            number={request.number}
            startStation={request.info.arrivalStationId}
            endStation={request.info.departureStationId}
            date={request.info.tripDate}
            id={request.id}
            endDate={request.info.tripDateEnd}
            /*tripTime={request.}*/
        />
    ));
    const requestArrayLastToday = dayAfterTomorrowTasks.map((request: IRequest) => (
        <TaskCard
            key={request.id}
            number={request.number}
            startStation={request.info.arrivalStationId}
            endStation={request.info.departureStationId}
            date={request.info.tripDate}
            id={request.id}
            endDate={request.info.tripDateEnd}
            /*tripTime={request.}*/
        />
    ));
    return (
        <div className={styles.container}>
            <div className={styles.datePicker}>
                <button
                    onClick={() => setActiveday("today")}
                    ref={todayRef}
                    className={clsx(styles.today, { [styles.active]: activeday === "today" })}
                >
                    Сегодня, {formatDate(today)}
                </button>
                <div
                    className={clsx(styles.divider, {
                        [styles.active]: activeday === "today" || activeday === "tomorrow",
                    })}
                ></div>
                <button
                    onClick={() => setActiveday("tomorrow")}
                    ref={tomorrowRef}
                    className={clsx(styles.tomorrow, { [styles.active]: activeday === "tomorrow" })}
                >
                    Завтра, {formatDate(tomorrow)}
                </button>
                <div
                    className={clsx(styles.divider, {
                        [styles.active]: activeday === "lastday" || activeday === "tomorrow",
                    })}
                ></div>

                <button
                    onClick={() => setActiveday("lastday")}
                    ref={dayAfterTomorrowRef}
                    className={clsx(styles.lastday, { [styles.active]: activeday === "lastday" })}
                >
                    Послезавтра, {formatDate(dayAfterTomorrow)}
                </button>
            </div>
            <div className={styles.taskBlock}>
                {activeday === "today" && requestArrayToday}
                {activeday === "tomorrow" && requestArrayTommorow}
                {activeday === "lastday" && requestArrayLastToday}
            </div>
        </div>
    );
});

export default StaffAppRequest;
