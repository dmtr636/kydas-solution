import { useState } from "react";
import styles from "./style.module.scss";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import QRCode from "qrcode.react";
import stations from "src/features/request/stationsWithIcons.tsx";
import axios from "axios";
import { SUBSCRIBE_ENDPOINT } from "src/shared/api/endpoints.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";

const FormSuccesfull = ({
    name,
    date,
    stationStart,
    stationEnd,
    link,
    number,
}: {
    name: string;
    date: string;
    stationStart: number | null;
    stationEnd: number | null;
    link: string;
    number: number;
}) => {
    const [email, setEmail] = useState("");
    const startStaionName = stations.find((obj: any) => obj.value === stationStart);
    const endStaionName = stations.find((obj: any) => obj.value === stationEnd);
    const dateObject = new Date(date);
    const formattedDate = `${dateObject.getDate()}.${dateObject.getMonth() + 1}.${dateObject.getFullYear()} / ${dateObject.getHours()}:${dateObject.getMinutes().toString().padStart(2, "0")}`;
    const [valid, setValid] = useState(false);

    const data = {
        email: email,
        id: link,
    };
    const onClick = () => {
        axios.post(SUBSCRIBE_ENDPOINT, data).then(() => {
            setEmail("");
            snackbarStore.showPositiveSnackbar(
                "Теперь вы будете получать информацию о статусе заявки!",
            );
        });
    };
    return (
        <>
            <div className={styles.text}>
                В ближайшее время мы свяжемся по указанному вами номеру. Ожидайте звонка
                от&nbsp;сотрудников ЦОМП. Пока вы можете отслеживать информацию о статусе заявки.
            </div>
            <div className={styles.emailBlock}>
                <div style={{ width: "498px" }}>
                    <EmailInput
                        formName={"Почта для информирования"}
                        size={"large"}
                        brand={true}
                        formText={"Будем присылать информацию о статусе заявки"}
                        onChange={setEmail}
                        value={email}
                        setValid={setValid}
                    />
                </div>
                <Button onClick={() => onClick()} size={"large"} mode={"brand"} disabled={!valid}>
                    Получить
                </Button>
            </div>
            <div className={styles.qrContainer}>
                <div className={styles.qrHeader}>Или воспользуйтесь QR-кодом</div>
                <div className={styles.qrContent}>
                    <div className={styles.qrContentLeft}>
                        <QRCode size={269} value={`${window.location.origin}/request/${link}`} />
                    </div>
                    <div className={styles.qrContentRight}>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Номер заявки</div>
                            <div className={styles.qrContentItemSubHead}>M-{number}</div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Получатель услуги</div>
                            <div className={styles.qrContentItemSubHead}>{name}</div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>
                                Дата и время оказания услуги
                            </div>
                            <div className={styles.qrContentItemSubHead}>{formattedDate}</div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Станция отправления</div>
                            <div className={styles.qrContentItemSubHead}>
                                {startStaionName?.name}
                            </div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Станция прибытия</div>
                            <div className={styles.qrContentItemSubHead}>{endStaionName?.name}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormSuccesfull;
