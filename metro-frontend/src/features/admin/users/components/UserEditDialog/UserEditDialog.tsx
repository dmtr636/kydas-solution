import styles from "./UserEditDialog.module.scss";
import { observer } from "mobx-react-lite";
import { store } from "src/app/AppStore.ts";
import { userRolesOptions } from "../../constants/userRoles.ts";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { SingleSelect } from "src/ui/components/inputs/Select/SingleSelect.tsx";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { useLayoutEffect, useState } from "react";
import { UserEditFormValues } from "src/features/admin/users/types/UserAddFormValues.ts";
import { User, UserRole } from "src/features/admin/users/types/User.ts";
import { IconBasket } from "src/ui/assets/icons";
import { DeleteOverlay } from "src/ui/components/segments/overlays/DeleteOverlay/DeleteOverlay.tsx";
import { Contact } from "src/ui/components/solutions/Contact/Contact.tsx";
import { ConfirmCloseOverlay } from "src/ui/components/segments/overlays/ConfirmCloseEditOverlay/ConfirmCloseOverlay.tsx";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";

interface UserAddDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValues: User | null;
}

const initialFormValues: UserEditFormValues = {
    email: "",
    role: "ADMIN",
    name: "",
};

export const UserEditDialog = observer((props: UserAddDialogProps) => {
    const [formValues, setFormValues] = useState<UserEditFormValues>(
        props.initialValues ?? initialFormValues,
    );
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showConfirmCloseDialog, setShowConfirmCloseDialog] = useState(false);
    const user = props.initialValues;

    useLayoutEffect(() => {
        if (props.open) {
            setFormValues(props.initialValues ?? initialFormValues);
        }
    }, [JSON.stringify(props.initialValues), props.open]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValid = () => {
        return emailRegex.test(formValues.email.trim()) && formValues.email && formValues.role;
    };

    const isChanged = () => {
        return (
            formValues.email !== user?.email ||
            formValues.role !== user?.role ||
            formValues.name !== user?.name
        );
    };

    const handleSave = async () => {
        if (!user) {
            return;
        }
        const response = await store.user.updateUser({
            ...user,
            ...formValues,
        });
        if (response.status) {
            snackbarStore.showPositiveSnackbar("Изменения сохранены");
            setShowConfirmCloseDialog(false);
            props.setOpen(false);
        }
    };

    const handleDelete = async () => {
        if (!user) {
            return;
        }
        const response = await store.user.deleteUser(user);
        if (response.status) {
            snackbarStore.showPositiveSnackbar("Доступ закрыт");
            props.setOpen(false);
            setShowDeleteDialog(false);
        }
    };

    const handleChange = (changes: Partial<UserEditFormValues>) => {
        setFormValues({
            ...formValues,
            ...changes,
        });
    };

    return (
        <>
            <Overlay
                open={props.open}
                onClose={() => {
                    props.setOpen(false);
                    if (isChanged()) {
                        setShowConfirmCloseDialog(true);
                    }
                }}
                title={"Редактирование"}
                mode={"accent"}
                actions={[
                    <Button
                        key="save"
                        type={"primary"}
                        disabled={!isValid() || !isChanged()}
                        onClick={handleSave}
                        loading={store.user.loading}
                    >
                        Сохранить
                    </Button>,
                    <Button
                        key="cancel"
                        type={"secondary"}
                        mode={"negative"}
                        iconBefore={<IconBasket />}
                        onClick={() => {
                            props.setOpen(false);
                            setShowDeleteDialog(true);
                        }}
                    >
                        Закрыть доступ
                    </Button>,
                ]}
            >
                <div className={styles.form}>
                    <EmailInput
                        value={formValues.email}
                        onChange={(email) => handleChange({ email })}
                        size={"large"}
                        showIcon={false}
                        disabled={true}
                    />
                    <SingleSelect
                        options={userRolesOptions}
                        value={formValues.role}
                        defaultValue={props.initialValues?.role}
                        onValueChange={(role) => handleChange({ role: role as UserRole })}
                        formName={"Роль"}
                        size={"large"}
                    />
                    <Input
                        formName={"Имя"}
                        value={formValues.name}
                        onChange={(event) => handleChange({ name: event.target.value })}
                        size={"large"}
                        placeholder={"Введите имя"}
                    />
                </div>
            </Overlay>
            <DeleteOverlay
                open={showDeleteDialog}
                title={"Удаление доступа"}
                subtitle={"Будет закрыт доступ"}
                info={<Contact type={"email"} text={user?.email ?? ""} disableCopy />}
                deleteButtonLabel={"Закрыть доступ"}
                onDelete={handleDelete}
                onCancel={() => {
                    setShowDeleteDialog(false);
                    props.setOpen(true);
                }}
                loading={store.user.loading}
            />
            <ConfirmCloseOverlay
                open={showConfirmCloseDialog}
                onSave={handleSave}
                onClose={() => {
                    props.setOpen(true);
                    setShowConfirmCloseDialog(false);
                }}
                onCloseWithoutSave={() => setShowConfirmCloseDialog(false)}
                loading={store.user.loading}
            />
        </>
    );
});
