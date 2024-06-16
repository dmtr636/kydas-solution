import { makeAutoObservable } from "mobx";
import { LoaderStore } from "src/shared/stores/LoaderStore.ts";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { DISTRIBUTION_ENDPOINT } from "src/shared/api/endpoints.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { store } from "src/app/AppStore.ts";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import dayjs from "dayjs";

export class DistributionStore {
    loader = new LoaderStore();
    apiClient = new ApiClient();
    tab = "assigned";
    filter = new FilterStore({ defaultSort: "tripDate-asc" });

    constructor() {
        makeAutoObservable(this);
    }

    async plannedDistribution(tripDate: string) {
        this.loader.start();
        const res = await this.apiClient.post(
            `${DISTRIBUTION_ENDPOINT}/planned?tripDate=${tripDate}`,
        );
        if (res.status) {
            snackbarStore.showPositiveSnackbar("Выполнено плановое распределение");
            store.request.requests = store.request.requests.filter(
                (r) => new Date(r.info.tripDate).toLocaleDateString() !== store.request.date,
            );
            store.request.fetchAll();
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось выполнить распределение");
        }
        this.loader.finish();
    }

    async adaptiveDistribution() {
        this.loader.start();
        const res = await this.apiClient.post(
            `${DISTRIBUTION_ENDPOINT}/planned?adaptive=1&tripDate=${store.request.date}`,
        );
        if (res.status) {
            snackbarStore.showPositiveSnackbar("Выполнено адаптивное распределение");
            store.request.requests = store.request.requests.filter(
                (r) => new Date(r.info.tripDate).toLocaleDateString() !== store.request.date,
            );
            store.request.fetchAll();
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось выполнить распределение");
        }
        this.loader.finish();
    }

    get filteredRequests() {
        let requests = this.filterByTab(this.tab);
        requests = this.sortRequests(requests);
        return requests;
    }

    sortRequests(requests: IRequest[]) {
        switch (this.filter.sort) {
            case "tripDate-asc":
                return requests.sort((a, b) => a.info.tripDate.localeCompare(b.info.tripDate));
            case "tripDate-desc":
                return requests.sort((a, b) => b.info.tripDate.localeCompare(a.info.tripDate));
        }
        return requests;
    }

    filterByTab(tab: string) {
        let requests = this.filterRequests(store.request.requests, this.filter.filterValues);
        requests = requests.filter((r) => r.status === "CONFIRMED" || r.status === "WAITING_LIST");
        if (tab === "assigned") {
            return requests.filter(
                (r) =>
                    r.assignedEmployees?.length ===
                        (r.inspectorMaleCount ?? 0) + (r.inspectorFemaleCount ?? 0) &&
                    !store.notification.rescheduleNotifications.some((n) => n.requestId === r.id),
            );
        }
        if (tab == "notAssigned") {
            return requests.filter(
                (r) =>
                    r.assignedEmployees?.length !==
                        (r.inspectorMaleCount ?? 0) + (r.inspectorFemaleCount ?? 0) &&
                    !store.notification.rescheduleNotifications.some((n) => n.requestId === r.id),
            );
        }
        if (tab === "reschedule") {
            return requests.filter((r) =>
                store.notification.rescheduleNotifications.some((n) => n.requestId === r.id),
            );
        }
        return requests;
    }

    filterRequests(requests: IRequest[], filter: Record<string, any>) {
        if (this.filter.search) {
            requests = requests.filter((r) =>
                this.filter.ilikeSearch(r.number, (searchValue) =>
                    searchValue.replace("m", "").replace("м", "").replace("-", ""),
                ),
            );
            return requests;
        }
        if (store.request.date) {
            requests = requests.filter(
                (r) =>
                    new Date(r.info.tripDate).toLocaleDateString() ===
                    dayjs(store.request.date, "DD.MM.YYYY").toDate().toLocaleDateString(),
            );
        }
        if (filter["departureStation"]) {
            requests = requests.filter(
                (r) => r.info.departureStationId === filter["departureStation"],
            );
        }
        if (filter["arrivalStation"]) {
            requests = requests.filter((r) => r.info.arrivalStationId === filter["arrivalStation"]);
        }
        if (filter["assignedEmployee"]) {
            requests = requests.filter((r) =>
                r.assignedEmployees?.some((e) => e.employeeId === filter["assignedEmployee"]),
            );
        }
        return requests;
    }
}
