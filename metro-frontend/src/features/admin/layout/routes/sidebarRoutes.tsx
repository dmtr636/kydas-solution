import {
    IconDistribution,
    IconDocument,
    IconHeart,
    IconHome,
    IconKey,
    IconNotification,
    IconQuestion,
    IconTime,
    IconStatistics,
    IconUser,
} from "src/ui/assets/icons";
import { SidebarRoute } from "src/ui/components/segments/Sidebar/Sidebar.types.ts";
import { store } from "src/app/AppStore.ts";

export const getSidebarRoutes = (): SidebarRoute[] => [
    {
        path: "/admin",
        name: "Главная",
        icon: <IconHome />,
    },
    {
        path: "/admin/notifications",
        name: "Уведомления",
        icon: <IconNotification />,
        counterValue: store.notification.sidebarCounter || undefined,
        end: false,
    },
    {
        path: "/admin/requests",
        name: "Заявки",
        icon: <IconDocument />,
        counterValue: store.request.newRequests.length || undefined,
        end: false,
    },
    {
        path: "/admin/distribution",
        name: "Распределение",
        icon: <IconDistribution />,
    },
    {
        path: "/admin/employees",
        name: "Инспекторы",
        icon: <IconUser />,
        end: false,
    },
    {
        path: "/admin/passengers",
        name: "Пассажиры",
        icon: <IconHeart />,
        end: false,
    },
    {
        path: "/admin/analytics",
        name: "Аналитика",
        icon: <IconStatistics />,
    },
    {
        path: "/admin/users",
        name: "Доступ в систему",
        icon: <IconKey />,
    },
];

export const getFooterSidebarRoutes = (): SidebarRoute[] => {
    const routes: SidebarRoute[] = [];
    routes.push({
        path: "/admin/events",
        name: "Журнал событий",
        icon: <IconTime />,
    });
    routes.push({
        path: "/admin/refs",
        name: "Справочники",
        icon: <IconQuestion />,
        children: [
            {
                path: "/admin/refs/stations",
                name: "Станции",
            },
            {
                path: "/admin/refs/drivingTime",
                name: "Время движения",
            },
            {
                path: "/admin/refs/transferTime",
                name: "Время пересадок",
            },
        ],
    });
    return routes;
};
