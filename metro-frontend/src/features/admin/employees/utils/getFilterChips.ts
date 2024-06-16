import { FilterChip } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { store } from "src/app/AppStore.ts";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { employeeStatuses } from "src/features/admin/employees/constants/employeeStatuses.ts";
import { getStationById } from "src/features/admin/requests/utils/stations.tsx";

export const getEmployeeFilterChips = () => {
    const chips: FilterChip[] = [];
    const filterValues = store.employee.filter.filterValues;

    if (filterValues["status"]?.length) {
        for (const v of filterValues["status"]) {
            chips.push({
                name: `Статус: ${employeeStatuses[v as keyof typeof employeeStatuses]}`,
                value: v,
                field: "status",
            });
        }
    }

    if (filterValues["date"]) {
        chips.push({
            name: `Дата: ${formatDate(filterValues["date"])} / ${formatTime(filterValues["date"])}`,
            value: "date",
            field: "date",
        });
    }

    if (filterValues["hasActiveRequest"]?.length) {
        for (const v of filterValues["hasActiveRequest"]) {
            chips.push({
                name: `Активная заявка: ${v ? "Имеется" : "Отсутствует"}`,
                value: v,
                field: "hasActiveRequest",
            });
        }
    }

    if (filterValues["location"]) {
        chips.push({
            name: `Местоположение: ${getStationById(filterValues["location"])?.name}`,
            value: "location",
            field: "location",
        });
    }

    if (filterValues["area"]?.length) {
        for (const v of filterValues["area"]) {
            chips.push({
                name: `Участок: ${v}`,
                value: v,
                field: "area",
            });
        }
    }

    if (filterValues["tags"]?.length) {
        for (const v of filterValues["tags"]) {
            chips.push({
                name: `Параметр: ${v}`,
                value: v,
                field: "tags",
            });
        }
    }

    return chips;
};
