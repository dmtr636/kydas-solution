import { RouteObject } from "react-router-dom";

import { AppRoot } from "src/app/AppRoot.tsx";
import { HomePage } from "src/features/admin/home/pages/HomePage.tsx";
import { UsersPage } from "src/features/admin/users/pages/UsersPage.tsx";
import { LoginPageWrapper } from "src/features/auth/LoginPageWrapper.tsx";
import { NotificationsPage } from "src/features/admin/notifications/pages/NotificationsPage/NotificationsPage.tsx";
import { RequestsPage } from "src/features/admin/requests/pages/RequestsPage/RequestsPage.tsx";
import { RequestPage } from "src/features/request/pages/RequestPage/RequestPage.tsx";
import AdminPageLayout from "src/features/admin/layout/components/AdminPageLayout/AdminPageLayout.tsx";
import RequestInfoPage from "src/features/request/pages/RequestInfoPage/RequestInfoPage.tsx";
import { ErrorPage } from "src/ui/components/pages/ErrorPage/ErrorPage.tsx";
import { StaffAppPage } from "src/features/staff-app/pages/StaffAppPage/StaffAppPage.tsx";
import { RequestViewPage } from "src/features/admin/requests/pages/RequestViewPage/RequestViewPage.tsx";
import { RequestEditPage } from "src/features/admin/requests/pages/RequestEditPage/RequestEditPage.tsx";
import { RequestAddPage } from "src/features/admin/requests/pages/RequestAddPage/RequestAddPage.tsx";
import TaskPage from "src/features/staff-app/pages/TaskPage/TaskPage.tsx";
import { RequestHistoryPage } from "src/features/admin/requests/pages/RequestHistoryPage/RequestHistoryPage.tsx";
import StaffAppMain from "src/features/staff-app/StaffAppMain/StaffAppMain.tsx";
import StaffAppRequest from "src/features/staff-app/StaffAppRequest/StaffAppRequest.tsx";
import StaffAppMessages from "src/features/staff-app/Messages/StaffAppMessages.tsx";
import StaffProfile from "src/features/staff-app/StaffProfile/StaffProfile.tsx";
import { EmployeesPage } from "src/features/admin/employees/pages/EmployeesPage/EmployeesPage.tsx";
import { EmployeeViewPage } from "src/features/admin/employees/pages/EmpoyeeViewPage/EmployeeViewPage.tsx";
import { PassengersPage } from "src/features/admin/passengers/pages/PassengersPage";
import { DistributionPage } from "src/features/admin/distribution/pages/DistributionPage";
import { StationsPage } from "src/features/admin/refs/stations/pages/StationsPage";
import { DrivingTimePage } from "src/features/admin/refs/drivingTime/pages/DrivingTimePage";
import { TransferTimePage } from "src/features/admin/refs/transferTime/pages/TransferTimePage";
import { PassengerInfoPage } from "src/features/admin/passengers/pages/PassengerInfo/PassengerInfoPage.tsx";
import { PassengersEdit } from "src/features/admin/passengers/pages/PassengersEdit/PassengersEdit.tsx";
import { PassengerAdd } from "src/features/admin/passengers/pages/PassengerAdd/PassengerAdd.tsx";
import { EmployeeAddPage } from "src/features/admin/employees/pages/EmployeeAddPage/EmployeeAddPage.tsx";
import { EmployeeEditPage } from "src/features/admin/employees/pages/EmployeeEditPage/EmployeeEditPage.tsx";
import { EventsPage } from "src/features/admin/events/pages/EventsPage/EventsPage.tsx";
import AnalyticsPage from "src/features/admin/analytics/page/AnalyticsPage.tsx";

export const appRoutes: RouteObject[] = [
    {
        path: "/",
        element: <AppRoot />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/request/:id",
                element: <RequestInfoPage />,
            },
            {
                path: "/request",
                element: <RequestPage />,
            },
            {
                path: "/auth/login",
                element: <LoginPageWrapper />,
            },
            {
                path: "/staffapp",
                element: <StaffAppPage />,
                children: [
                    {
                        index: true,
                        element: <StaffAppMain />,
                    },
                    {
                        path: "/staffapp/requests",
                        element: <StaffAppRequest />,
                    },
                    {
                        path: "/staffapp/messages",
                        element: <StaffAppMessages />,
                    },
                    {
                        path: "/staffapp/user",
                        element: <StaffProfile />,
                    },
                ],
            },
            {
                path: "/staffapp/request/:id",
                element: <TaskPage />,
            },
            {
                path: "/admin",
                element: <AdminPageLayout />,
                children: [
                    {
                        index: true,
                        element: <HomePage />,
                    },
                    {
                        path: "/admin/notifications",
                        element: <NotificationsPage />,
                    },
                    {
                        path: "/admin/notifications/request/:id",
                        element: <RequestViewPage fromNotifications={true} />,
                    },
                    {
                        path: "/admin/requests",
                        element: <RequestsPage />,
                    },
                    {
                        path: "/admin/requests/:id",
                        element: <RequestViewPage />,
                    },
                    {
                        path: "/admin/requests/:id/history",
                        element: <RequestHistoryPage />,
                    },
                    {
                        path: "/admin/requests/:id/edit",
                        element: <RequestEditPage />,
                    },
                    {
                        path: "/admin/requests/add",
                        element: <RequestAddPage />,
                    },
                    {
                        path: "/admin/distribution",
                        element: <DistributionPage />,
                    },
                    {
                        path: "/admin/employees",
                        element: <EmployeesPage />,
                    },
                    {
                        path: "/admin/employees/:id",
                        element: <EmployeeViewPage />,
                    },
                    {
                        path: "/admin/employees/:id/edit",
                        element: <EmployeeEditPage />,
                    },
                    {
                        path: "/admin/employees/add",
                        element: <EmployeeAddPage />,
                    },
                    {
                        path: "/admin/passengers",
                        element: <PassengersPage />,
                    },
                    {
                        path: "/admin/passengers/:id",
                        element: <PassengerInfoPage />,
                    },
                    {
                        path: "/admin/passengers/:id/edit",
                        element: <PassengersEdit />,
                    },
                    {
                        path: "/admin/passengers/add",
                        element: <PassengerAdd />,
                    },
                    {
                        path: "/admin/users",
                        element: <UsersPage />,
                    },
                    {
                        path: "/admin/analytics",
                        element: <AnalyticsPage />,
                    },
                    {
                        path: "/admin/refs/stations",
                        element: <StationsPage />,
                    },
                    {
                        path: "/admin/refs/drivingTime",
                        element: <DrivingTimePage />,
                    },
                    {
                        path: "/admin/refs/transferTime",
                        element: <TransferTimePage />,
                    },
                    {
                        path: "/admin/events",
                        element: <EventsPage />,
                    },
                ],
            },
        ],
    },
];
