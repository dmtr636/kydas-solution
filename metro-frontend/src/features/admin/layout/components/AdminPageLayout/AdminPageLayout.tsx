import styles from "./AdminPageLayout.module.scss";
import { Sidebar } from "src/ui/components/segments/Sidebar/Sidebar.tsx";
import { Logo } from "src/ui/assets/icons";
import {
    getFooterSidebarRoutes,
    getSidebarRoutes,
} from "src/features/admin/layout/routes/sidebarRoutes.tsx";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { store } from "src/app/AppStore.ts";
import { observer } from "mobx-react-lite";

const AdminPageLayout = observer(() => {
    useEffect(() => {
        store.request.fetchNew();
        store.notification.fetchAllNotifications();
        store.user.fetchUsers();
        store.employee.fetchAllEmployees();
        store.passengers.fetchAll();
        store.event.fetchAllEvents();
        store.adminLayout.fetchLayoutData();
        store.stations.fetchAllStations();
        store.stations.fetchAllStationDrivingTimes();
        store.stations.fetchAllStationTransferTimes();
        store.websocket.connectToSocket();

        return () => store.websocket.closeSocket();
    }, []);

    return (
        <div className={styles.layout}>
            <Sidebar
                logo={<Logo />}
                routes={getSidebarRoutes()}
                footerRoutes={getFooterSidebarRoutes()}
            />
            <Outlet />
        </div>
    );
});

export default AdminPageLayout;
