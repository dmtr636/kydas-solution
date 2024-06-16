import { ButtonProps } from "src/ui/components/controls/Button/Button.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { clsx } from "clsx";
import styles from "./FloatingButton.module.scss";
import { createPortal } from "react-dom";

type FloatingButtonProps = Omit<ButtonProps, "iconBefore" | "iconAfter" | "counter">;

export const FloatingButton = (props: FloatingButtonProps) => {
    return createPortal(
        <ButtonIcon
            {...props}
            type={props.type ?? "primary"}
            size={"huge"}
            className={clsx(props.className, styles.floatingButton)}
        >
            {props.children}
        </ButtonIcon>,
        document.body,
    );
};
