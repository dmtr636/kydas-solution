import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import styles from "./HomePage.module.scss";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { useEffect, useState } from "react";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconDocument, IconNotification, IconPlay1 } from "src/ui/assets/icons";
import { useNavigate } from "react-router-dom";

export const HomePage = observer(() => {
    useEffect(() => {
        store.request.fetchAllByFilter({
            tripDate: new Date().toLocaleDateString(),
        });
        store.account.currentUser?.role;
    }, []);

    function getRoleName(accessLevel: string): string {
        const roles: { [key: string]: string } = {
            ROOT: "администратор",
            ADMIN: "администратор",
            SPECIALIST: "специалист",
            OPERATOR: "оператор",
            EMPLOYEE: "инспектор",
        };
        return roles[accessLevel] || "Неизвестная роль";
    }

    const navigate = useNavigate();
    return (
        <AdminPageContentLayout title={"Главная"}>
            <div className={styles.container}>
                <div style={{ width: 516 }} className={styles.block}>
                    <Typo style={{ color: "#003EDE", marginBottom: 49 }} variant={"h5"}>
                        Добро пожаловать,{" "}
                        {store.account.currentUser?.role &&
                            getRoleName(store.account.currentUser?.role)}
                        !
                    </Typo>
                    <Typo variant={"h5"}>Видеообзор работы нашего решения</Typo>
                    <div className={styles.youtube}>
                        <iframe
                            style={{ borderRadius: 8 }}
                            width="452"
                            height="254"
                            src={`${store?.adminLayout?.layoutData?.videoLink}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <div className={styles.right}>
                    <div className={styles.block}>
                        <Typo style={{ color: "#003EDE", marginBottom: 24 }} variant={"h5"}>
                            Заявки на сегодня
                        </Typo>
                        <div className={styles.divider}></div>
                        <div className={styles.body}>
                            <div className={styles.text}>
                                <Typo variant={"actionL"}>Принятые заявки на сопровождение</Typo>
                                <Typo style={{ color: "#003EDE" }} variant={"h5"}>
                                    {
                                        store.request.requests.filter(
                                            (r) => r.status === "CONFIRMED",
                                        ).length
                                    }
                                </Typo>
                            </div>

                            <div className={styles.text}>
                                {store.request.newRequests.length ? (
                                    <>
                                        <Typo variant={"actionL"}>Ещё ожидают подтверждения</Typo>
                                        <Typo style={{ color: "#003EDE" }} variant={"h5"}>
                                            {store.request.newRequests.length}
                                        </Typo>
                                    </>
                                ) : (
                                    <Typo variant={"actionL"}>Все заявки подтверждены!</Typo>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate("/admin/requests")}
                            iconBefore={<IconDocument />}
                        >
                            Перейти
                        </Button>
                    </div>
                    <div className={styles.block}>
                        <Typo style={{ color: "#003EDE", marginBottom: 24 }} variant={"h5"}>
                            Уведомления
                        </Typo>
                        <div className={styles.divider}></div>
                        <div className={styles.body}>
                            <div className={styles.text}>
                                {store.notification.sidebarCounter ? (
                                    <>
                                        <Typo variant={"actionL"}>Новые уведомления</Typo>{" "}
                                        <Typo style={{ color: "#003EDE" }} variant={"h5"}>
                                            {store.notification.sidebarCounter}
                                        </Typo>
                                    </>
                                ) : (
                                    <Typo variant={"actionL"}>Новых уведомлений нет!</Typo>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={() => navigate("/admin/notifications")}
                            iconBefore={<IconNotification />}
                        >
                            Перейти
                        </Button>
                    </div>
                </div>
            </div>
        </AdminPageContentLayout>
    );
});
