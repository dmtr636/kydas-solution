import { FilterChip } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { store } from "src/app/AppStore.ts";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { getStationById } from "src/features/admin/requests/utils/stations.tsx";
import { formatDate } from "src/shared/utils/date.ts";
import healthArray from "src/features/request/healthArray.ts";

export const filterPassengersChip = () => {
    const chips: FilterChip[] = [];
    const filterValues = store.passengers.filter.filterValues;

    if (filterValues["group"]?.length) {
        for (const v of filterValues["group"]) {
            chips.push({
                name: `Категория: ${healthArray.find((e) => e.value === v)?.name}`,
                value: v,
                field: "group",
            });
        }
    }

    if (filterValues["pacemaker"]) {
        for (const v of filterValues["pacemaker"]) {
            chips.push({
                name: `ЭКГ: ${v ? "Имеется" : "Отсутствует"}`,
                value: v,
                field: "pacemaker",
            });
        }
    }

    return chips;
};
