import styles from "./TripRoute.module.scss";
import { IconArrowRoute } from "src/ui/assets/icons";
import { getLineIcon, getStationById } from "src/features/admin/requests/utils/stations.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { TooltipTypo } from "src/ui/components/info/TooltipTypo/TooltipTypo.tsx";

export const TripRoute = (props: { arrivalStationId: number; departureStationId: number }) => {
    return (
        <div className={styles.container}>
            <IconArrowRoute className={styles.iconArrow} />
            <div className={styles.column}>
                <div className={styles.station}>
                    <div className={styles.iconLine}>{getLineIcon(props.departureStationId)}</div>
                    <TooltipTypo variant={"actionL"}>
                        {getStationById(props.departureStationId)?.name?.split(",")[0]}
                    </TooltipTypo>
                </div>
                <div className={styles.station}>
                    <div className={styles.iconLine}>{getLineIcon(props.arrivalStationId)}</div>
                    <TooltipTypo variant={"actionL"}>
                        {getStationById(props.arrivalStationId)?.name?.split(",")[0]}
                    </TooltipTypo>
                </div>
            </div>
        </div>
    );
};
