import styles from "./styles.module.scss";
import { getLineIcon, getStationById } from "src/features/admin/requests/utils/stations.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import clsx from "clsx";
import { IconRoute } from "src/ui/assets/icons";
import { useNavigate } from "react-router-dom";

const TaskCard = ({
    id,
    number,
    startStation,
    endStation,
    date,
    active = false,
    endDate,
}: {
    id: string;
    number: number;
    startStation: number;
    endStation: number;
    date: string;
    active?: boolean;
    endDate: string;
}) => {
    const startSt = getStationById(startStation);
    const endSt = getStationById(endStation);
    const cardDate = new Date(date);
    const cardEndDate = new Date(endDate);

    function addLeadingZero(number: number) {
        const numberString = number.toString();

        if (numberString.length === 1) {
            return "0" + numberString;
        }

        return numberString;
    }

    function getFirstElement(data: string): string {
        let elements;
        if (data) {
            elements = data.split(",");
        } else return "";
        return elements[0].trim();
    }

    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/staffapp/request/${id}`)}
            className={clsx(styles.container, { [styles.active]: active })}
        >
            <div className={clsx(styles.header, { [styles.active]: active })}>
                Заявка М-{number}
                {active ? (
                    <Button size={"small"} mode={"brand"} type={"primary"} clickable={false}>
                        {addLeadingZero(cardDate.getHours())}:
                        {addLeadingZero(cardDate.getMinutes())}
                    </Button>
                ) : (
                    <Button size={"small"} mode={"neutral"} type={"outlined"} clickable={false}>
                        {addLeadingZero(cardDate.getHours())}:
                        {addLeadingZero(cardDate.getMinutes())}
                    </Button>
                )}
            </div>
            <div className={styles.body}>
                <IconRoute />
                <div className={styles.stations}>
                    <div className={styles.stationsItem}>
                        {getLineIcon(startStation)}
                        {startSt && getFirstElement(startSt.name)}
                    </div>
                    <div className={styles.stationsItem}>
                        {getLineIcon(endStation)}
                        {endSt && getFirstElement(endSt.name)}
                    </div>
                </div>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.taskTime}>
                Время выполнения{" "}
                <span>
                    {addLeadingZero(cardDate.getHours())}:{addLeadingZero(cardDate.getMinutes())}—
                    {addLeadingZero(cardEndDate.getHours())}:
                    {addLeadingZero(cardEndDate.getMinutes())}
                </span>
            </div>
        </div>
    );
};

export default TaskCard;
