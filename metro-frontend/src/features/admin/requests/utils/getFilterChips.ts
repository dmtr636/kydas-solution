import { FilterChip } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { store } from "src/app/AppStore.ts";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { getStationById } from "src/features/admin/requests/utils/stations.tsx";
import { formatDate } from "src/shared/utils/date.ts";
import { getNameInitials } from "src/shared/utils/getFullName.ts";
import healthArray from "src/features/request/healthArray.ts";

export const getFilterChips = () => {
    const chips: FilterChip[] = [];
    const filterValues = store.request.filter.filterValues;
    if (filterValues["status"]?.length) {
        for (const v of filterValues["status"]) {
            chips.push({
                name: `Статус: ${requestStatuses[v as IRequest["status"]]}`,
                value: v,
                field: "status",
            });
        }
    }
    if (filterValues["fullName"]) {
        chips.push({
            name: `ФИО: ${filterValues["fullName"]}`,
            value: "fullName",
            field: "fullName",
        });
    }
    if (filterValues["email"]) {
        chips.push({
            name: `Почта: ${filterValues["email"]}`,
            value: "email",
            field: "email",
        });
    }
    if (filterValues["phone"]) {
        chips.push({
            name: `Телефон: ${filterValues["phone"]}`,
            value: "phone",
            field: "phone",
        });
    }

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
    if (filterValues["tripDate"]) {
        chips.push({
            name: `Дата поездки: ${formatDate(filterValues["tripDate"])}`,
            value: "tripDate",
            field: "tripDate",
        });
    }

    if (filterValues["meetingPoint"]?.length) {
        for (const v of filterValues["meetingPoint"]) {
            chips.push({
                name: `Место встречи: ${v}`,
                value: v,
                field: "meetingPoint",
            });
        }
    }
    if (filterValues["wheelchairRequired"]?.length) {
        for (const v of filterValues["wheelchairRequired"]) {
            chips.push({
                name: `Кресло-коляска: ${v ? "Требуется" : "Не требуется"}`,
                value: v,
                field: "wheelchairRequired",
            });
        }
    }

    if (filterValues["group"]?.length) {
        for (const v of filterValues["group"]) {
            chips.push({
                name: `Категория: ${healthArray.find((i) => i.value === v)?.name}`,
                value: v,
                field: "group",
            });
        }
    }

    if (filterValues["hasCarriage"]?.length) {
        for (const v of filterValues["hasCarriage"]) {
            chips.push({
                name: `Коляска: ${v ? "Имеется" : "Отсутствует"}`,
                value: v,
                field: "hasCarriage",
            });
        }
    }

    if (filterValues["hasBaggage"]?.length) {
        for (const v of filterValues["hasBaggage"]) {
            chips.push({
                name: `Багаж: ${v ? "Имеется" : "Отсутствует"}`,
                value: v,
                field: "hasBaggage",
            });
        }
    }

    if (filterValues["lightBaggage"]) {
        chips.push({
            name: `Тип груза: лёгкий груз`,
            value: "lightBaggage",
            field: "lightBaggage",
        });
    }

    if (filterValues["mediumBaggage"]) {
        chips.push({
            name: `Тип груза: средний груз`,
            value: "mediumBaggage",
            field: "mediumBaggage",
        });
    }

    if (filterValues["hasBaggageDescription"]) {
        chips.push({
            name: `Тип груза: другое`,
            value: "hasBaggageDescription",
            field: "hasBaggageDescription",
        });
    }

    if (filterValues["baggageDescription"]) {
        chips.push({
            name: `Описание груза: ${filterValues["baggageDescription"]}`,
            value: "baggageDescription",
            field: "baggageDescription",
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
