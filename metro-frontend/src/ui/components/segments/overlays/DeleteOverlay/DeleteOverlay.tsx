import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import { ReactNode } from "react";
import styles from "./DeleteOverlay.module.scss";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconBasket } from "src/ui/assets/icons";

export const DeleteOverlay = (props: {
    open: boolean;
    title: string;
    subtitle: string;
    info: ReactNode;
    deleteButtonLabel: string;
    onDelete: () => void;
    onCancel: () => void;
    loading?: boolean;
}) => {
    return (
        <Overlay
            open={props.open}
            title={props.title}
            mode={"negative"}
            actions={[
                <Button
                    key="delete"
                    type={"primary"}
                    mode={"negative"}
                    iconBefore={<IconBasket />}
                    onClick={props.onDelete}
                    loading={props.loading}
                >
                    {props.deleteButtonLabel}
                </Button>,
                <Button key="cancel" type={"secondary"} mode={"negative"} onClick={props.onCancel}>
                    Отмена
                </Button>,
            ]}
        >
            <Typo variant={"subheadL"} className={styles.subtitle}>
                {props.subtitle}
            </Typo>
            <div className={styles.info}>
                <Typo variant={"actionXL"}>{props.info}</Typo>
            </div>
        </Overlay>
    );
};
