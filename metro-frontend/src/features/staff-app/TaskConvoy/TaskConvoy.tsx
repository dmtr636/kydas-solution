import { observer } from "mobx-react-lite";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import styles from "./styles.module.scss";
import { clsx } from "clsx";
import {
    IconArrowDownMetro,
    IconArrowUpMetro,
    IconCheckmark,
    IconSuccess,
} from "src/ui/assets/icons";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { getLineIcon, getStationById } from "src/features/admin/requests/utils/stations.tsx";
import axios from "axios";
import { ADMIN_REQUESTS_ENDPOINT } from "src/shared/api/endpoints.ts";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { store } from "src/app/AppStore.ts";

const TaskConvoy = observer(
    ({ data, setRequest }: { data: IRequest; setRequest: (r: IRequest) => void }) => {
        const startSt = getStationById(data.info.arrivalStationId);
        const endSt = getStationById(data.info.departureStationId);
        const [step, setStep] = useState<number>(1);
        const [inspectorLate, setInspectorLate] = useState<boolean>(false);
        const [passLate, setPassLate] = useState<boolean>(false);

        function getFirstElement(data: string): string {
            let elements;
            if (data) {
                elements = data.split(",");
            } else return "";
            return elements[0].trim();
        }

        function getStep(currentStep: string | null): number {
            switch (currentStep) {
                case "ACCEPTED":
                    return 1;
                case "INSPECTOR_DISPATCHED":
                    return 2;
                case "INSPECTOR_ON_SITE":
                    return 3;
                case "TRIP":
                    return 4;
                case "COMPLETE_CONVOY":
                    return 5;
                default:
                    return step;
            }
        }

        const onClickTask = async (
            currentStep:
                | "INSPECTOR_DISPATCHED"
                | "INSPECTOR_ON_SITE"
                | "TRIP"
                | "COMPLETE_CONVOY"
                | "ACCEPTED"
                | "PASSENGER_LATE"
                | "INSPECTOR_LATE",
        ) => {
            const updatedData = { ...data, convoyStatus: currentStep };
            await axios.put(ADMIN_REQUESTS_ENDPOINT, updatedData).then(() => {
                setRequest(updatedData);
                setStep(getStep(currentStep));
                if (currentStep === "INSPECTOR_LATE") {
                    setInspectorLate(true);
                }
                if (currentStep === "PASSENGER_LATE") {
                    setPassLate(true);
                }
            });
        };
        const onClickRout = async (position: number) => {
            const updatedData = { ...data, position: position };
            await axios.put(ADMIN_REQUESTS_ENDPOINT, updatedData);
        };

        const routeArray: any[] = [];
        for (let i = 0; i < data?.route.length - 1; i++) {
            routeArray.push({
                startSt: data.route[i],
                endSt: data.route[i + 1],
                complete: false,
            });
        }

        function markCompleteUpToPosition(routeArray: any, position: number) {
            for (let i = 0; i < routeArray.length; i++) {
                routeArray[i].complete = true;
                if (routeArray[i].endSt === position) {
                    break;
                }
            }
        }

        const [route, setRoute] = useState(routeArray);
        useEffect(() => {
            if (data) {
                setStep(getStep(data.convoyStatus));
            }
            if (data.convoyStatus === "INSPECTOR_LATE") {
                setInspectorLate(true);
            }
            if (data.convoyStatus === "PASSENGER_LATE") {
                setPassLate(true);
            }
            if (data.position) {
                markCompleteUpToPosition(routeArray, data.position);
                setRoute(routeArray);
            }
        }, []);
        const routeArrayRender = routeArray.map(
            (item, index: number) =>
                (index === 0 || (index > 0 ? route[index - 1].complete : true)) && (
                    <div className={clsx(styles.block)} key={index}>
                        {route[index].complete && (
                            <div className={styles.complete}>
                                {data.convoyStatus !== "COMPLETE_CONVOY" && (
                                    <div className={styles.circle}>
                                        <IconCheckmark />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={styles.subHead}>Осуществить пересадку на</div>
                        <div className={styles.secondBlockHead} style={{ marginLeft: "-9px" }}>
                            <IconArrowUpMetro />
                            {getLineIcon(item.startSt)} {getStationById(item.startSt).name}
                        </div>
                        <div className={styles.dividerBlock}>
                            В сторону <div className={styles.horDivider}></div>
                        </div>
                        <div className={styles.secondBlockHead} style={{ marginLeft: "-9px" }}>
                            <IconArrowDownMetro />
                            {getLineIcon(item.endSt)} {getStationById(item.endSt).name}
                        </div>

                        {!route[index].complete ? (
                            <Button
                                onClick={() => {
                                    onClickRout(item.endSt);
                                    setRoute([...route, (route[index].complete = true)]);
                                }}
                                style={{ marginTop: "4px" }}
                                mode={"brand"}
                                fullWidth={true}
                                iconAfter={<IconCheckmark />}
                            ></Button>
                        ) : (
                            <Button
                                clickable={false}
                                style={{ marginTop: "4px" }}
                                mode={"brand"}
                                type={"outlined"}
                                fullWidth={true}
                                iconAfter={<IconCheckmark />}
                            >
                                Выполнено
                            </Button>
                        )}
                    </div>
                ),
        );

        return (
            <div className={styles.container}>
                {/*принялся за заявку, выехал на станцию*/}
                <div className={styles.block}>
                    {step > 2 && (
                        <div className={styles.complete}>
                            {data.convoyStatus !== "COMPLETE_CONVOY" && (
                                <div className={styles.circle}>
                                    <IconCheckmark />
                                </div>
                            )}
                        </div>
                    )}
                    <div className={styles.secondBlockHead}>
                        {getLineIcon(data.info.arrivalStationId)}{" "}
                        {startSt && getFirstElement(startSt.name)}
                    </div>
                    <div className={styles.text}>
                        <div className={styles.textPlace}>
                            Отправиться на станцию начала сопровождения. Необходимо прибыть <br />{" "}
                            на станцию за 15 минут до начала сопровождения
                        </div>
                    </div>
                    {step === 1 ? (
                        <Button
                            onClick={() => onClickTask("INSPECTOR_DISPATCHED")}
                            style={{ marginTop: "4px" }}
                            mode={"brand"}
                            fullWidth={true}
                        >
                            Выехал
                        </Button>
                    ) : (
                        <Button
                            clickable={false}
                            style={{ marginTop: "4px" }}
                            mode={"brand"}
                            type={"outlined"}
                            fullWidth={true}
                            iconAfter={<IconCheckmark />}
                        >
                            Выехал
                        </Button>
                    )}
                    {step === 1 || step === 2 ? (
                        <Button
                            disabled={step === 1}
                            onClick={() => onClickTask("INSPECTOR_ON_SITE")}
                            style={{ marginTop: "4px" }}
                            mode={"brand"}
                            fullWidth={true}
                        >
                            Прибыл на станцию
                        </Button>
                    ) : (
                        <Button
                            clickable={false}
                            style={{ marginTop: "4px" }}
                            mode={"brand"}
                            type={"outlined"}
                            fullWidth={true}
                            iconAfter={<IconCheckmark />}
                        >
                            Прибыл на станцию
                        </Button>
                    )}
                    <Button
                        onClick={() => onClickTask("INSPECTOR_LATE")}
                        style={{ marginTop: "4px" }}
                        mode={"brand"}
                        disabled={inspectorLate}
                        type={"secondary"}
                        fullWidth={true}
                    >
                        Опаздываю
                    </Button>
                    {data.convoyStatus === "INSPECTOR_LATE" && (
                        <div className={styles.imlate}>
                            <IconSuccess /> Оператор предупреждён о <br /> вашем опоздании
                        </div>
                    )}
                </div>
                {/*Приехал, встречает пассажира*/}
                {step > 2 && (
                    <div className={styles.block}>
                        {step > 3 && (
                            <div className={styles.complete}>
                                {data.convoyStatus !== "COMPLETE_CONVOY" && (
                                    <div className={styles.circle}>
                                        <IconCheckmark />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={styles.secondBlockHead}>
                            {getLineIcon(data.info.arrivalStationId)}{" "}
                            {startSt && getFirstElement(startSt.name)}
                        </div>
                        <div className={styles.text}>
                            <div className={styles.textHead}>Найти и встретить пассажира</div>
                            <div className={styles.textName}>{data.info.fullName}</div>
                            <div className={styles.textPlace}>{data.info.meetingPoint}</div>
                        </div>
                        {step === 3 ? (
                            <Button
                                onClick={() => onClickTask("TRIP")}
                                style={{ marginTop: "4px" }}
                                mode={"brand"}
                                fullWidth={true}
                            >
                                Встретил пассажира
                            </Button>
                        ) : (
                            <Button
                                clickable={false}
                                style={{ marginTop: "4px" }}
                                mode={"brand"}
                                type={"outlined"}
                                fullWidth={true}
                                iconAfter={<IconCheckmark />}
                            >
                                Встретил пассажира
                            </Button>
                        )}
                        <Button
                            onClick={() => onClickTask("PASSENGER_LATE")}
                            style={{ marginTop: "4px" }}
                            mode={"brand"}
                            disabled={passLate}
                            type={"secondary"}
                            fullWidth={true}
                        >
                            Пассажир опаздывает
                        </Button>
                        {data.convoyStatus === "PASSENGER_LATE" && (
                            <div className={styles.imlate}>
                                <IconSuccess /> Оператор предупреждён об <br /> опоздании пассажира.{" "}
                                <br /> Обстоятельства выясняются.
                            </div>
                        )}
                    </div>
                )}

                {/*Пересадка*/}
                {step > 3 && data.route.length > 0 && routeArrayRender}

                {/*завершить сопровождение*/}
                {(route[routeArray.length - 1]?.complete || route.length > 0
                    ? route[routeArray.length - 1]?.complete
                    : data.convoyStatus === "TRIP") && (
                    <div className={clsx(styles.block, styles.finish)}>
                        {data.convoyStatus === "COMPLETE_CONVOY" && (
                            <div className={styles.complete}>
                                {data.convoyStatus !== "COMPLETE_CONVOY" && (
                                    <div className={styles.circle}>
                                        <IconCheckmark />
                                    </div>
                                )}
                            </div>
                        )}
                        <div className={styles.secondBlockHead}>
                            {getLineIcon(data.info.departureStationId)}{" "}
                            {endSt && getFirstElement(endSt.name)}
                        </div>
                        <div className={styles.text}>
                            <div className={styles.textPlace}>
                                Сопроводить пассажира до указанной станции
                            </div>
                        </div>
                        {data.convoyStatus !== "COMPLETE_CONVOY" ? (
                            <Button
                                onClick={() => onClickTask("COMPLETE_CONVOY")}
                                style={{ marginTop: "4px" }}
                                mode={"brand"}
                                fullWidth={true}
                            >
                                Завершить сопровождение
                            </Button>
                        ) : (
                            <Button
                                style={{ marginTop: "4px" }}
                                mode={"brand"}
                                type={"outlined"}
                                fullWidth={true}
                                iconAfter={<IconCheckmark />}
                            >
                                Выполнено
                            </Button>
                        )}
                    </div>
                )}
                {data.convoyStatus === "COMPLETE_CONVOY" && (
                    <div className={styles.completeConvoyContainer} style={{ marginBottom: -40 }}>
                        <div className={styles.circleСomplete}>
                            <IconCheckmark />
                        </div>
                        <div className={styles.completeConvoyText}>
                            Сопровождение завершено! <br /> Спасибо за работу!
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

export default TaskConvoy;
