import { FilterChip } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { store } from "src/app/AppStore.ts";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { formatDate } from "src/shared/utils/date.ts";
import { notificationActions } from "src/features/admin/notifications/constants/notificationActions.ts";
import { INotification } from "src/features/admin/notifications/types/INotification.ts";
import { getFullName } from "src/shared/utils/getFullName.ts";

export const getNotificationFilterChips = () => {
    const chips: FilterChip[] = [];
    const filterValues = store.notification.filter.filterValues;

    if (filterValues["createDate"]) {
        chips.push({
            name: `Дата действий: ${formatDate(filterValues["createDate"])}`,
            value: "createDate",
            field: "createDate",
        });
    }

    if (filterValues["action"]?.length) {
        for (const v of filterValues["action"]) {
            chips.push({
                name: `Действие: ${notificationActions[v as INotification["action"]]}`,
                value: v,
                field: "action",
            });
        }
    }

    if (filterValues["status"]?.length) {
        for (const v of filterValues["status"]) {
            chips.push({
                name: `Статус: ${requestStatuses[v as IRequest["status"]]}`,
                value: v,
                field: "status",
            });
        }
    }

    if (filterValues["author"]) {
        const employee = store.employee.findByUserId(filterValues["author"]);
        const user = store.user.getById(filterValues["author"]);
        chips.push({
            name: `Автор: ${employee ? getFullName(employee) : user?.name ?? ""}`,
            value: "author",
            field: "author",
        });
    }

    if (filterValues["authorPassenger"]) {
        chips.push({
            name: `Только пассажиры`,
            value: "authorPassenger",
            field: "authorPassenger",
        });
    }

    return chips;
};
