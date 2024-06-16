import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconBasket, IconDocument } from "src/ui/assets/icons";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./RequestEditPage.module.scss";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { DeleteOverlay } from "src/ui/components/segments/overlays/DeleteOverlay/DeleteOverlay.tsx";
import { RequestForm } from "src/features/admin/requests/components/RequestForm/RequestForm.tsx";
import { useNavigateBack } from "src/shared/hooks/useNavigateBack.ts";

export const RequestEditPage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const navigate = useNavigate();
    const navigateBack = useNavigateBack();
    const currentRequest = store.request.request;

    useEffect(() => {
        return () => {
            if (store.request.request && store.request.request.lockedEdit) {
                store.request.updateRequest(
                    {
                        ...store.request.request,
                        lockedEdit: null,
                    },
                    false,
                );
            }
        };
    }, []);

    useEffect(() => {
        if (store.request.request) {
            store.request.updateRequestWithoutLoader(
                {
                    ...store.request.request,
                    lockedEdit: true,
                },
                false,
            );
        }
    }, [!!store.request.request]);

    useEffect(() => {
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("unload", onUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("unload", onUnload);
        };
    }, [JSON.stringify(currentRequest), JSON.stringify(store.request.requestForm)]);

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (JSON.stringify(currentRequest) !== JSON.stringify(store.request.requestForm)) {
            e.preventDefault();
        }
        return false;
    };

    const onUnload = () => {
        if (store.request.request) {
            store.request.updateRequest(
                {
                    ...store.request.request,
                    lockedEdit: null,
                },
                false,
            );
        }
    };

    useLayoutEffect(() => {
        if (id && currentRequest?.id !== id) {
            store.request.clearRequest();
            store.request.fetchById(id);
        }
        return () => {
            store.request.requestForm = null;
        };
    }, [id]);

    useLayoutEffect(() => {
        store.request.requestForm = JSON.parse(JSON.stringify(currentRequest));
    }, [currentRequest]);

    const handleSave = async () => {
        if (store.request.requestForm) {
            const result = await store.request.updateRequest({
                ...store.request.requestForm,
            });
            await store.request.updateRequest(
                {
                    ...store.request.requestForm,
                    lockedEdit: null,
                },
                false,
            );
            if (currentRequest) {
                currentRequest.lockedEdit = null;
            }
            if (result.status) {
                navigateBack({ default: `/admin/requests/${id}` });
            }
        }
    };

    const getActions = () => {
        const actions = [];
        if (!currentRequest) {
            actions.push(<Skeleton height={44} key={"skeleton"} width={608} />);
        } else {
            actions.push(
                <Button
                    key={"save"}
                    type={"primary"}
                    onClick={handleSave}
                    loading={store.request.loader.loading}
                    disabled={
                        !store.request.isFormValid ||
                        JSON.stringify(currentRequest) === JSON.stringify(store.request.requestForm)
                    }
                >
                    Сохранить изменения
                </Button>,
            );
            actions.push(
                <Button
                    key={"edit"}
                    type={"secondary"}
                    onClick={() => {
                        navigateBack({ default: `/admin/requests/${id}` });
                        store.request.updateRequest(
                            {
                                ...currentRequest,
                                lockedEdit: null,
                            },
                            false,
                        );
                        if (currentRequest) {
                            currentRequest.lockedEdit = null;
                        }
                    }}
                >
                    Отменить редактирование
                </Button>,
            );
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
                    >
                        Удалить заявку
                    </Button>,
                );
            }
        }
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={`Заявка M-${currentRequest?.number ?? ""}`}
            actions={getActions()}
            breadCrumbs={[
                {
                    name: "Заявки",
                    icon: <IconDocument />,
                    onClick: () => navigate("/admin/requests"),
                },
                {
                    name: `Заявка ${currentRequest?.number ? "M-" + currentRequest.number : ""}`,
                },
            ]}
        >
            <RequestForm type={"edit"} />
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
        </AdminPageContentLayout>
    );
});
