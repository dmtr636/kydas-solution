import React, { useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { IconBack, IconLogoMetroShort, IconTelephone } from "src/ui/assets/icons";
import { useNavigate, useParams } from "react-router-dom";
import { store } from "src/app/AppStore.ts";
import axios from "axios";
import { ADMIN_REQUESTS_ENDPOINT } from "src/shared/api/endpoints.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";

const StaffAppHeader = ({ currentPath }: { currentPath: string }) => {
    const { id } = useParams<{ id: string }>();
    const [request, setRequest] = useState<IRequest | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`${ADMIN_REQUESTS_ENDPOINT}/${id}`).then((r) => {
                setRequest(r.data);
            });
        }
    }, []);
    const requestId = request?.number;
    const navigate = useNavigate();

    const getPageName = () => {
        if (currentPath === "/staffapp" || currentPath === "/staffapp/") {
            return "Главная";
        } else if (id) {
            return `Заявка М-${requestId}`;
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
    const IconFirst =
        getPageName() === "Главная" ? (
            <IconLogoMetroShort style={{ marginLeft: "16px" }} />
        ) : (
            <IconBack />
        );

    return (
        <div className={styles.container}>
            <button onClick={() => navigate(-1)} className={styles.pageIcon}>
                {IconFirst}
            </button>
            <div className={styles.pagename}>{getPageName()}</div>
            <button className={styles.pageIcon}>
                <a href="tel:+7 (495) 622-73-41">
                    <IconTelephone />
                </a>
            </button>
        </div>
    );
};

export default StaffAppHeader;
