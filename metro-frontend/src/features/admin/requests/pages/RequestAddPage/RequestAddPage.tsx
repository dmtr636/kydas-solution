import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconDocument } from "src/ui/assets/icons";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RequestForm } from "src/features/admin/requests/components/RequestForm/RequestForm.tsx";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { useNavigateBack } from "src/shared/hooks/useNavigateBack.ts";

export const RequestAddPage = observer(() => {
    const navigate = useNavigate();
    const navigateBack = useNavigateBack();
    const location = useLocation();

    useEffect(() => {
        window.addEventListener("beforeunload", onBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
        };
    }, []);

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
    };

    useEffect(() => {
        store.request.requestForm = {
            info: {
                phone: "",
                hasBaggage: false,
                wheelchairRequired: false,
                meetingPoint: "У входных дверей",
            },
        } as IRequest;
    }, []);

    useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            const passengerIdStr = params.get("passengerId");
            if (passengerIdStr && !Number.isNaN(passengerIdStr)) {
                const passengerId = Number(passengerIdStr);
                const passenger = store.passengers.requests.find((p) => p.id === passengerId);
                if (passenger) {
                    store.request.requestForm = {
                        info: {
                            hasBaggage: false,
                            wheelchairRequired: false,
                            meetingPoint: "У входных дверей",
                            ...passenger,
                        },
                        passengerId: passengerId,
                    } as unknown as IRequest;
                }
            }
        }
    }, [store.passengers.requests.length]);

    const handleSave = async () => {
        if (store.request.requestForm) {
            const result = await store.request.createRequest(store.request.requestForm);
            if (result.status) {
                const passenger = store.passengers.requests.find(
                    (p) => p.id === result.data.passengerId,
                );
                if (passenger) {
                    store.passengers.updateRequest(
                        {
                            ...passenger,
                            phone: result.data.info.phone ?? passenger.phone,
                            phoneDescription:
                                result.data.info.phoneDescription ?? passenger.phoneDescription,
                            phoneSecondary:
                                result.data.info.phoneSecondary ?? passenger.phoneSecondary,
                            phoneSecondaryDescription:
                                result.data.info.phoneSecondaryDescription ??
                                passenger.phoneSecondaryDescription,
                            sex: result.data.info.sex ?? (passenger.sex as any),
                            groupId: result.data.info.groupId ?? passenger.groupId,
                            pacemaker: result.data.info.pacemaker ?? passenger.pacemaker,
                            comment: result.data.info.comment ?? passenger.comment,
                            age: result.data.info.age ?? passenger.age,
                        },
                        false,
                    );
                }
                navigate(`/admin/requests/${result.data.id}`, { replace: true });
            }
        }
    };

    const getActions = () => {
        const actions = [];
        actions.push(
            <Button
                key={"save"}
                type={"primary"}
                onClick={handleSave}
                loading={store.request.loader.loading}
                disabled={!store.request.isFormValid}
            >
                Создать заявку
            </Button>,
        );
        actions.push(
            <Button
                key={"edit"}
                type={"secondary"}
                onClick={() => {
                    navigateBack({ default: "/admin/requests" });
                }}
            >
                Отмена
            </Button>,
        );
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={`Создание заявки`}
            actions={getActions()}
            breadCrumbs={[
                {
                    name: "Заявки",
                    icon: <IconDocument />,
                    onClick: () => navigate("/admin/requests"),
                },
                {
                    name: `Создание заявки`,
                },
            ]}
        >
            <RequestForm type={"add"} />
        </AdminPageContentLayout>
    );
});
