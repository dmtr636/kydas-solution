import { makeAutoObservable } from "mobx";

import { ApiClient } from "src/shared/api/ApiClient.ts";
import { LoaderStore } from "src/shared/stores/LoaderStore.ts";
import { GET_PASSAGENS_ENDPOINT } from "src/shared/api/endpoints.ts";
import { requestTabs } from "src/features/admin/requests/constants/requestTabs.ts";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import dayjs from "dayjs";
import { throttle } from "src/shared/utils/throttle.ts";
import { IPassengerTypes } from "src/features/admin/passengers/utils/passengerTypes.ts";
import { getFullName } from "src/shared/utils/getFullName.ts";

export class PassengerStore {
    requests: IPassengerTypes[] = [];
    requestsSearch: IPassengerTypes[] = [];
    request: IPassengerTypes | null = null;
    requestForm: IPassengerTypes | null = null;
    apiClient = new ApiClient();
    loader = new LoaderStore();
    filter = new FilterStore({ defaultSort: "fullName-asc" });
    tab: keyof typeof requestTabs = "all";
    date = dayjs().toDate().toLocaleDateString();
    confirmLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    /* async fetchNew() {
         const newRequests = await this.apiClient.post<IPassengerTypes[]>(ADMIN_REQUESTS_FILTER_ENDPOINT, {
             limit: 1000,
             offset: 0,
             filter: {
                 status: "NEW"
             }
         });
         if (newRequests.status) {
             this.setRequests(newRequests.data);
         }
     }*/

    fetchAll = throttle(async () => {
        this.loader.start();
        const result = await this.apiClient.get<IPassengerTypes[]>(GET_PASSAGENS_ENDPOINT);
        if (result.status) {
            this.setRequests([...result.data]);
        }

        this.loader.finish();
    }, 100);

    async fetchById(id: string) {
        this.loader.start();
        const result = await this.apiClient.get<IPassengerTypes>(`${GET_PASSAGENS_ENDPOINT}/${id}`);
        if (result.status) {
            this.setRequest(result.data);
        }
        this.loader.finish();
    }

    async updateRequest(newRequest: IPassengerTypes, showSnackbar = true) {
        if (showSnackbar) {
            this.loader.start();
        }
        const result = await this.apiClient.put<IPassengerTypes>(
            GET_PASSAGENS_ENDPOINT,
            newRequest,
        );
        if (result.status) {
            this.setRequest(result.data);
            if (showSnackbar) {
                snackbarStore.showPositiveSnackbar("Изменения сохранены");
            }
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось сохранить изменения");
        }
        this.loader.finish();
        return result;
    }

    async createRequest(newRequest: IPassengerTypes) {
        this.loader.start();
        const result = await this.apiClient.post<IPassengerTypes>(
            GET_PASSAGENS_ENDPOINT,
            newRequest,
        );
        if (result.status) {
            this.setRequest(result.data);
            snackbarStore.showPositiveSnackbar("Пассажир добавлен");
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось добавить пассажира");
        }
        this.loader.finish();
        return result;
    }

    async deleteRequest(request: IPassengerTypes, onDelete: () => void) {
        this.loader.start();
        const result = await this.apiClient.delete(GET_PASSAGENS_ENDPOINT, request.id);
        if (result.status) {
            snackbarStore.showPositiveSnackbar("Пассажир удален");
            this.request = null;
            onDelete();
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось удалить пассажира");
        }
        this.loader.finish();
    }

    get filteredRequests() {
        let requests = this.filterRequests(this.filter.filterValues);

        requests = this.sortRequests(requests);
        if (this.filter.search) {
            requests = requests.filter(
                (e) =>
                    e.fullName.toLowerCase().includes(this.filter.search.toLowerCase()) ||
                    e.phone.includes(this.filter.search),
            );
        }

        return requests;
    }

    get isFormValid() {
        const form = this.requestForm;
        return form?.fullName && form.phone && form.groupId && form.age;
    }

    filterRequests(filter: Record<string, any>) {
        let requests = this.requests.slice();

        /*if (this.filter.search) {
            requests = this.requestsSearch.slice();
        }*/

        if (filter["fullName"]) {
            requests = requests.filter((r) => this.filter.ilike(r.fullName, filter["fullName"]));
        }

        if (filter["pacemaker"]) {
            requests = requests.filter((r) => this.filter.ilike(r.pacemaker, filter["pacemaker"]));
        }

        if (filter["group"]?.length) {
            requests = requests.filter((r) => {
                const values = filter["group"];
                return values.includes(r.groupId);
            });
        }

        return requests;
    }

    sortRequests(requests: IPassengerTypes[]) {
        switch (this.filter.sort) {
            case "fullName-asc":
                return requests.sort((a, b) => a.fullName.localeCompare(b.fullName));
            case "fullName-desc":
                return requests.sort((a, b) => b.fullName.localeCompare(a.fullName));
        }
        return requests;
    }

    /*filterByTab(tab: PassengerStore["tab"]) {
        switch (tab) {
            case "all":
                return this.requests;
            case "new":
                return this.requests.filter((r) => r.status === "NEW");
            case "confirmed":
                return this.requests.filter((r) => r.status === "CONFIRMED");
            case "archive":
                return this.requests.filter(
                    (r) => r.status === "COMPLETED" || r.status === "CANCELED",
                );
            case "waitingList":
                return [];
        }
    }*/

    /* findById(id: string) {
         return this.requests.find((r) => r.id === id);
     }*/

    setRequests(requests: IPassengerTypes[]) {
        this.requests = requests;
    }

    setRequest(request: IPassengerTypes | null) {
        this.request = request;
    }

    pushRequest(request: IPassengerTypes[]) {
        this.requests.push(...request);
    }

    setTab(tab: PassengerStore["tab"]) {
        this.tab = tab;
    }

    clearRequest() {
        this.loader.finish();
        this.setRequest(null);
    }
}
