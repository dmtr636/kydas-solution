import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import styles from "./ConfirmCloseOverlay.module.scss";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";

export const ConfirmCloseOverlay = (props: {
    open: boolean;
    onSave: () => void;
    onClose: () => void;
    onCloseWithoutSave: () => void;
    loading?: boolean;
}) => {
    return (
        <Overlay
            open={props.open}
            title={"Редактирование"}
            onClose={props.onClose}
            mode={"accent"}
            actions={[
                <Button
                    key="save"
                    type={"primary"}
                    mode={"accent"}
                    onClick={props.onSave}
                    loading={props.loading}
                >
                    Сохранить
                </Button>,
                <Button
                    key="cancel"
                    type={"secondary"}
                    mode={"accent"}
                    onClick={props.onCloseWithoutSave}
                >
                    Выйти без сохранения
                </Button>,
            ]}
        >
            <Typo variant={"subheadL"} className={styles.subtitle}>
                Изменения не сохранены. Вы уверены, что хотите продолжить?
            </Typo>
        </Overlay>
    );
};
