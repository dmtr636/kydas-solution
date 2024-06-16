import { FilterChip } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { store } from "src/app/AppStore.ts";
import { getStationById } from "src/features/admin/requests/utils/stations.tsx";
import { getNameInitials } from "src/shared/utils/getFullName.ts";

export const getDistributionFilterChips = () => {
    const chips: FilterChip[] = [];
    const filterValues = store.distribution.filter.filterValues;

    if (filterValues["departureStation"]) {
        chips.push({
            name: `Станция отправления: ${getStationById(filterValues["departureStation"])?.name.split(",")[0]}`,
            value: "departureStation",
            field: "departureStation",
        });
    }
    if (filterValues["arrivalStation"]) {
        chips.push({
            name: `Станция прибытия: ${getStationById(filterValues["arrivalStation"])?.name.split(",")[0]}`,
            value: "arrivalStation",
            field: "arrivalStation",
        });
    }
    if (filterValues["assignedEmployee"]) {
        const employee = store.employee.findById(filterValues["assignedEmployee"]);
        chips.push({
            name: `Инспектор: ${getNameInitials(employee)}`,
            value: "assignedEmployee",
            field: "assignedEmployee",
        });
    }

    return chips;
};
