import styles from "./MetroStation.module.scss";
import { observer } from "mobx-react-lite";
import { IStation } from "src/features/admin/refs/stations/types/IStation.ts";
import { getLineIcon } from "src/features/admin/requests/utils/stations.tsx";
import { TooltipTypo } from "src/ui/components/info/TooltipTypo/TooltipTypo.tsx";

export const MetroStation = observer((props: { station: IStation }) => {
    return (
        <div className={styles.stationInfo}>
            <div className={styles.stationIcon}>{getLineIcon(props.station.lineNameShort)}</div>
            <TooltipTypo variant={"actionL"}>{props.station.nameFull.split(", ")[0]}</TooltipTypo>
        </div>
    );
});
