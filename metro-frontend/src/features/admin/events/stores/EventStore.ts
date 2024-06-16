import { IEvent } from "src/features/admin/events/types/IEvent.ts";
import { makeAutoObservable } from "mobx";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { LoaderStore } from "src/shared/stores/LoaderStore.ts";
import { EVENTS_ENDPOINT } from "src/shared/api/endpoints.ts";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { store } from "src/app/AppStore.ts";

export class EventStore {
    events: IEvent[] = [];
    apiClient = new ApiClient();
    loader = new LoaderStore();
    filter = new FilterStore({ defaultSort: "createDate-desc" });
    tab = "requests";

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAllEvents() {
        this.loader.start();
        const result = await this.apiClient.get<IEvent[]>(EVENTS_ENDPOINT);
        if (result.status) {
            this.events = result.data;
        }
        this.loader.finish();
    }

    get filteredEvents() {
        let events = this.filterEvents(this.filter.filterValues);
        events = this.sortEvents(events);
        return events;
    }

    filterEvents(filter: Record<string, any>) {
        let events = this.events.slice();

        if (this.filter.search) {
            events = events.filter((e) =>
                this.filter.ilikeSearch(
                    store.employee.findByUserId(e.userId ?? 0)
                        ? getFullName(store.employee.findByUserId(e.userId ?? 0))
                        : store.user.getById(e.userId ?? 0)?.name ?? "",
                ),
            );
        }

        if (filter["createDate"]) {
            events = events.filter(
                (n) =>
                    new Date(n.createDate).toLocaleDateString() ===
                    new Date(filter["createDate"]).toLocaleDateString(),
            );
        }
        if (filter["action"]?.length) {
            events = events.filter((n) => {
                const values = filter["action"];
                return values.includes(n.action);
            });
        }
        if (filter["author"]) {
            events = events.filter((e) => e.userId === filter["author"]);
        }

        return events;
    }

    sortEvents(events: IEvent[]) {
        switch (this.filter.sort) {
            case "createDate-asc":
                return events.sort((a, b) => a.createDate.localeCompare(b.createDate));
            case "createDate-desc":
                return events.sort((a, b) => b.createDate.localeCompare(a.createDate));
        }
        return events;
    }

    findById(id: number) {
        return this.events.find((n) => n.id === id);
    }
}
