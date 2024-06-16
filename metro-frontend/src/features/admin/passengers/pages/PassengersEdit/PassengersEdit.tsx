import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconBasket, IconHeart } from "src/ui/assets/icons";
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.scss";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { DeleteOverlay } from "src/ui/components/segments/overlays/DeleteOverlay/DeleteOverlay.tsx";
import { PassengerForm } from "src/features/admin/passengers/PassengerForm/PassengerForm.tsx";
import { useNavigateBack } from "src/shared/hooks/useNavigateBack.ts";

export const PassengersEdit = observer(() => {
    const { id } = useParams<{ id: string }>();
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);
    const navigate = useNavigate();
    const currentPass = store.passengers.request;
    const navigateBack = useNavigateBack();

    useEffect(() => {
        return () => {
            if (store.passengers.request && store.passengers.request.lockedEdit) {
                store.passengers.updateRequest(
                    {
                        ...(store.passengers.request as any),
                        lockedEdit: null,
                    },
                    false,
                );
            }
        };
    }, []);

    useEffect(() => {
        if (store.passengers.request) {
            store.passengers.updateRequest(
                {
                    ...(store.passengers.request as any),
                    lockedEdit: true,
                },
                false,
            );
        }
    }, [!!store.passengers.request]);

    useEffect(() => {
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("unload", onUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("unload", onUnload);
        };
    }, [JSON.stringify(currentPass), JSON.stringify(store.passengers.requestForm)]);

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
        if (JSON.stringify(currentPass) !== JSON.stringify(store.passengers.requestForm)) {
            e.preventDefault();
        }
        return false;
    };

    const onUnload = () => {
        if (store.passengers.request) {
            store.passengers.updateRequest(
                {
                    ...(store.passengers.request as any),
                    lockedEdit: null,
                },
                false,
            );
        }
    };

    useLayoutEffect(() => {
        if (id && currentPass?.id !== Number(id)) {
            store.passengers.clearRequest();
            store.passengers.fetchById(id);
        }
        return () => {
            store.passengers.requestForm = null;
        };
    }, [id]);

    useLayoutEffect(() => {
        store.passengers.requestForm = JSON.parse(JSON.stringify(currentPass));
    }, [currentPass]);

    const handleSave = async () => {
        if (store.passengers.requestForm) {
            const result = await store.passengers.updateRequest({
                ...store.passengers.requestForm,
            });
            await store.passengers.updateRequest(
                {
                    ...store.passengers.requestForm,
                    lockedEdit: null,
                },
                false,
            );
            if (currentPass) {
                currentPass.lockedEdit = null;
            }
            if (result.status) {
                navigateBack({ default: `/admin/passengers/${id}` });
            }
        }
    };

    const getActions = () => {
        const actions = [];
        if (!currentPass) {
            actions.push(<Skeleton height={44} key={"skeleton"} width={608} />);
        } else {
            actions.push(
                <Button
                    key={"save"}
                    type={"primary"}
                    onClick={handleSave}
                    loading={store.passengers.loader.loading}
                    disabled={
                        !store.passengers.isFormValid ||
                        JSON.stringify(currentPass) === JSON.stringify(store.passengers.requestForm)
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
                        navigateBack({ default: `/admin/passengers/${id}` });
                        store.passengers.updateRequest(
                            {
                                ...currentPass,
                                lockedEdit: null,
                            },
                            false,
                        );
                        if (currentPass) {
                            currentPass.lockedEdit = null;
                        }
                    }}
                >
                    Отменить редактирование
                </Button>,
            );
            if (["ROOT", "ADMIN"].includes(store.account.currentUser?.role ?? "")) {
                actions.push(
                    <Button
                        key={"delete"}
                        type={"secondary"}
                        mode={"negative"}
                        iconBefore={<IconBasket />}
                        className={styles.deleteButton}
                        onClick={() => {
                            setShowDeleteOverlay(
                                true,
                                /*false*/
                            );
                        }}
                    >
                        Удалить пассажира
                    </Button>,
                );
            }

            /*if (currentPass.status === "NEW") {
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
                    </Button>
                );
            }*/
        }
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={`Редактирование ${currentPass?.fullName}`}
            actions={getActions()}
            breadCrumbs={[
                {
                    name: "Пассажиры",
                    icon: <IconHeart />,
                    onClick: () => navigate("/admin/passengers"),
                },
                {
                    name: ` ${currentPass?.fullName}`,
                },
            ]}
        >
            <PassengerForm type={"edit"} />
            <DeleteOverlay
                open={showDeleteOverlay}
                title={"Удаление пассажира"}
                subtitle={"Будет удален следующий пассажир"}
                info={`${currentPass?.fullName}`}
                deleteButtonLabel={"Подтвердить удаление"}
                onDelete={() =>
                    currentPass &&
                    store.passengers.deleteRequest(currentPass, () =>
                        navigate("/admin/requests", { replace: true }),
                    )
                }
                onCancel={() => setShowDeleteOverlay(false)}
                loading={store.passengers.loader.loading}
            />
        </AdminPageContentLayout>
    );
});
