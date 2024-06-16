import { INotification } from "src/features/admin/notifications/types/INotification.ts";
import { makeAutoObservable } from "mobx";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { LoaderStore } from "src/shared/stores/LoaderStore.ts";
import { NOTIFICATIONS_ENDPOINT } from "src/shared/api/endpoints.ts";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { store } from "src/app/AppStore.ts";

export class NotificationStore {
    notifications: INotification[] = [];
    apiClient = new ApiClient();
    loader = new LoaderStore();
    filter = new FilterStore({ defaultSort: "createDate-desc" });
    tab = "late";

    constructor() {
        makeAutoObservable(this);
    }

    get rescheduleNotifications() {
        return this.notifications.filter((n) => n.action === "RESCHEDULE");
    }

    async fetchAllNotifications() {
        this.loader.start();
        const result = await this.apiClient.get<INotification[]>(NOTIFICATIONS_ENDPOINT);
        if (result.status) {
            this.notifications = result.data;
        }
        this.loader.finish();
    }

    async readAll() {
        this.loader.start();
        const result = await this.apiClient.post(NOTIFICATIONS_ENDPOINT + "/readAll");
        if (result.status) {
            this.notifications.forEach((n) => (n.isRead = true));
        }
        this.loader.finish();
        return result;
    }

    async updateNotification(notification: INotification) {
        this.loader.start();
        const result = await this.apiClient.put<INotification>(
            NOTIFICATIONS_ENDPOINT,
            notification,
        );
        if (result.status) {
            this.notifications = this.notifications.map((n) =>
                n.id === result.data.id ? result.data : n,
            );
        }
        this.loader.finish();
        return result;
    }

    async createNotification(notification: Partial<INotification>) {
        this.loader.start();
        await this.apiClient.post<INotification>(NOTIFICATIONS_ENDPOINT, notification);
        this.loader.finish();
    }

    getNotificationsByRequestId(requestId: string) {
        return this.sortNotifications(
            this.notifications
                .filter((notification) => notification.requestId === requestId)
                .filter((log, index, self) => {
                    if (index === 0) return true;
                    const prevLog = self[index - 1];
                    return !(
                        prevLog.convoyStatus === "TRIP" &&
                        prevLog.requestId === log.requestId &&
                        prevLog.action === log.action &&
                        prevLog.status === log.status &&
                        prevLog.convoyStatus === log.convoyStatus &&
                        prevLog.userId === log.userId
                    );
                }),
        );
    }

    get filteredNotifications() {
        let notifications = this.filterNotifications(this.filter.filterValues);
        notifications = this.sortNotifications(notifications);
        return notifications;
    }

    getFilteredNotificationsForEvents() {
        let notifications = this.filterNotifications(this.filter.filterValues, false).filter(
            (log, index, self) => {
                if (index === 0) return true;
                const prevLog = self[index - 1];
                return !(
                    prevLog.convoyStatus === "TRIP" &&
                    prevLog.requestId === log.requestId &&
                    prevLog.action === log.action &&
                    prevLog.status === log.status &&
                    prevLog.convoyStatus === log.convoyStatus &&
                    prevLog.userId === log.userId
                );
            },
        );
        notifications = this.sortNotifications(notifications);
        return notifications;
    }

    get requiredAttentionNotifications() {
        return [
            ...this.filterByTab(this.notifications, "late"),
            ...this.filterByTab(this.notifications, "reschedule"),
            ...this.filterByTab(this.notifications, "cancel"),
        ];
    }

    get sidebarCounter() {
        return this.requiredAttentionNotifications.length;
    }

    get requiredAttentionFilteredNotifications() {
        return this.filterByTab(this.filteredNotifications, "requireAttention");
    }

    filterNotifications(filter: Record<string, any>, filterByTab = true) {
        let notifications = this.notifications.slice();

        if (filterByTab) {
            notifications = this.filterByTab(notifications, this.tab).slice();
        }

        if (this.filter.search) {
            notifications = notifications.filter((r) =>
                this.filter.ilikeSearch(r.requestNumber, (searchValue) =>
                    searchValue.replace("m", "").replace("м", "").replace("-", ""),
                ),
            );
        }

        if (filter["createDate"]) {
            notifications = notifications.filter(
                (n) =>
                    new Date(n.createDate).toLocaleDateString() ===
                    new Date(filter["createDate"]).toLocaleDateString(),
            );
        }
        if (filter["action"]?.length) {
            notifications = notifications.filter((n) => {
                const values = filter["action"];
                return values.includes(n.action);
            });
        }
        if (filter["status"]?.length) {
            notifications = notifications.filter((n) => {
                const values = filter["status"];
                return values.includes(n.status);
            });
        }
        if (filter["author"]) {
            notifications = notifications.filter((n) => n.userId === filter["author"]);
        }

        if (filter["authorPassenger"]) {
            notifications = notifications.filter((n) => {
                return !n.userId;
            });
        }

        return notifications;
    }

    filterByTab(notifications: INotification[], tab: NotificationStore["tab"]) {
        switch (tab) {
            case "read":
                return notifications.filter(
                    (n) =>
                        (n.action === "INSPECTOR_LATE" ||
                            n.action === "PASSENGER_LATE" ||
                            n.action === "CANCEL_REQUEST") &&
                        n.userId !== store.account.currentUser?.id,
                );
            case "late":
                return notifications.filter(
                    (n) =>
                        !n.isRead &&
                        (n.action === "INSPECTOR_LATE" || n.action === "PASSENGER_LATE") &&
                        n.userId !== store.account.currentUser?.id,
                );
            case "cancel":
                return notifications.filter(
                    (n) =>
                        !n.isRead &&
                        n.action === "CANCEL_REQUEST" &&
                        n.userId !== store.account.currentUser?.id,
                );
            case "reschedule":
                return notifications.filter(
                    (n) =>
                        !n.isRead &&
                        n.action === "RESCHEDULE" &&
                        n.userId !== store.account.currentUser?.id,
                );
        }

        return notifications;
    }

    sortNotifications(notifications: INotification[]) {
        switch (this.filter.sort) {
            case "createDate-asc":
                return notifications.sort((a, b) => a.createDate.localeCompare(b.createDate));
            case "createDate-desc":
                return notifications.sort((a, b) => b.createDate.localeCompare(a.createDate));
        }
        return notifications;
    }

    findById(id: number) {
        return this.notifications.find((n) => n.id === id);
    }
}
