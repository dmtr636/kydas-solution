import { makeAutoObservable } from "mobx";
import axios from "axios";
import { GET_EMPLOYEES_ENDPOINT } from "src/shared/api/endpoints.ts";
import { store } from "src/app/AppStore.ts";

type Status = "CREATE_REQUEST" | "EDIT_REQUEST" | "CANCEL_REQUEST";

export class StaffAppStore {
    employees: any[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async fetchEmpolees() {
        const response = await axios.get(GET_EMPLOYEES_ENDPOINT);
        this.employees = [...response.data];
    }

    get notificationCount() {
        const allowedActions: Status[] = ["CREATE_REQUEST", "EDIT_REQUEST", "CANCEL_REQUEST"];

        function filterRequests(requests: any[], allowedActions: Status[]): any[] {
            return requests.filter((request) => allowedActions.includes(request.action));
        }

        const notifications = store.notification.notifications.filter((notification) =>
            store.request.requests.some((r) => r.id === notification.requestId),
        );
        const filteredRequests = filterRequests(notifications, allowedActions);
        const MessagesUnreaded = filteredRequests
            .sort((a, b) => b.createDate.localeCompare(a.createDate))
            .filter((n) => n.isRead === false);

        return MessagesUnreaded.length;
    }
}
