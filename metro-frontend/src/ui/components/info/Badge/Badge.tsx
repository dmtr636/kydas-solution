import styles from "./styles.module.scss";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface BadgeProps {
    children: ReactNode;
    value?: number | string;
    size?: "medium" | "small";
    /*
        type?: "primary" | "secondary"
    */
    mode?: "accent" | "negative" | "positive" | "neutral" | "contrast";
}

export const Badge = ({ children, value = "", size = "medium", mode = "accent" }: BadgeProps) => {
    return (
        <div className={styles.container}>
            {children}
            <div
                className={clsx(
                    styles.badge,
                    styles[size],
                    {
                        /*styles[type],*/
                    },
                    styles[mode],
                )}
            >
                {size === "small" ? "" : value}
            </div>
        </div>
    );
};
