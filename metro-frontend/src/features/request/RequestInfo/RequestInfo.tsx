import { useState } from "react";
import styles from "./styles.module.scss";
import Stepper from "src/ui/components/solutions/Stepper/Stepper.tsx";
import stations from "src/features/request/stationsWithIcons.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { SnackbarProvider } from "src/ui/components/info/Snackbar/SnackbarProvider.tsx";
import { observer } from "mobx-react-lite";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import axios from "axios";
import { REQUEST_POST_ENDPOINT } from "src/shared/api/endpoints.ts";
import { useNavigate } from "react-router-dom";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import healthArray from "src/features/request/healthArray.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";

const RequestInfo = observer(({ data }: { data: IRequest }) => {
    const stepArray = [
        {
            title: (
                <>
                    Ожидает <br /> подтверждения
                </>
            ),
            disabled: false,
        },
        {
            title: "В процессе",
        },
        {
            title: "Успешно",
        },
    ];
    const startStaionName = stations.find((obj: any) => obj.value === data.info.arrivalStationId);
    const endStaionName = stations.find((obj: any) => obj.value === data.info.departureStationId);
    const dateObject = new Date(data.info.tripDate);
    const formattedDate = `${dateObject.getDate()}.${dateObject.getMonth() + 1}.${dateObject.getFullYear()} / ${dateObject.getHours()}:${dateObject.getMinutes().toString().padStart(2, "0")}`;
    const getCurrentStep = () => {
        switch (data.status) {
            case "NEW": {
                return 0;
            }
            case "CONFIRMED": {
                return 1;
            }
            case "COMPLETED": {
                return 2;
            }
            default:
                return 0;
        }
    };

    function formatPhoneNumber(phoneNumber: string) {
        if (phoneNumber.length !== 12) {
            return phoneNumber;
        }

        const countryCode = phoneNumber.slice(1, 2);
        const firstPart = phoneNumber.slice(2, 5);
        const secondPart = phoneNumber.slice(5, 8);
        const thirdPart = phoneNumber.slice(8, 10);
        const fourthPart = phoneNumber.slice(10, 12);

        const formattedPhoneNumber =
            "+" +
            countryCode +
            " (" +
            firstPart +
            ") " +
            secondPart +
            "-" +
            thirdPart +
            "-" +
            fourthPart;

        return formattedPhoneNumber;
    }

    const health = healthArray.find((obj: any) => obj.value === data.info.groupId);
    const lightBaggage = data.info.lightBaggage ? "лёгкий груз, " : "";
    const mediumBaggage = data.info.mediumBaggage ? "средний груз, " : "";
    let baggage = lightBaggage + mediumBaggage + `${data.info?.baggageDescription?.toLowerCase()}`;
    baggage = baggage?.charAt(0)?.toUpperCase() + baggage.slice(1);

    if (baggage.slice(-2) === ", ") {
        baggage = baggage.slice(0, -2);
    }
    const [open, setOpen] = useState(false);
    const canselRequest = () => {
        axios
            .post(`${REQUEST_POST_ENDPOINT}/${data.id}/cancel`)
            .then(() => {
                snackbarStore.showPositiveSnackbar("Заявка отменена");

                setOpen(false);
                data.status = "CANCELED";
            })
            .catch(() => {
                snackbarStore.showNegativeSnackbar("Что-то пошло не так");
                setOpen(false);
            });
    };
    const navigate = useNavigate();
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Заявка — <span className={styles.active}>M-{data.number}</span>
            </div>
            <div className={styles.stepperBlock}>
                {data.status === "CANCELED" ? (
                    <div className={styles.canselBlock}>
                        <div className={styles.canselBlockText}>Отменена</div>
                        <div className={styles.canselBlockButton}>
                            <Button onClick={() => navigate("/request")} mode={"brand"}>
                                Заполнить новую заявку
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Stepper StepsArray={stepArray} currentStep={getCurrentStep()} />
                )}
            </div>
            <div className={styles.userInfoBlock}>
                <div className={styles.userInfoBlockLeft}>
                    <div className={styles.userInfoBlockItem}>
                        <div className={styles.userInfoBlockItemHead}>Получатель услуги</div>
                        <div className={styles.userInfoBlockItemText}>{data.info.fullName}</div>
                    </div>
                    <div className={styles.userInfoBlockItem}>
                        <div className={styles.userInfoBlockItemHead}>Пол</div>
                        <div className={styles.userInfoBlockItemText}>
                            {data.info.sex === "male" ? "Мужчина" : "Женщина"}
                        </div>
                    </div>
                    <div className={styles.userInfoBlockItem}>
                        <div className={styles.userInfoBlockItemHead}>
                            Дата и время оказания услуги
                        </div>
                        <div className={styles.userInfoBlockItemText}>{formattedDate}</div>
                    </div>
                </div>
                <div className={styles.userInfoBlockRight}>
                    <div className={styles.userInfoBlockItem}>
                        <div className={styles.userInfoBlockItemHead}>Телефон</div>
                        <div className={styles.userInfoBlockItemText}>
                            {formatPhoneNumber(data.info.phone)}
                        </div>
                    </div>
                    <div className={styles.userInfoBlockItem}>
                        <div className={styles.userInfoBlockItemHead}>Место встречи</div>
                        <div className={styles.userInfoBlockItemText}>{data.info.meetingPoint}</div>
                    </div>
                </div>
            </div>
            <div className={styles.stationsBlock}>
                <div className={styles.userInfoBlockItem}>
                    <div className={styles.userInfoBlockItemHead}>Станция отправления</div>
                    <div className={styles.userInfoBlockItemText}>{startStaionName?.name}</div>
                </div>
                <div className={styles.userInfoBlockItem}>
                    <div className={styles.userInfoBlockItemHead}>Станция прибытия</div>
                    <div className={styles.userInfoBlockItemText}>{endStaionName?.name}</div>
                </div>
            </div>
            <div className={styles.groupBlock}>
                <div>
                    <div className={styles.userInfoBlockItem}>
                        <div style={{ width: "314px" }} className={styles.userInfoBlockItemHead}>
                            Категория
                        </div>
                        <div className={styles.userInfoBlockItemText}>
                            {health?.name ? health.name : "-"}
                        </div>
                    </div>
                    <div className={styles.userInfoBlockItem} style={{ marginTop: "20px" }}>
                        <div className={styles.userInfoBlockItemHead}>Наличие ЭКС</div>
                        <div className={styles.userInfoBlockItemText}>
                            {data.info.pacemaker ? "Есть" : "Отсутствует"}
                        </div>
                    </div>
                </div>
                <div className={styles.userInfoBlockItem}>
                    <div className={styles.userInfoBlockItemHead}>Кресло-коляска</div>
                    <div className={styles.userInfoBlockItemText}>
                        {data.info.wheelchairRequired ? "Требуется" : "Не требуется"}
                    </div>
                </div>
            </div>

            {data.info.hasBaggage && (
                <div
                    style={{ borderBottom: "none", paddingBottom: "8px" }}
                    className={styles.groupBlock}
                >
                    <div>
                        <div style={{ width: "314px" }} className={styles.userInfoBlockItem}>
                            <div className={styles.userInfoBlockItemHead}>Наличие багажа</div>
                            <div className={styles.userInfoBlockItemText}>{baggage}</div>
                        </div>
                        <div style={{ marginTop: "20px" }} className={styles.userInfoBlockItem}>
                            <div className={styles.userInfoBlockItemHead}>Требуется помощь</div>
                            <div className={styles.userInfoBlockItemText}>
                                {data.info.baggageHelpRequired ? "Да" : "Нет"}
                            </div>
                        </div>
                    </div>
                    <div className={styles.userInfoBlockItem}>
                        <div className={styles.userInfoBlockItemHead}>Объём багажа</div>
                        <div className={styles.userInfoBlockItemText}>
                            {data.info.baggageWeight}
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.textAreaBlock}>
                <TextArea
                    readonly={true}
                    height={230}
                    size={"large"}
                    value={data.info.comment}
                    formName={"Ваш комментарий"}
                    onChange={() => {}}
                />
            </div>
            {data.status !== "CANCELED" && (
                <div className={styles.button}>
                    <Button
                        fullWidth={true}
                        onClick={() => setOpen(true)}
                        size={"large"}
                        mode={"brand"}
                        type={"outlined"}
                    >
                        Отменить заявку
                    </Button>
                </div>
            )}
            <Overlay
                open={open}
                title={"Отмена заявки"}
                onClose={() => setOpen(false)}
                mode={"neutral"}
                actions={[
                    <Button
                        key="confirm"
                        type={"primary"}
                        mode={"brand"}
                        onClick={() => {
                            canselRequest();
                        }}
                    >
                        Подтвердить отмену
                    </Button>,
                    <Button
                        key={"close"}
                        type={"secondary"}
                        mode={"brand"}
                        onClick={() => setOpen(false)}
                    >
                        Закрыть окно
                    </Button>,
                ]}
            >
                <Typo variant={"subheadL"} className={styles.subtitle}>
                    Вы уверены, что хотите отменить заявку?
                </Typo>
            </Overlay>
            <SnackbarProvider></SnackbarProvider>
        </div>
    );
});

export default RequestInfo;
