import { makeAutoObservable } from "mobx";
import { IRequest } from "../types/IRequest.ts";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { LoaderStore } from "src/shared/stores/LoaderStore.ts";
import {
    ADMIN_REQUESTS_CANCEL_ENDPOINT,
    ADMIN_REQUESTS_CONFIRM_ENDPOINT,
    ADMIN_REQUESTS_ENDPOINT,
    ADMIN_REQUESTS_FILTER_ENDPOINT,
} from "src/shared/api/endpoints.ts";
import { requestTabs } from "src/features/admin/requests/constants/requestTabs.ts";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import dayjs from "dayjs";
import { throttle } from "src/shared/utils/throttle.ts";

export class RequestStore {
    requests: IRequest[] = [];
    requestsSearch: IRequest[] = [];
    request: IRequest | null = null;
    requestForm: IRequest | null = null;
    apiClient = new ApiClient();
    loader = new LoaderStore();
    filter = new FilterStore({ defaultSort: "number-desc" });
    tab: keyof typeof requestTabs = "all";
    date = dayjs().toDate().toLocaleDateString();
    confirmLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchNew() {
        const newRequests = await this.apiClient.post<IRequest[]>(ADMIN_REQUESTS_FILTER_ENDPOINT, {
            limit: 1000,
            offset: 0,
            filter: {
                status: "NEW",
            },
        });
        if (newRequests.status) {
            this.setRequests(newRequests.data);
        }
    }

    fetchAll = throttle(async () => {
        this.loader.start();

        if (this.filter.search) {
            const result = await this.apiClient.post<IRequest[]>(ADMIN_REQUESTS_FILTER_ENDPOINT, {
                limit: 100,
                offset: 0,
                filter: {
                    number: Number(
                        this.filter.search
                            .toLowerCase()
                            .replace("m", "")
                            .replace("м", "")
                            .replace("-", ""),
                    ),
                },
            });
            if (result.status) {
                this.requestsSearch = result.data;
            }
        } else {
            const result = await this.apiClient.post<IRequest[]>(ADMIN_REQUESTS_FILTER_ENDPOINT, {
                limit: 1000,
                offset: 0,
                filter: {
                    tripDate: this.date,
                },
            });
            if (result.status) {
                this.setRequests([
                    ...this.requests,
                    ...result.data.filter(
                        (result) => !this.requests.find((r) => result.id === r.id),
                    ),
                ]);
            }
        }

        this.loader.finish();
    }, 100);

    async fetchAllByFilter(filter: {
        tripDate?: string;
        employeeId?: number;
        passengerId?: string;
    }) {
        this.loader.start();
        await this.fetchNew();
        const result = await this.apiClient.post<IRequest[]>(ADMIN_REQUESTS_FILTER_ENDPOINT, {
            limit: 1000,
            offset: 0,
            filter,
        });
        if (result.status) {
            this.setRequests([
                ...this.requests,
                ...result.data.filter((result) => !this.requests.find((r) => result.id === r.id)),
            ]);
        }
        this.loader.finish();
    }

    async fetchPushAllByFilter(filter: { tripDate?: string; employeeId?: number }) {
        this.loader.start();
        const result = await this.apiClient.post<IRequest[]>(ADMIN_REQUESTS_FILTER_ENDPOINT, {
            limit: 200,
            offset: 0,
            filter,
        });
        if (result.status) {
            this.pushRequest(result.data);
        }
        this.loader.finish();
    }

    async fetchById(id: string) {
        this.loader.start();
        const result = await this.apiClient.get<IRequest>(`${ADMIN_REQUESTS_ENDPOINT}/${id}`);
        if (result.status) {
            this.setRequest(result.data);
        }
        this.loader.finish();
    }

    async updateRequest(newRequest: IRequest, showSnackbar = true) {
        this.loader.start();
        const result = await this.apiClient.put<IRequest>(ADMIN_REQUESTS_ENDPOINT, newRequest);
        if (result.status) {
            this.setRequest(result.data);
            if (showSnackbar) {
                snackbarStore.showPositiveSnackbar("Изменения сохранены");
            }
        } else {
            if (showSnackbar) {
                snackbarStore.showNegativeSnackbar("Не удалось сохранить изменения");
            }
        }
        this.loader.finish();
        return result;
    }

