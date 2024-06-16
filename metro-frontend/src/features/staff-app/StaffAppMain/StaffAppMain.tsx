import styles from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import TaskCard from "src/features/staff-app/TaskCardStaff/TaskCard.tsx";
import { store } from "src/app/AppStore.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import LunchCard from "src/features/staff-app/LunchCard/LunchCard.tsx";
import { useEffect, useState } from "react";

const StaffAppMain = observer(() => {
    useEffect(() => {
        store.employee.fetchAllEmployees();
    }, []);

    const confirmedRequests = store.request.requests
        .filter((request) => request.status === "CONFIRMED")
        .sort((a, b) => new Date(a.info.tripDate).getTime() - new Date(b.info.tripDate).getTime());

    function getTodayDateString(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    function filterRequestsForToday(requests: IRequest[]): IRequest[] {
        const todayString = getTodayDateString();
        return requests.filter((request) => request.info.tripDate.startsWith(todayString));
    }

    const confirmedTodayRequests = filterRequestsForToday(confirmedRequests);
    const currentUser = store.employee.getCurrentAuthenticatedEmployee();

    function getWeekDayRange(): string {
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay();
        if (currentUser) {
            switch (currentDayOfWeek) {
                case 1:
                    return currentUser?.timeLunch1 ?? "";
                case 2:
                    return currentUser?.timeLunch2 ?? "";
                case 3:
                    return currentUser?.timeLunch3 ?? "";
                case 4:
                    return currentUser?.timeLunch4 ?? "";
                case 5:
                    return currentUser?.timeLunch5 ?? "";
                case 6:
                    return currentUser?.timeLunch6 ?? "";
                default:
                    return currentUser?.timeLunch7 ?? "";
            }
        }
        return "";
    }

    const parseTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        const date = new Date();
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
        return date;
    };

    const lunchtime = /*getWeekDayRange()*/ "15:00-16:00";
    const [lunchStart, lunchEnd] = lunchtime ? lunchtime.split("-") : ["", ""];
    const lunchStartDate = lunchStart ? parseTime(lunchStart) : new Date();

    const stationsArray: any[] = [];
    let lunchCardAdded = false;
    let lunchIndex;
    const now = new Date();
    const showlunchTime = lunchStartDate > now;
    confirmedTodayRequests.forEach((request: IRequest, index) => {
        const requestDate = new Date(request.info.tripDate);
        const showLunch = !lunchCardAdded && lunchStartDate < requestDate;

        if (showLunch) {
            lunchIndex = index;
            stationsArray.push(
                (showlunchTime || index !== 0) && (
                    <div>
                        <div
                            key="lunch-header"
                            className={styles.header}
                            style={{ marginTop: index > 1 ? 12 : 28 }}
                        >
                            Обед
                        </div>

                        <LunchCard index={index} key="lunch-card" lunchTime={lunchtime} />
                        <div key="lunch-next" className={styles.header} style={{ marginBottom: 8 }}>
                            Следующие заявки
                        </div>
                    </div>
                ),
            );
            lunchCardAdded = true;
        }

        stationsArray.push(
            <TaskCard
                active={index === 0}
                key={request.number}
                number={request.number}
                startStation={request.info.arrivalStationId}
                endStation={request.info.departureStationId}
                date={request.info.tripDate}
                id={request.id}
                endDate={request.info.tripDateEnd}
            />,
        );
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>Ближайшая заявка</div>
            {lunchIndex === 0 ? stationsArray[1] : stationsArray[0]}
            {((lunchIndex !== 1 && lunchIndex !== 0) || !lunchIndex) && (
                <div className={styles.header}>Следующие заявки</div>
            )}
            {lunchIndex === 0 && stationsArray[0]}
            <div className={styles.stationsArray}>
                {lunchIndex === 0 ? stationsArray.slice(2) : stationsArray.slice(1)}
            </div>
        </div>
    );
});

export default StaffAppMain;
