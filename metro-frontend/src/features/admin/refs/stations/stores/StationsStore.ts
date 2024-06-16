import { makeAutoObservable } from "mobx";
import {
    STATIONS_DRIVING_TIME_ENDPOINT,
    STATIONS_ENDPOINT,
    STATIONS_TRANSFER_TIME_ENDPOINT,
} from "src/shared/api/endpoints.ts";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { IStation, IStationTime } from "src/features/admin/refs/stations/types/IStation.ts";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { LoaderStore } from "src/shared/stores/LoaderStore.ts";

export class StationsStore {
    stations: IStation[] = [];
    stationsDrivingTimes: IStationTime[] = [];
    stationsTransferTimes: IStationTime[] = [];
    loader = new LoaderStore();
    apiClient = new ApiClient();
    filter = new FilterStore();

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAllStations() {
        this.loader.start();
        const response = await this.apiClient.get<IStation[]>(STATIONS_ENDPOINT);
        if (response.status) {
            this.stations = response.data;
        }
        this.loader.finish();
    }

    async fetchAllStationDrivingTimes() {
        this.loader.start();
        const response = await this.apiClient.get<IStationTime[]>(STATIONS_DRIVING_TIME_ENDPOINT);
        if (response.status) {
            this.stationsDrivingTimes = response.data;
        }
        this.loader.finish();
    }

    async fetchAllStationTransferTimes() {
        this.loader.start();
        const response = await this.apiClient.get<IStationTime[]>(STATIONS_TRANSFER_TIME_ENDPOINT);
        if (response.status) {
            this.stationsTransferTimes = response.data;
        }
        this.loader.finish();
    }

    get filteredStations() {
        let stations = this.stations;
        if (this.filter.search) {
            stations = stations.filter(
                (station) =>
                    this.filter.ilikeSearch(station.name) || this.filter.ilikeSearch(station.id),
            );
        }
        return stations;
    }

    get filteredStationsDrivingTimes() {
        let drivingTimes = this.stationsDrivingTimes;
        if (this.filter.search) {
            drivingTimes = drivingTimes.filter(
                (drivingTime) =>
                    this.filter.ilikeSearch(
                        this.stations.find((s) => s.id === drivingTime.stationId1)?.name ?? "",
                    ) ||
                    this.filter.ilikeSearch(
                        this.stations.find((s) => s.id === drivingTime.stationId2)?.name ?? "",
                    ),
            );
        }
        return drivingTimes;
    }

    get filteredStationsTransferTimes() {
        let drivingTimes = this.stationsTransferTimes;
        if (this.filter.search) {
            drivingTimes = drivingTimes.filter(
                (drivingTime) =>
                    this.filter.ilikeSearch(
                        this.stations.find((s) => s.id === drivingTime.stationId1)?.name ?? "",
                    ) ||
                    this.filter.ilikeSearch(
                        this.stations.find((s) => s.id === drivingTime.stationId2)?.name ?? "",
                    ),
            );
        }
        return drivingTimes;
    }
}
