import styles from "./Button.module.scss";
import { clsx } from "clsx";
import React, {
    cloneElement,
    createRef,
    CSSProperties,
    isValidElement,
    ReactNode,
    RefObject,
    useEffect,
    useState,
} from "react";
import { Counter } from "../../info/Counter/Counter.tsx";
import { ButtonAlign, ButtonEdge, ButtonMode, ButtonSize, ButtonType } from "./Button.types.ts";
import { CounterMode, CounterType } from "../../info/Counter/Counter.types.ts";
import { TypoVariant } from "../../atoms/Typo/Typo.types.ts";
import { TextMeasurer } from "src/ui/utils/TextMeasurer.ts";
import Lottie from "lottie-react";
import { animationLoading32 } from "src/ui/assets/animations";
import { TooltipTypo } from "src/ui/components/info/TooltipTypo/TooltipTypo.tsx";

export interface ButtonProps {
    children?: ReactNode;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
    onMouseDown?: (event: React.MouseEvent) => void;
    type?: ButtonType;
    mode?: ButtonMode;
    size?: ButtonSize;
    disabled?: boolean;
    pale?: boolean;
    focused?: boolean;
    hover?: boolean;
    iconBefore?: ReactNode;
    customIconBefore?: ReactNode;
    iconAfter?: ReactNode;
    counter?: number;
    className?: string;
    style?: CSSProperties;
    align?: ButtonAlign;
    edge?: ButtonEdge;
    fullWidth?: boolean;
    clickable?: boolean;
    listItem?: boolean;
    _ref?: RefObject<HTMLButtonElement>;
    availableValues?: string[];
    loading?: boolean;
    disableTransition?: boolean;
    overflow?: "hidden" | "visible";
    isSubmit?: boolean;
}

export const Button = (props: ButtonProps) => {
    const {
        children,
        onClick,
        onMouseEnter,
        onMouseLeave,
        onMouseDown,
        type = "primary",
        mode = "accent",
        size = "medium",
        pale,
        focused,
        hover,
        iconBefore,
        customIconBefore,
        iconAfter,
        counter,
        className,
        style,
        align = "center",
        edge,
        fullWidth,
        clickable = true,
        listItem,
        _ref = createRef<HTMLButtonElement>(),
        availableValues,
        loading,
        disableTransition,
        overflow = "hidden",
        isSubmit = false,
    }: ButtonProps = props;
    const [isHovered, setHovered] = useState(false);
    const [width, setWidth] = useState<number>();
    const isIconVariant = isValidElement<SVGElement>(children);
    const disabled = props.disabled || loading;

    useEffect(() => {
        if (!width && availableValues?.length && _ref?.current && typeof children === "string") {
            let maxWidth = 0;
            const currentTextWidth = TextMeasurer.getTextWidth(children, _ref?.current);
            const otherElementsWidth = _ref.current.offsetWidth - currentTextWidth + 1;
            for (const value of availableValues) {
                maxWidth = Math.max(
                    maxWidth,
                    TextMeasurer.getTextWidth(value, _ref?.current) + otherElementsWidth + 1,
                );
            }
            setWidth(maxWidth);
        }
    }, [width, availableValues?.length]);

    const renderChildren = () => {
        if (!children) {
            return;
        }
        if (isIconVariant) {
            return renderIcon(children);
        }
        const typoVariants: Record<ButtonSize, TypoVariant> = {
            huge: "actionXL",
            large: "actionXL",
            medium: "actionL",
            small: "actionM",
            tiny: "actionM",
        };
        return (
            <TooltipTypo variant={typoVariants[size]} className={styles.text}>
                {children}
            </TooltipTypo>
        );
    };

    const renderIcon = (icon?: ReactNode, className?: string) => {
        if (isValidElement<SVGElement>(icon)) {
            return cloneElement(icon, {
                className: clsx(styles.icon, className, icon.props.className),
            });
        }
    };

    const renderCounter = () => {
        if (counter === undefined) {
            return null;
        }
        const counterTypes: Record<ButtonType, CounterType> = {
            primary: mode === "contrast" ? "primary" : "secondary",
            secondary: mode === "contrast" ? "secondary" : "primary",
            tertiary: mode === "contrast" ? "secondary" : "primary",
            outlined: "primary",
        };
        const counterModes: Record<ButtonMode, CounterMode> = {
            accent: "accent",
            positive: "positive",
            negative: "negative",
            neutral: "neutral",
            contrast: "neutral",
            brand: "brand",
        };
        return (
            <Counter
                type={counterTypes[type]}
                mode={counterModes[mode]}
                size={size}
                value={counter}
                pale={!isHovered && pale && (mode !== "contrast" || type !== "primary")}
                disabled={disabled && (mode !== "contrast" || type !== "primary")}
            />
        );
    };

    const handleMouseEnter = (event: React.MouseEvent) => {
        setHovered(true);
        onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: React.MouseEvent) => {
        setHovered(false);
        onMouseLeave?.(event);
    };

    const buttonClassName = clsx(
        styles.button,
        styles[type],
        styles[mode],
        styles[size],
        { [styles.pale]: !isHovered && pale },
        { [styles.iconVariant]: isIconVariant },
        { [styles.focused]: focused },
        { [styles.hover]: hover },
        { [styles.edgeTop]: edge === "top" },
        { [styles.edgeRight]: edge === "right" },
        { [styles.edgeBottom]: edge === "bottom" },
        { [styles.edgeLeft]: edge === "left" },
        { [styles.fullWidth]: fullWidth },
        { [styles.clickable]: clickable },
        { [styles.alignStart]: align === "start" },
        { [styles.listItemVariant]: listItem },
        { [styles.neutralPale]: isIconVariant && mode === "neutral" },
        { [styles.loading]: loading },
        { [styles.withTransition]: !disableTransition },
        className,
    );
    return (
        <button
            ref={_ref}
            type={isSubmit ? "submit" : "button"}
            className={buttonClassName}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={onMouseDown}
            disabled={disabled}
            style={{
                ...style,
                width: style?.width ?? width,
            }}
        >
            <div className={styles.startContent} style={{ overflow }}>
                {renderIcon(iconBefore)}
                {renderIcon(customIconBefore, styles.customIconBefore)}
                {renderChildren()}
            </div>
            {(iconAfter || counter !== undefined) && (
                <div className={styles.endContent}>
                    {renderIcon(iconAfter)}
                    {renderCounter()}
                </div>
            )}
            {loading && (
                <Lottie
                    className={clsx(styles.loadingAnimation)}
                    loop={true}
                    animationData={animationLoading32}
                />
            )}
        </button>
    );
};
