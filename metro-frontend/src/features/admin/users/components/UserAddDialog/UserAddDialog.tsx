import styles from "./UserAddDialog.module.scss";
import { observer } from "mobx-react-lite";
import { store } from "src/app/AppStore.ts";
import { userRolesOptions } from "../../constants/userRoles.ts";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { SingleSelect } from "src/ui/components/inputs/Select/SingleSelect.tsx";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { useEffect, useState } from "react";
import { UserAddFormValues } from "src/features/admin/users/types/UserAddFormValues.ts";
import { UserRole } from "src/features/admin/users/types/User.ts";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";

interface UserAddDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const initialFormValues: UserAddFormValues = {
    email: "",
    role: null,
    name: "",
};

export const UserAddDialog = observer((props: UserAddDialogProps) => {
    const [formValues, setFormValues] = useState<UserAddFormValues>(initialFormValues);

    useEffect(() => {
        if (!props.open) {
            setFormValues(initialFormValues);
        }
    }, [props.open]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const isValid = () => {
        return emailRegex.test(formValues.email.trim()) && formValues.email && formValues.role;
    };

    const handleAdd = async () => {
        const response = await store.user.createUser(formValues);
        if (response.status) {
            snackbarStore.showPositiveSnackbar("Пользователь добавлен");
            props.setOpen(false);
        }
    };

    const handleChange = (changes: Partial<UserAddFormValues>) => {
        setFormValues({
            ...formValues,
            ...changes,
        });
    };

    return (
        <Overlay
            open={props.open}
            onClose={() => props.setOpen(false)}
            title={"Новый пользователь"}
            mode={"accent"}
            actions={[
                <Button
                    key="add"
                    type={"primary"}
                    disabled={!isValid()}
                    loading={store.user.loading}
                    onClick={handleAdd}
                >
                    Добавить
                </Button>,
                <Button key="cancel" type={"secondary"} onClick={() => props.setOpen(false)}>
                    Отмена
                </Button>,
            ]}
        >
            <div className={styles.form}>
                <EmailInput
                    formText={
                        "Отправим на неё пароль для входа. Она будет использоваться для авторизации"
                    }
                    value={formValues.email}
                    onChange={(email) => handleChange({ email })}
                    size={"large"}
                    showIcon={false}
                    required={true}
                />
                <SingleSelect
                    options={userRolesOptions}
                    value={formValues.role}
                    onValueChange={(role) => handleChange({ role: role as UserRole })}
                    formName={"Роль"}
                    size={"large"}
                    placeholder={"Выберите роль"}
                    required={true}
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
    );
});
