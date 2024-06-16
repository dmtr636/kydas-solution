import React, { useState } from "react";
import stations from "src/features/request/stationsWithIcons.tsx";
import axios from "axios";
import { SUBSCRIBE_ENDPOINT } from "src/shared/api/endpoints.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import styles from "src/features/request/RequestForm/FormSuccesfull/style.module.scss";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import QRCode from "qrcode.react";

const FormGroupSuccesfull = ({
    name,
    phone,
    peopleCount,
}: {
    name: string;
    phone: string;
    peopleCount: string;
}) => {
    const [email, setEmail] = useState("");
    const [valid, setValid] = useState(false);

    const onClick = () => {
        snackbarStore.showPositiveSnackbar(
            "Теперь вы будете получать информацию о статусе заявки!",
        );
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
                        <QRCode
                            size={269}
                            value={`https://mosmetro.ru/passengers/services/accessibility-center/`}
                        />
                    </div>
                    <div className={styles.qrContentRight}>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Номер заявки</div>
                            <div className={styles.qrContentItemSubHead}>M-{4445}</div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Фио ответственного</div>
                            <div className={styles.qrContentItemSubHead}>{name}</div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Тип сопровождения</div>
                            <div className={styles.qrContentItemSubHead}>Группа детей</div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Телефон</div>
                            <div className={styles.qrContentItemSubHead}>{phone}</div>
                        </div>
                        <div className={styles.qrContentItem}>
                            <div className={styles.qrContentItemHead}>Количество пассажиров</div>
                            <div className={styles.qrContentItemSubHead}>{peopleCount}</div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FormGroupSuccesfull;
