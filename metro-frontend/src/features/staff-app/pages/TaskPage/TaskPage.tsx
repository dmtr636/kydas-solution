import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./styles.module.scss";
import StaffAppHeader from "src/features/staff-app/Header/StaffAppHeader.tsx";

import StaffAppFooter from "src/features/staff-app/Footer/StaffAppFooter.tsx";
import { observer } from "mobx-react-lite";
import { store } from "src/app/AppStore.ts";
import { clsx } from "clsx";
import TaskInfo from "src/features/staff-app/TaskInfo/TaskInfo.tsx";
import TaskConvoy from "src/features/staff-app/TaskConvoy/TaskConvoy.tsx";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import axios from "axios";
import { ADMIN_REQUESTS_ENDPOINT } from "src/shared/api/endpoints.ts";
import { Helmet } from "react-helmet";

const TaskPage = observer(() => {
    const [idTasks, setIdTasks] = useState<string | undefined>("");
    /* useEffect(() => {
         setIdTasks(id);
         if (idTasks) {
             store.request.fetchById(idTasks);
         }

         /!*store.request.fetchAllByFilter({});*!/
         store.staffApp.fetchEmpolees();
     }, [id]);*/
    const { id } = useParams<{ id: string }>();
    const [request, setRequest] = useState<IRequest | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`${ADMIN_REQUESTS_ENDPOINT}/${id}`).then((r) => {
                setRequest(r.data);
            });
        }
        store.staffApp.fetchEmpolees();
    }, []);
    useEffect(() => {
        const handleResize = () => setHeight(window.innerHeight);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const [height, setHeight] = useState(window.innerHeight);
    const [messagesisRead, setMessagesRead] = useState("task");
    const location = useLocation();
    const currentPath = location.pathname;
    return (
        <div className={styles.Mockupcontainer} style={{ height: height }}>
            <Helmet>
                <title>Приложение инспектора</title>
            </Helmet>
            <div className={styles.mockup}>
                <div className={styles.container}>
                    <StaffAppHeader currentPath={currentPath} />
                    <div className={styles.content}>
                        <div className={styles.headContainer}>
                            <button
                                onClick={() => setMessagesRead("task")}
                                className={clsx(styles.today, {
                                    [styles.active]: messagesisRead === "task",
                                })}
                            >
                                Сопровождение
                            </button>
                            <div className={clsx(styles.divider, styles.active)}></div>
                            <button
                                onClick={() => setMessagesRead("info")}
                                className={clsx(styles.lastday, {
                                    [styles.active]: messagesisRead === "info",
                                })}
                            >
                                Информация
                            </button>
                        </div>
                        {messagesisRead === "info" && request && <TaskInfo data={request} />}
                        {messagesisRead === "task" && request && (
                            <TaskConvoy setRequest={setRequest} data={request} />
                        )}
                    </div>

                    <StaffAppFooter currentPath={currentPath} />
                </div>
            </div>
        </div>
    );
});

export default TaskPage;
