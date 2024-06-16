import styles from "./EmployeeLocation.module.scss";
import { MetroStation } from "src/features/admin/refs/stations/components/MetroStation/MetroStation.tsx";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { getStationById } from "src/features/admin/requests/utils/stations.tsx";
import { store } from "src/app/AppStore.ts";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { observer } from "mobx-react-lite";

export const EmployeeLocation = observer((props: { activeRequest: IRequest }) => {
    const getStation = () => {
        if (props.activeRequest.convoyStatus === "COMPLETE_CONVOY") {
            return props.activeRequest.info.arrivalStationId;
        }
        if (props.activeRequest.position) {
            return props.activeRequest.position;
        }
        return props.activeRequest.info.departureStationId;
    };

    if (store.request.loader.loading) {
        return <Skeleton height={20} width={200} />;
    }

    return (
        <div className={styles.container}>
            <MetroStation station={getStationById(getStation())} />
        </div>
    );
});
