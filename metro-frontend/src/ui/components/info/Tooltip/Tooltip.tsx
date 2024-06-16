import styles from "./Tooltip.module.scss";
import {
    PopoverBase,
    PopoverBaseProps,
} from "src/ui/components/solutions/PopoverBase/PopoverBase.tsx";
import { clsx } from "clsx";
import { ReactNode } from "react";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";

interface TooltipProps extends Omit<PopoverBaseProps, "triggerEvent" | "content"> {
    header?: string;
    text?: ReactNode;
    size?: "large" | "medium";
    textCenter?: boolean;
}

export const Tooltip = (props: TooltipProps) => {
    const { header, text, mode = "accent", size = "medium", textCenter }: TooltipProps = props;
    const contentClassName = clsx(styles.content, styles[mode], styles[size]);

    if (!header && !text) {
        return props.children;
    }

    return (
        <PopoverBase
            {...props}
            triggerEvent={"hover"}
            content={
                <div className={contentClassName}>
                    {header && (
                        <Typo
                            variant={size === "large" ? "subheadXL" : "subheadM"}
                            className={clsx(styles.header, { [styles.textAlign]: textCenter })}
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
                </div>
            }
        >
            {props.children}
        </PopoverBase>
    );
};
