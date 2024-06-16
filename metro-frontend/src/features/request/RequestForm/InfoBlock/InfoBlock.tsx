import React from "react";
import styles from "src/features/request/RequestForm/styles.module.scss";
import {
    IconAppGaleryMetro,
    IconAppStoreMetro,
    IconGPMetro,
    IconPhoneMetro,
} from "src/ui/assets/icons";

const InfoBlock = () => {
    return (
        <div className={styles.containerRight}>
            <div className={styles.containerHeader}>
                Как ещё обратиться за помощью <br />в ЦОМП?
            </div>
            <div className={styles.text}>Телефоны поддержки</div>
            <div className={styles.phoneContainer}>
                <div className={styles.icon}>
                    <IconPhoneMetro />
                </div>
                <div className={styles.phones}>
                    <a className={styles.phonesItem} href="tel:+7 (495) 622-73-41">
                        +7 (495) 622-73-41
                    </a>
                    <a className={styles.phonesItem} href="tel:+7 (800) 250-73-41">
                        +7 (800) 250-73-41
                    </a>
                </div>
            </div>
            <div className={styles.text}>В мобильном приложении</div>
            <div className={styles.appsIcons}>
                <a
                    rel="noreferrer"
                    target="_blank"
                    aria-label="google play"
                    href="https://play.google.com/store/apps/details?id=ru.mosmetro.metro&hl=ru&gl=US"
                >
                    <IconGPMetro className={styles.appIcon} />
                </a>
                <a
                    rel="noreferrer"
                    target="_blank"
                    aria-label="appgallery"
                    href="https://appgallery.huawei.com/#/app/C101464617"
                >
                    <IconAppGaleryMetro className={styles.appIcon} />
                </a>
                <a
                    rel="noreferrer"
                    target="_blank"
                    aria-label="apple apps"
                    href="https://apps.apple.com/ru/app/%D0%BC%D0%B5%D1%82%D1%80%D0%BE-%D0%BC%D0%BE%D1%81%D0%BA%D0%B2%D1%8B-%D0%BC%D1%86%D0%B4-%D0%B8-%D0%BC%D1%86%D0%BA/id1093391186/"
                >
                    <IconAppStoreMetro className={styles.appIcon} />
                </a>
            </div>
        </div>
    );
};

export default InfoBlock;
