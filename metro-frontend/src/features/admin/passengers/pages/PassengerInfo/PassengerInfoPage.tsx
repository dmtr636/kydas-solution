import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { IconBasket, IconEdit, IconHeart, IconPlus } from "src/ui/assets/icons";
import { useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BreadCrumb } from "src/ui/components/solutions/Breadcrumbs/BreadCrumbs.tsx";
import { IPassengerTypes } from "src/features/admin/passengers/utils/passengerTypes.ts";
import { PassengerInfo } from "src/features/admin/passengers/PassengerInfo/PassengerInfo.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import styles from "src/features/admin/passengers/pages/PassengersEdit/styles.module.scss";
import { DeleteOverlay } from "src/ui/components/segments/overlays/DeleteOverlay/DeleteOverlay.tsx";

export const PassengerInfoPage = observer(() => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [showDeleteOverlay, setShowDeleteOverlay] = useState(false);

    const currentPassager: IPassengerTypes | null = store.passengers?.request;

    useLayoutEffect(() => {
        if (id) {
            store.passengers.fetchById(id);
            store.request.fetchAllByFilter({ passengerId: id });
        }
    }, [id]);

    const getBreadcrumbs = () => {
        const breadcrumbs: BreadCrumb[] = [];
        breadcrumbs.push({
            name: "Пассажиры",
            icon: <IconHeart />,
            onClick: () => navigate("/admin/passengers"),
        });
        breadcrumbs.push({
            name: currentPassager ? currentPassager?.fullName : "...",
        });
        return breadcrumbs;
    };

    const getActions = () => {
        const actions = [];
        actions.push(
            <Button
                key={"add"}
                type={"primary"}
                iconBefore={<IconPlus />}
                onClick={() => {
                    if (currentPassager) {
                        store.request.requestForm = {
                            info: {
                                fullName: currentPassager?.fullName,
                                phone: currentPassager?.phone,
                                phoneDescription: currentPassager?.phoneDescription,
                                phoneSecondary: currentPassager?.phoneSecondaryDescription,
                                groupId: currentPassager?.groupId,
                                pacemaker: currentPassager?.pacemaker,
                                sex: currentPassager?.sex,
                            },
                        } as IRequest;
                    }
                    navigate(`/admin/requests/add?passengerId=${currentPassager?.id}`);
                }}
            >
                Добавить заявку
            </Button>,
            <Button
                key={"edit"}
                type={"secondary"}
                iconBefore={<IconEdit />}
                onClick={() => {
                    store.passengers.updateRequest(
                        {
                            ...(currentPassager as any),
                            lockedEdit: true,
                        },
                        false,
                    );
                    navigate(`/admin/passengers/${currentPassager?.id}/edit`);
                }}
                disabled={currentPassager?.lockedEdit === true}
            >
                Редактировать
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
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={"Пассажиры"}
            breadCrumbs={getBreadcrumbs()}
            actions={getActions()}
        >
            <PassengerInfo />
            <DeleteOverlay
                open={showDeleteOverlay}
                title={"Удаление пассажира"}
                subtitle={"Будет удален следующий пассажир"}
                info={`${currentPassager?.fullName}`}
                deleteButtonLabel={"Подтвердить удаление"}
                onDelete={() =>
                    currentPassager &&
                    store.passengers.deleteRequest(currentPassager, () =>
                        navigate("/admin/passengers"),
                    )
                }
                onCancel={() => setShowDeleteOverlay(false)}
                loading={store.passengers.loader.loading}
            />
        </AdminPageContentLayout>
    );
});
