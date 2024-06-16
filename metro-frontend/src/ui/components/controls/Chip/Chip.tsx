import styles from "./Chip.module.scss";
import { clsx } from "clsx";
import { cloneElement, CSSProperties, isValidElement, ReactNode, RefObject } from "react";
import { Counter } from "src/ui/components/info/Counter/Counter.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { IconClose } from "src/ui/assets/icons";

export interface ChipProps {
    children: ReactNode;
    selected?: boolean;
    onChange?: (selected: boolean) => void;
    onDelete?: () => void;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    iconBefore?: ReactNode;
    iconAfter?: ReactNode;
    counter?: number;
    className?: string;
    style?: CSSProperties;
    _ref?: RefObject<HTMLButtonElement>;
}

export const Chip = (props: ChipProps) => {
    const {
        children,
        selected,
        onChange,
        onDelete,
        onClick,
        onMouseEnter,
        onMouseLeave,
        iconBefore,
        iconAfter,
        counter,
        className,
        style,
        _ref,
    }: ChipProps = props;

    const renderChildren = () => {
        return <Typo variant={"actionL"}>{children}</Typo>;
    };

    const renderIcon = (icon?: ReactNode, className?: string) => {
        if (isValidElement<SVGElement>(icon)) {
            return cloneElement(icon, { className: clsx(styles.icon, className) });
        }
    };

    const renderCounter = () => {
        if (counter === undefined) {
            return null;
        }
        return (
            <Counter
                type={"outlined"}
                mode={selected ? "accent" : "neutral"}
                size={"medium"}
                value={counter}
            />
        );
    };

    const handleMouseEnter = () => {
        onMouseEnter?.();
    };

    const handleMouseLeave = () => {
        onMouseLeave?.();
    };

    const handleClick = (event: React.MouseEvent) => {
        onChange?.(!selected);
        onClick?.(event);
    };

    const buttonClassName = clsx(
        styles.button,
        {
            [styles.clickable]: props.onChange,
            [styles.selected]: selected,
        },
        className,
    );
    return (
        <button
            ref={_ref}
            className={buttonClassName}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={style}
        >
            <div className={styles.startContent}>
                {renderIcon(iconBefore)}
                {renderChildren()}
            </div>
            {(iconAfter || counter !== undefined || onDelete) && (
                <div className={styles.endContent}>
                    {renderIcon(iconAfter)}
                    {renderCounter()}
                    {onDelete && (
                        <ButtonIcon
                            mode={"neutral"}
                            size={"tiny"}
                            onClick={(event) => {
                                event.stopPropagation();
                                onDelete();
                            }}
                            pale={true}
                        >
                            <IconClose />
                        </ButtonIcon>
                    )}
                </div>
            )}
        </button>
    );
};
