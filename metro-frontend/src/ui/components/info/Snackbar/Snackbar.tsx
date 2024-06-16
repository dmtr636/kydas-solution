import styles from "./Snackbar.module.scss";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { IconAttention, IconError, IconSuccess } from "src/ui/assets/icons";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";

interface SnackbarProps {
    mode: "positive" | "negative" | "neutral";
    children: ReactNode;
    onClick?: () => void;
    actions?: ReactNode[];
}

export const Snackbar = (props: SnackbarProps) => {
    const getIcon = () => {
        switch (props.mode) {
            case "positive":
                return <IconSuccess />;
            case "negative":
                return <IconError />;
            case "neutral":
                return <IconAttention />;
        }
    };

    return (
        <div className={clsx(styles.snackbar, styles[props.mode])} onClick={props.onClick}>
            {getIcon()}
            <Typo variant={"actionL"}>{props.children}</Typo>
            {props.actions && props.actions.length > 0 && (
                <div className={styles.actions}>{props.actions}</div>
            )}
        </div>
    );
};
