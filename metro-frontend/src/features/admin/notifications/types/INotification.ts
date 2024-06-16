import { IRequest } from "src/features/admin/requests/types/IRequest.ts";

export interface INotification {
    id: number;
    requestId: string;
    requestNumber: number;
    createDate: string;
    action:
        | "CREATE_REQUEST"
        | "COMPLETE_CONVOY"
        | "EDIT_REQUEST"
        | "CHANGE_STATUS"
        | "CHANGE_CONVOY_STATUS"
        | "CANCEL_REQUEST"
        | "CONFIRM_REQUEST"
        | "DELETE_REQUEST"
        | "INSPECTOR_DISPATCHED"
        | "INSPECTOR_ON_SITE"
        | "TRIP"
        | "PASSENGER_LATE"
        | "INSPECTOR_LATE"
        | "RESCHEDULE";
    status: IRequest["status"];
    convoyStatus: IRequest["convoyStatus"] | null;
    userId: number | null;
    isRead: boolean;
    message: string | null;
}