    async updateRequestWithoutLoader(newRequest: IRequest, showSnackbar = true) {
        const result = await this.apiClient.put<IRequest>(ADMIN_REQUESTS_ENDPOINT, newRequest);
        if (result.status) {
            this.setRequest(result.data);
            if (showSnackbar) {
                snackbarStore.showPositiveSnackbar("Изменения сохранены");
            }
        } else {
            if (showSnackbar) {
                snackbarStore.showNegativeSnackbar("Не удалось сохранить изменения");
            }
        }
        return result;
    }

    async cancelRequest(request: IRequest) {
        this.loader.start();
        const result = await this.apiClient.post<IRequest>(ADMIN_REQUESTS_CANCEL_ENDPOINT, {
            id: request.id,
            reason: request.cancelReason,
            canceledByOperator: true,
        });
        if (result.status) {
            this.setRequest({
                ...result.data,
                lockedEdit: null,
            });
            snackbarStore.showPositiveSnackbar("Заявка отменена");
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось отменить заявку");
        }
        this.loader.finish();
        return result;
    }

    async createRequest(newRequest: IRequest) {
        this.loader.start();
        const result = await this.apiClient.post<IRequest>(ADMIN_REQUESTS_ENDPOINT, newRequest);
        if (result.status) {
            this.setRequest(result.data);
            snackbarStore.showPositiveSnackbar("Заявка создана");
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось создать заявку");
        }
        this.loader.finish();
        return result;
    }

    async confirmRequest(request: IRequest) {
        this.confirmLoading = true;
        const newRequest: IRequest = {
            ...request,
            status: "CONFIRMED",
        };
        const result = await this.apiClient.post<IRequest>(
            ADMIN_REQUESTS_CONFIRM_ENDPOINT,
            newRequest,
        );
        if (result.status) {
            this.setRequest(result.data);
            snackbarStore.showPositiveSnackbar("Заявка подтверждена");
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось подтвердить заявку");
        }
        this.confirmLoading = false;
    }

    async deleteRequest(request: IRequest, onDelete: () => void) {
        this.loader.start();
        const result = await this.apiClient.delete(ADMIN_REQUESTS_ENDPOINT, request.id);
        if (result.status) {
            snackbarStore.showPositiveSnackbar("Заявка удалена");
            this.request = null;
            onDelete();
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось удалить заявку");
        }
        this.loader.finish();
    }

    get newRequests() {
        return this.requests.filter((r) => r.status === "NEW");
    }

    get filteredRequests() {
        let requests = this.filterRequests(this.filter.filterValues);
        requests = this.sortRequests(requests);
        return requests;
    }

    get isFormValid() {
        const form = this.requestForm;
        return (
            form?.info.fullName &&
            form.info.phone &&
            form.info.phone.length === 12 &&
            form.info.sex &&
            form.info.age &&
            form.info.arrivalStationId &&
            form.info.departureStationId &&
            form.info.tripDate &&
            form.info.groupId &&
            (form.inspectorMaleCount || form.inspectorFemaleCount)
        );
    }

