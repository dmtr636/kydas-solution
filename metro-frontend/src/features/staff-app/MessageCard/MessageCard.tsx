import React from "react";
import styles from "./styles.module.scss";
import clsx from "clsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { store } from "src/app/AppStore.ts";
import { INotification } from "src/features/admin/notifications/types/INotification.ts";

const MessageCard = ({ data }: { data: any }) => {
    const cardDate = new Date(data.createDate);

    function addLeadingZero(number: number) {
        // Преобразуем число в строку
        const numberString = number.toString();

        // Если длина строки равна 1, добавляем в начало ноль
        if (numberString.length === 1) {
            return "0" + numberString;
        }

        // Возвращаем число как строку без изменений, если длина больше 1
        return numberString;
    }

    function generateMessage(status: "CREATE_REQUEST" | "EDIT_REQUEST" | "CANCEL_REQUEST"): string {
        let message = "";
        switch (status) {
            case "CREATE_REQUEST":
                message = `Назначена новая заявка.`;
                break;
            case "EDIT_REQUEST":
                message = `Данные заявки изменены.`;
                break;
            case "CANCEL_REQUEST":
                message = `Заявка была отменена.`;
                break;
            default:
                message = "Статус не распознан";
                break;
        }
        return message;
    }

    return (
        <button className={clsx(styles.container, { [styles.unread]: !data.isRead })}>
            <div className={clsx(styles.headerContainer)}>
                <div className={clsx(styles.header, { [styles.unread]: !data.isRead })}>
                    Заявка М-{data.requestNumber}
                    <div className={styles.author}>{store.user.getById(data.userId)?.name}</div>
                </div>
                {!data.isRead ? (
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
            <div className={styles.body}>{generateMessage(data.action)}</div>
            {!data.isRead && (
                <Button
                    onClick={() =>
                        store.notification.updateNotification({
                            ...data,
                            isRead: true,
                        })
                    }
                    style={{ marginTop: "16px" }}
                    type={"outlined"}
                    fullWidth={true}
                    mode={"brand"}
                >
                    Отметить прочитанным
                </Button>
            )}
        </button>
    );
};

export default MessageCard;
