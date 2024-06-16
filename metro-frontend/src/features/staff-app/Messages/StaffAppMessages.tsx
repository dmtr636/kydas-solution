import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { clsx } from "clsx";
import MessageCard from "src/features/staff-app/MessageCard/MessageCard.tsx";
import { observer } from "mobx-react-lite";
import { store } from "src/app/AppStore.ts";
import { IconSearch } from "src/ui/assets/icons";

type Status = "CREATE_REQUEST" | "EDIT_REQUEST" | "CANCEL_REQUEST";
const StaffAppMessages = observer(() => {
    const [messagesisRead, setMessagesRead] = useState("read");

    useEffect(() => {
        store.user.fetchUsers();
    }, []);

    const allowedActions: Status[] = ["CREATE_REQUEST", "EDIT_REQUEST", "CANCEL_REQUEST"];

    function filterRequests(requests: any[], allowedActions: Status[]): any[] {
        return requests.filter((request) => allowedActions.includes(request.action));
    }

    const notifications = store.notification.notifications.filter((notification) =>
        store.request.requests.some((r) => r.id === notification.requestId),
    );

    const filteredRequests = filterRequests(notifications, allowedActions);
    const messagesRead = filteredRequests
        .sort((a, b) => b.createDate.localeCompare(a.createDate))
        .filter((n) => n.isRead === true)
        .map((message) => <MessageCard data={message} key={message.id} />);

    const MessagesUnreaded = filteredRequests
        .sort((a, b) => b.createDate.localeCompare(a.createDate))
        .filter((n) => n.isRead === false)
        .map((message) => <MessageCard data={message} key={message.id} />);

    return (
        <div className={styles.container}>
            <div className={styles.headContainer}>
                <button
                    onClick={() => setMessagesRead("read")}
                    className={clsx(styles.today, { [styles.active]: messagesisRead === "read" })}
                >
                    Новые
                </button>
                <div className={clsx(styles.divider, styles.active)}></div>
                <button
                    onClick={() => setMessagesRead("unread")}
                    className={clsx(styles.lastday, {
                        [styles.active]: messagesisRead === "unread",
                    })}
                >
                    Прочитанные
                </button>
            </div>
            <div>
                <div className={styles.MessagesArray}>
                    {messagesisRead === "read" ? (
                        MessagesUnreaded.length === 0 ? (
                            <div className={styles.arrayIsEmpty}>
                                <IconSearch />
                                <div className={styles.arrayIsEmptyText}>
                                    Новые Уведомления <br />
                                    отсутствуют
                                </div>
                            </div>
                        ) : (
                            MessagesUnreaded
                        )
                    ) : messagesRead.length === 0 ? (
                        <div className={styles.arrayIsEmpty}>
                            <IconSearch />
                            <div className={styles.arrayIsEmptyText}>
                                Нет прочитанных <br />
                                уведомлений
                            </div>
                        </div>
                    ) : (
                        messagesRead
                    )}
                </div>
                {/*<div className={styles.arrayIsEmpty}>
                    <IconSearch />
                    <div className={styles.arrayIsEmptyText}>Новые Уведомления <br />
                        отсутствуют
                    </div>
                </div>*/}
            </div>
        </div>
    );
});

export default StaffAppMessages;
