import stations from "src/features/request/stations.ts";
import {
    IconMetroLine1,
    IconMetroLine10,
    IconMetroLine11,
    IconMetroLine12,
    IconMetroLine14,
    IconMetroLine15,
    IconMetroLine2,
    IconMetroLine3,
    IconMetroLine4,
    IconMetroLine5,
    IconMetroLine6,
    IconMetroLine7,
    IconMetroLine8,
    IconMetroLine8a,
    IconMetroLine9,
    IconMetroLineD1,
    IconMetroLineD2,
    IconMetroLineD3,
    IconMetroLineD4,
} from "src/shared/assets/icons";
import { ReactNode } from "react";

export const getStationById = (stationId: number) => {
    return stations.find((station) => station.id === stationId)!;
};

export const getLineIcon = (line: string | number) => {
    let lineName;
    if (typeof line === "string") {
        lineName = line;
    } else {
        lineName = getStationById(line)?.lineNameShort;
    }
    const map: Record<string, ReactNode> = {
        "1": <IconMetroLine1 />,
        "2": <IconMetroLine2 />,
        "3": <IconMetroLine3 />,
        "4": <IconMetroLine4 />,
        "4А": <IconMetroLine4 />,
        "5": <IconMetroLine5 />,
        "6": <IconMetroLine6 />,
        "7": <IconMetroLine7 />,
        "8": <IconMetroLine8 />,
        "8А": <IconMetroLine8a />,
        "9": <IconMetroLine9 />,
        "10": <IconMetroLine10 />,
        Л1: <IconMetroLine12 />,
        БКЛ: <IconMetroLine11 />,
        "БКЛ(А)": <IconMetroLine11 />,
        "14": <IconMetroLine14 />,
        "15": <IconMetroLine15 />,
        Д1: <IconMetroLineD1 />,
        Д2: <IconMetroLineD2 />,
        Д3: <IconMetroLineD3 />,
        Д4: <IconMetroLineD4 />,
    };
    return map[lineName];
};