    filterRequests(filter: Record<string, any>, filterByTab = true, filterByDate = true) {
        let requests = this.requests.slice();
        if (filterByTab) {
            requests = this.filterByTab(this.tab).slice();
        }
        if (this.filter.search) {
            requests = this.requestsSearch.slice();
        }

        if (this.filter.search) {
            requests = requests.filter((r) =>
                this.filter.ilikeSearch(r.number, (searchValue) =>
                    searchValue.replace("m", "").replace("м", "").replace("-", ""),
                ),
            );
            return requests;
        }

        if (filter["status"]?.length) {
            requests = requests.filter((r) => {
                const values = filter["status"];
                return values.includes(r.status);
            });
        }
        if (filter["fullName"]) {
            requests = requests.filter((r) =>
                this.filter.ilike(r.info.fullName, filter["fullName"]),
            );
        }
        if (filter["email"]) {
            requests = requests.filter((r) => this.filter.ilike(r.info.email, filter["email"]));
        }
        if (filter["phone"]) {
            requests = requests.filter((r) => this.filter.ilike(r.info.phone, filter["phone"]));
        }
        if (filter["departureStation"]) {
            requests = requests.filter(
                (r) => r.info.departureStationId === filter["departureStation"],
            );
        }
        if (filter["arrivalStation"]) {
            requests = requests.filter((r) => r.info.arrivalStationId === filter["arrivalStation"]);
        }
        if (filterByDate && this.date && this.tab !== "new") {
            requests = requests.filter(
                (r) =>
                    new Date(r.info.tripDate).toLocaleDateString() ===
                    dayjs(this.date, "DD.MM.YYYY").toDate().toLocaleDateString(),
            );
        }
        if (filter["meetingPoint"]?.length) {
            requests = requests.filter((r) => {
                const values = filter["meetingPoint"];
                return values.includes(r.info.meetingPoint);
            });
        }
        if (filter["wheelchairRequired"]?.length) {
            requests = requests.filter((r) => {
                const values = filter["wheelchairRequired"];
                return values.includes(r.info.wheelchairRequired);
            });
        }
        if (filter["group"]?.length) {
            requests = requests.filter((r) => {
                const values = filter["group"];
                return values.includes(r.info.groupId);
            });
        }
        if (filter["hasCarriage"]?.length) {
            requests = requests.filter((r) => {
                const values = filter["hasCarriage"];
                return values.includes(!!r.info.strollerDescription);
            });
        }
        if (filter["hasBaggage"]?.length) {
            requests = requests.filter((r) => {
                const values = filter["hasBaggage"];
                return values.includes(r.info.hasBaggage);
            });
        }
        if (filter["lightBaggage"]) {
            requests = requests.filter((r) => r.info.lightBaggage === filter["lightBaggage"]);
        }
        if (filter["mediumBaggage"]) {
            requests = requests.filter((r) => r.info.mediumBaggage === filter["mediumBaggage"]);
        }
        if (filter["hasBaggageDescription"]) {
            requests = requests.filter((r) => !!r.info.baggageDescription);
        }
        if (filter["baggageDescription"]) {
            requests = requests.filter(
                (r) => r.info.baggageDescription === filter["baggageDescription"],
            );
        }
        if (filter["assignedEmployee"]) {
            requests = requests.filter((r) =>
                r.assignedEmployees?.some((e) => e.employeeId === filter["assignedEmployee"]),
            );
        }
        return requests;
    }

    sortRequests(requests: IRequest[]) {
        switch (this.filter.sort) {
            case "number-asc":
                return requests.sort((a, b) => a.number - b.number);
            case "number-desc":
                return requests.sort((a, b) => b.number - a.number);
            case "tripDate-asc":
                return requests.sort((a, b) => a.info.tripDate.localeCompare(b.info.tripDate));
            case "tripDate-desc":
                return requests.sort((a, b) => b.info.tripDate.localeCompare(a.info.tripDate));
            case "status-asc":
                return requests.sort((a, b) => a.status.localeCompare(b.status));
            case "status-desc":
                return requests.sort((a, b) => b.status.localeCompare(a.status));
        }
        return requests;
    }

    filterByTab(tab: RequestStore["tab"]) {
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
                return this.requests.filter((r) => r.status === "WAITING_LIST");
        }
    }

    findById(id: string) {
        return (
            this.requests.find((r) => r.id === id) ??
            (this.request?.id === id ? this.request : undefined)
        );
    }

    setRequests(requests: IRequest[]) {
        this.requests = requests;
    }

    setRequest(request: IRequest | null) {
        this.request = request;
    }

    pushRequest(request: IRequest[]) {
        this.requests.push(...request);
    }

    setTab(tab: RequestStore["tab"]) {
        this.tab = tab;
    }

    clearRequest() {
        this.loader.finish();
        this.setRequest(null);
    }
}
