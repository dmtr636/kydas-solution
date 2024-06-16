import { getLineIcon } from "src/features/admin/requests/utils/stations.tsx";
import stations from "src/features/request/stations.ts";

const stationsWithIcons = stations
    .map((station) => ({
        name: station.nameFull,
        value: station.id,
        icon: getLineIcon(station.lineNameShort),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

export default stationsWithIcons;
