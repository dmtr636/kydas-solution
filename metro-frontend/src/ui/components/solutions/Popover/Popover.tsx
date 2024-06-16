import { ReactNode } from "react";
import styles from "./Popover.module.scss";
import { clsx } from "clsx";
import {
    PopoverBase,
    PopoverBaseProps,
} from "src/ui/components/solutions/PopoverBase/PopoverBase.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";

interface PopoverProps extends Omit<PopoverBaseProps, "triggerEvent" | "content"> {
    header?: string;
    text?: string;
    footer?: ReactNode;
    size?: "large" | "medium";
}

const POPOVER_MAX_WIDTH = 304;

export const Popover = (props: PopoverProps) => {
    const {
        header,
        text,
        footer,
        mode = "accent",
        size = "medium",
        maxWidth = POPOVER_MAX_WIDTH,
    }: PopoverProps = props;

    const contentClassName = clsx(styles.content, styles[mode]);
    return (
        <PopoverBase
            {...props}
            triggerEvent={"click"}
            maxWidth={maxWidth}
            content={
                <div className={contentClassName}>
                    {header && (
                        <Typo
                            variant={size === "large" ? "subheadXL" : "subheadM"}
                            className={styles.header}
                        >
                            {header}
                        </Typo>
                    )}
                    {text && (
                        <Typo
                            variant={size === "large" ? "bodyXL" : "bodyM"}
                            className={styles.text}
                        >
                            {text}
                        </Typo>
                    )}
                    {footer && <div className={styles.footer}>{footer}</div>}
                </div>
            }
        >
            {props.children}
        </PopoverBase>
    );
};
