import styles from "./Typo.module.scss";
import { TypoVariant } from "src/ui/components/atoms/Typo/Typo.types.ts";
import { CSSProperties, forwardRef, ReactNode } from "react";
import { clsx } from "clsx";

interface TypoProps {
    variant: TypoVariant;
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
    noWrap?: boolean;
}

export const Typo = forwardRef<HTMLDivElement, TypoProps>((props, ref) => {
    return (
        <div
            ref={ref}
            className={clsx(
                { [styles.noWrap]: props.noWrap },
                styles[props.variant],
                props.className,
            )}
            style={props.style}
        >
            {props.children}
        </div>
    );
});

Typo.displayName = "Typo";
