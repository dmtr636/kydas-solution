import { observer } from "mobx-react-lite";
import styles from "./styles.module.scss";
import { LogoMetro } from "src/ui/assets/icons";
import { clsx } from "clsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { Link } from "react-router-dom";

export const HeaderRequest = observer(() => {
    return (
        <header className={styles.container}>
            <div className={styles.content}>
                <a href={"#user"} tabIndex={0} className={styles.tp}>
                    Перейти к заполнению заявки
                </a>
                <div className={styles.logo}>
                    <LogoMetro aria-label={"Логотип Московского метрополитена"} />
                </div>
                <div className={styles.divider}></div>
                <nav aria-label="Навигационное меню" className={styles.navlinks}>
                    <Link
                        to={"/request"}
                        aria-current={true}
                        className={clsx(styles.navlinkItem, styles.active)}
                    >
                        Составление заявки
                    </Link>
                    <a
                        href="https://mosmetro.ru/passengers/services/accessibility-center/about"
                        className={styles.navlinkItem}
                    >
                        О центре мобильности
                    </a>
                    <a
                        href="https://mosmetro.ru/passengers/services/accessibility-center/rules"
                        className={styles.navlinkItem}
                    >
                        Порядок предоставления услуг
                    </a>
                    <a
                        href="https://mosmetro.ru/passengers/services/accessibility-center/accessibility"
                        className={styles.navlinkItem}
                    >
                        Доступность метрополитена
                    </a>
                </nav>
                <div className={styles.button}>
                    <Button size={"medium"} type={"primary"} mode={"brand"}>
                        Личный кабинет
                    </Button>
                </div>
            </div>
        </header>
    );
});
