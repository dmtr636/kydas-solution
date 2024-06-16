import styles from "./Alert.module.scss";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { AlertMode } from "src/ui/components/solutions/Alert/Alert.types.ts";

interface AlertProps {
    mode: AlertMode;
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    actions?: ReactNode[];
}

export const Alert = (props: AlertProps) => {
    const { mode, title, subtitle, icon, actions }: AlertProps = props;

    const alertClassName = clsx(styles.alert, styles[mode]);

    const renderActions = () => {
        if (actions && actions.length) {
            return <div className={styles.actions}>{actions}</div>;
        }
    };

    return (
        <div className={alertClassName}>
            <div className={styles.content}>
                {icon}
                <div>
                    <Typo variant={"subheadXL"}>{title}</Typo>
                    {subtitle && (
                        <Typo variant={"bodyXL"} className={styles.subtitle}>
                            {subtitle}
                        </Typo>
                    )}
                </div>
            </div>
            {renderActions()}
        </div>
    );
};
