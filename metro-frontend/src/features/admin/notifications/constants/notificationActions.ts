import { INotification } from "src/features/admin/notifications/types/INotification.ts";

export const notificationActions: Record<INotification["action"], string> = {
    CREATE_REQUEST: "Зарегистрировал заявку",
    COMPLETE_CONVOY: "Завершил сопровождение",
    EDIT_REQUEST: "Изменил информацию",
    CONFIRM_REQUEST: "Подтвердил заявку",
    CHANGE_STATUS: "Установил статус",
    CHANGE_CONVOY_STATUS: "Установил статус сопровождения",
    INSPECTOR_DISPATCHED: "Инспектор выехал",
    INSPECTOR_ON_SITE: "Инспектор на месте",
    TRIP: "Начал сопровождение",
    PASSENGER_LATE: "Пассажир опаздывает",
    INSPECTOR_LATE: "Инспектор опаздывает",
    CANCEL_REQUEST: "Отменил заявку",
    DELETE_REQUEST: "Удалил заявку",
    RESCHEDULE: "Нужно перенести",
};
