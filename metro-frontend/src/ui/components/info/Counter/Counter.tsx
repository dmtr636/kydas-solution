import styles from "./Counter.module.scss";
import { clsx } from "clsx";
import {
    CounterMode,
    CounterSize,
    CounterType,
} from "src/ui/components/info/Counter/Counter.types.ts";

interface CounterProps {
    value: number;
    type?: CounterType;
    mode?: CounterMode;
    size?: CounterSize;
    pale?: boolean;
    disabled?: boolean;
    maxValue?: number;
    className?: string;
    showPlus?: boolean;
}

export const Counter = ({
    value,
    type = "primary",
    mode = "accent",
    size = "medium",
    pale,
    disabled,
    maxValue = 99,
    className,
    showPlus,
}: CounterProps) => {
    const counterClassName = clsx(
        styles.counter,
        styles[type],
        styles[mode],
        styles[size],
        { [styles.pale]: pale },
        { [styles.disabled]: disabled },
        className,
    );

    return (
        <div className={counterClassName}>
            {(value > maxValue || showPlus) && "+"}
            {Math.min(value, maxValue)}
        </div>
    );
};
