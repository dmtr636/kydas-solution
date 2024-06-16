import { Tooltip } from "src/ui/components/info/Tooltip/Tooltip.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { TypoVariant } from "src/ui/components/atoms/Typo/Typo.types.ts";
import { TooltipMode } from "src/ui/components/info/Tooltip/Tooltip.types.ts";
import { ReactNode } from "react";

interface TooltipTypoProps {
    variant: TypoVariant;
    children: ReactNode;
    mode?: TooltipMode;
    className?: string;
    closeOnClick?: boolean;
}

export const TooltipTypo = (props: TooltipTypoProps) => {
    const {
        variant,
        children,
        mode = "neutral",
        className,
        closeOnClick,
    }: TooltipTypoProps = props;
    return (
        <Tooltip text={children} mode={mode} requireOverflow closeOnClick={closeOnClick}>
            <Typo variant={variant} noWrap className={className}>
                {children}
            </Typo>
        </Tooltip>
    );
};
