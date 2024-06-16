export interface IStation {
    id: number;
    name: string;
    nameFull: string;
    lineId: number;
    lineNameShort: string;
}

export interface IStationTime {
    id: number;
    stationId1: number;
    stationId2: number;
    timeMinutes: number;
}
