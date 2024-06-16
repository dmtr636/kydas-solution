import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconDocument } from "src/ui/assets/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigateBack } from "src/shared/hooks/useNavigateBack.ts";
import { IPassengerTypes } from "src/features/admin/passengers/utils/passengerTypes.ts";
import { PassengerForm } from "src/features/admin/passengers/PassengerForm/PassengerForm.tsx";

export const PassengerAdd = observer(() => {
    const navigate = useNavigate();
    const navigateBack = useNavigateBack();

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
        store.passengers.requestForm = {
            phone: "",
            phoneDescription: "",
            fullName: "",
            pacemaker: false,
            groupId: null,
            comment: "",
        } as IPassengerTypes;
    }, []);

    const handleSave = async () => {
        if (store.passengers.requestForm) {
            const result = await store.passengers.createRequest(store.passengers.requestForm);
            if (result.status) {
                navigate(`/admin/passengers/${result.data.id}`, { replace: true });
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
                loading={store.passengers.loader.loading}
                disabled={!store.passengers.isFormValid}
            >
                Добавить
            </Button>,
        );
        actions.push(
            <Button
                key={"edit"}
                type={"secondary"}
                onClick={() => {
                    navigateBack({ default: "/admin/passengers" });
                }}
            >
                Отмена
            </Button>,
        );
        return actions;
    };

    return (
        <AdminPageContentLayout
            title={`Создание пассажира`}
            actions={getActions()}
            breadCrumbs={[
                {
                    name: "Пассажиры",
                    icon: <IconDocument />,
                    onClick: () => navigate("/admin/requests"),
                },
                {
                    name: `Создание пассажира`,
                },
            ]}
        >
            <PassengerForm type={"add"} />
        </AdminPageContentLayout>
    );
});
