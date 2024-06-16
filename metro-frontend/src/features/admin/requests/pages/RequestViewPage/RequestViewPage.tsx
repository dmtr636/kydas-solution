import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import {
    IconBasket,
    IconDocument,
    IconEdit,
    IconNotification,
    IconSuccess,
    IconTime,
} from "src/ui/assets/icons";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RequestViewPage.module.scss";
import { RequestInfo } from "src/features/admin/requests/components/RequestInfo/RequestInfo.tsx";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { DeleteOverlay } from "src/ui/components/segments/overlays/DeleteOverlay/DeleteOverlay.tsx";
import { BreadCrumb } from "src/ui/components/solutions/Breadcrumbs/BreadCrumbs.tsx";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import { getMinutesDifference, getMinutesText, getTimeDifference } from "src/shared/utils/time.ts";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import dayjs from "dayjs";

export const RequestViewPage = observer((props?: { fromNotifications?: boolean }) => {
    const { id } = useParams<{ id: string }>();
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const [showCorrectOverlay, setShowCorrectOverlay] = useState(false);
    const navigate = useNavigate();
    const currentRequest = store.request.request;
    const [newEndDate, setNewEndDate] = useState<string | null>(null);

    useLayoutEffect(() => {
        if (id && currentRequest?.id !== id) {
            store.request.clearRequest();
            store.request.fetchById(id);
        }
    }, [id]);

    const getActions = () => {
        const actions = [];
        if (!currentRequest) {
            actions.push(<Skeleton height={44} key={"skeleton"} width={608} />);
        } else {
            if (currentRequest.status === "NEW") {
                actions.push(
                    <Button
                        key={"confirm"}
                        type={"primary"}
                        mode={"positive"}
                        iconBefore={<IconSuccess />}
                        onClick={() => {
                            store.request.confirmRequest(currentRequest);
                        }}
                        loading={store.request.confirmLoading}
                        disabled={currentRequest.lockedEdit === true}
                    >
                        Подтвердить заявку
                    </Button>,
                );
            }
            actions.push(
                <Button
                    key={"edit"}
                    type={"secondary"}
                    iconBefore={<IconEdit />}
                    onClick={() => {
                        navigate(`/admin/requests/${id}/edit`);
                        store.request.updateRequestWithoutLoader(
                            {
                                ...currentRequest,
                                lockedEdit: true,
                            },
                            false,
                        );
                    }}
                    disabled={currentRequest.lockedEdit === true}
                >
                    Редактировать
                </Button>,
                <Button
                    key={"history"}
                    type={"secondary"}
                    onClick={() => {
                        navigate(`/admin/requests/${id}/history`);
                    }}
                >
                    История изменений
                </Button>,
            );

            if (currentRequest.status === "CONFIRMED") {
                actions.push(
                    <Button
                        key={"correct"}
                        type={"secondary"}
                        iconBefore={<IconTime />}
                        onClick={() => {
                            setShowCorrectOverlay(true);
                            setNewEndDate(currentRequest?.info.tripDateEnd);
                        }}
                    >
                        Корректировка времени
                    </Button>,
                );
            }

            if (
                currentRequest.status === "NEW" &&
                ["ROOT", "ADMIN"].includes(store.account.currentUser?.role ?? "")
            ) {
                actions.push(
                    <Button
                        key={"delete"}
                        type={"secondary"}
                        mode={"negative"}
                        iconBefore={<IconBasket />}
                        className={styles.deleteRequestButton}
                        onClick={() => {
                            setShowDeleteOverlay(true);
                        }}
                        disabled={currentRequest.lockedEdit === true}
                    >
                        Удалить заявку
                    </Button>,
                );
            }
        }
        return actions;
    };

    const getBreadcrumbs = () => {
        const breadcrumbs: BreadCrumb[] = [];
        if (props?.fromNotifications) {
            breadcrumbs.push({
                name: "Уведомления",
                icon: <IconNotification />,
                onClick: () => navigate("/admin/notifications"),
            });
        } else {
            breadcrumbs.push({
                name: "Заявки",
                icon: <IconDocument />,
                onClick: () => navigate("/admin/requests"),
            });
        }
        breadcrumbs.push({
            name: `Заявка ${currentRequest?.number ? "M-" + currentRequest.number : ""}`,
        });
        return breadcrumbs;
    };

    return (
        <AdminPageContentLayout
            title={`Заявка M-${currentRequest?.number ?? ""}`}
            actions={getActions()}
            breadCrumbs={getBreadcrumbs()}
        >
            <RequestInfo />
            <DeleteOverlay
                open={showDeleteOverlay}
                title={"Удаление заявки"}
                subtitle={"Будет удалена следующая заявка"}
                info={`Заявка M-${currentRequest?.number ?? ""}`}
                deleteButtonLabel={"Подтвердить удаление"}
                onDelete={() =>
                    currentRequest &&
                    store.request.deleteRequest(currentRequest, () => navigate("/admin/requests"))
                }
                onCancel={() => setShowDeleteOverlay(false)}
                loading={store.request.loader.loading}
            />
            <Overlay
                open={showCorrectOverlay}
                mode={"accent"}
                title={"Корректировка времени"}
                onClose={() => {
                    setShowCorrectOverlay(false);
                }}
                actions={[
                    <Button
                        key={"save"}
                        onClick={async () => {
                            if (currentRequest && newEndDate) {
                                await store.request.updateRequest({
                                    ...currentRequest,
                                    tripDuration: getTimeDifference(
                                        currentRequest.info.tripDate,
                                        newEndDate,
                                    ),
                                    info: {
                                        ...currentRequest.info,
                                        tripDateEnd: newEndDate,
                                    },
                                });
                            }
                            setShowCorrectOverlay(false);
                        }}
                        disabled={!newEndDate || newEndDate === currentRequest?.info.tripDateEnd}
                        loading={store.request.loader.loading}
                    >
                        Сохранить
                    </Button>,
                ]}
            >
                <div style={{ width: 470 }}>
                    <div style={{ width: 312 }}>
                        <DatePicker
                            value={newEndDate}
                            onChange={setNewEndDate}
                            disableClear={true}
                            formName={"Дата и время завершения"}
                            size={"large"}
                            formText={
                                newEndDate === currentRequest?.info.tripDateEnd ||
                                !currentRequest?.info.tripDateEnd ||
                                !newEndDate
                                    ? "Время не добавлено"
                                    : `Добавлено ${getMinutesDifference(currentRequest?.info.tripDateEnd, newEndDate)} ${getMinutesText(
                                          getMinutesDifference(
                                              currentRequest?.info.tripDateEnd,
                                              newEndDate,
                                          ),
                                      )}`
                            }
                        />
                    </div>
                    <div style={{ marginTop: 20 }}>
                        <Typo variant={"subheadXL"}>Увеличение длительности (мин)</Typo>
                    </div>
                    <div style={{ marginTop: 16, marginBottom: 80, display: "flex", gap: 12 }}>
                        <Button
                            type={"outlined"}
                            mode={"neutral"}
                            onClick={() => {
                                newEndDate &&
                                    setNewEndDate(dayjs(newEndDate).add(5, "minute").toISOString());
                            }}
                        >
                            +5 минут
                        </Button>
                        <Button
                            type={"outlined"}
                            mode={"neutral"}
                            onClick={() => {
                                newEndDate &&
                                    setNewEndDate(
                                        dayjs(newEndDate).add(10, "minute").toISOString(),
                                    );
                            }}
                        >
                            +10 минут
                        </Button>
                        <Button
                            type={"outlined"}
                            mode={"neutral"}
                            onClick={() => {
                                newEndDate &&
                                    setNewEndDate(
                                        dayjs(newEndDate).add(15, "minute").toISOString(),
                                    );
                            }}
                        >
                            +15 минут
                        </Button>
                    </div>
                </div>
            </Overlay>
        </AdminPageContentLayout>
    );
});
