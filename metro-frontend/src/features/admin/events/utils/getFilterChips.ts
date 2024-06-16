import { FilterChip } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { store } from "src/app/AppStore.ts";
import { formatDate } from "src/shared/utils/date.ts";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { eventsLocaleActions } from "src/features/admin/events/utils/eventsLocale.ts";

export const getEventFilterChips = () => {
    const chips: FilterChip[] = [];
    const filterValues = store.event.filter.filterValues;

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
                name: `Действие: ${eventsLocaleActions[v as keyof typeof eventsLocaleActions]}`,
                value: v,
                field: "action",
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

    return chips;
};
