import React from "react";
import styles from "./styles.module.scss";
import { IconDocument, IconHome, IconNotification, IconUser } from "src/ui/assets/icons";
import { Badge } from "src/ui/components/info/Badge/Badge.tsx";
import { clsx } from "clsx";
import { observer } from "mobx-react-lite";
import { store } from "src/app/AppStore.ts";
import { useNavigate, useParams } from "react-router-dom";

const StaffAppFooter = observer(({ currentPath }: { currentPath: string }) => {
    const { id } = useParams<{ id: string }>();
    const getPageName = () => {
        if (currentPath === "/staffapp" || currentPath === "/staffapp/") {
            return "Главная";
        } else if (id) {
            return `Заявки`;
        } else if (currentPath.startsWith("/staffapp/requests")) {
            return "Заявки";
        } else if (currentPath.startsWith("/staffapp/messages")) {
            return "Уведомления";
        } else if (currentPath.startsWith("/staffapp/user")) {
            return "Профиль";
        } else {
            return "";
        }
    };
    const navigate = useNavigate();
    return (
        <div className={clsx(styles.container /*, { [styles.activeTask]: id }*/)}>
            <button onClick={() => navigate("/staffapp")} className={styles.tab}>
                <div
                    className={clsx(styles.tabIcon, {
                        [styles.active]: getPageName() === "Главная",
                    })}
                >
                    <IconHome />
                </div>
                <div
                    className={clsx(styles.tabText, {
                        [styles.active]: getPageName() === "Главная",
                    })}
                >
                    Главная
                </div>
            </button>
            <button onClick={() => navigate("/staffapp/requests")} className={styles.tab}>
                <div
                    className={clsx(styles.tabIcon, {
                        [styles.active]: getPageName() === "Заявки",
                    })}
                >
                    <IconDocument />
                </div>
                <div
                    className={clsx(styles.tabText, {
                        [styles.active]: getPageName() === "Заявки",
                    })}
                >
                    Заявки
                </div>
            </button>
            {store.staffApp.notificationCount === 0 ? (
                <button onClick={() => navigate("/staffapp/messages")} className={styles.tab}>
                    <div
                        className={clsx(styles.tabIcon, {
                            [styles.active]: getPageName() === "Уведомления",
                        })}
                    >
                        <IconNotification />
                    </div>
                    <div
                        className={clsx(styles.tabText, {
                            [styles.active]: getPageName() === "Уведомления",
                        })}
                    >
                        Уведомления
                    </div>
                </button>
            ) : (
                <button onClick={() => navigate("/staffapp/messages")} className={styles.tab}>
                    <div
                        className={clsx(styles.tabIcon, {
                            [styles.active]: getPageName() === "Уведомления",
                        })}
                    >
                        <Badge mode={"negative"} value={store.staffApp.notificationCount}>
                            <IconNotification />
                        </Badge>
                    </div>
                    <div
                        className={clsx(styles.tabText, {
                            [styles.active]: getPageName() === "Уведомления",
                        })}
                    >
                        Уведомления
                    </div>
                </button>
            )}
            <button onClick={() => navigate("/staffapp/user")} className={styles.tab}>
                <div
                    className={clsx(styles.tabIcon, {
                        [styles.active]: getPageName() === "Профиль",
                    })}
                >
                    <IconUser />
                </div>
                <div
                    className={clsx(styles.tabText, {
                        [styles.active]: getPageName() === "Профиль",
                    })}
                >
                    Профиль
                </div>
            </button>
        </div>
    );
});

export default StaffAppFooter;
