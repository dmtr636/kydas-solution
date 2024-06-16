import styles from "./StaffAppPage.module.scss";
import { observer } from "mobx-react-lite";
import StaffAppFooter from "src/features/staff-app/Footer/StaffAppFooter.tsx";
import StaffAppHeader from "src/features/staff-app/Header/StaffAppHeader.tsx";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { store } from "src/app/AppStore.ts";
import { Helmet } from "react-helmet";

export const StaffAppPage = observer(() => {
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

    function getTomorrow(): string {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return formatDate(tomorrow);
    }

    function getDayAfterTomorrow(): string {
        const dayAfterTomorrow = new Date();
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        return formatDate(dayAfterTomorrow);
    }

    const todayDate = getToday();
    const tomorrowDate = getTomorrow();
    const dayAfterTomorrowDate = getDayAfterTomorrow();
    const location = useLocation();
    const currentPath = location.pathname;
    const currentUser =
        store.employee.employees && store.employee.getCurrentAuthenticatedEmployee();
    useEffect(() => {
        store.employee.fetchAllEmployees();
        store.notification.fetchAllNotifications();
        store.websocket.connectToSocket();

        store.user.fetchUsers();
        store.request.requests = [];
        if (currentUser?.id) {
            store.request.fetchPushAllByFilter({
                tripDate: todayDate,
                employeeId: currentUser?.id,
            });
            store.request.fetchPushAllByFilter({
                tripDate: tomorrowDate,
                employeeId: currentUser?.id,
            });
            store.request.fetchPushAllByFilter({
                tripDate: dayAfterTomorrowDate,
                employeeId: currentUser?.id,
            });
        }
        return () => store.websocket.closeSocket();
    }, [currentUser?.id]);

    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const [height, setHeight] = useState(window.innerHeight);

    return (
        <div className={styles.Mockupcontainer} style={{ height: height }}>
            <Helmet>
                <title>Приложение инспектора</title>
            </Helmet>
            <div className={styles.mockup}>
                <div className={styles.container}>
                    <StaffAppHeader currentPath={currentPath} />
                    <div className={styles.content}>
                        <Outlet />
                    </div>

                    <StaffAppFooter currentPath={currentPath} />
                </div>
            </div>
        </div>
    );
});
