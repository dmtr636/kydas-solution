import styles from "./Tabs.module.scss";
import { clsx } from "clsx";
import { cloneElement, isValidElement, ReactNode } from "react";
import { Counter } from "src/ui/components/info/Counter/Counter.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { TypoVariant } from "src/ui/components/atoms/Typo/Typo.types.ts";

export interface Tab<T = string> {
    name: string;
    value: T;
    iconBefore?: ReactNode;
    iconAfter?: ReactNode;
    counter?: number;
}

export type TabsSize = "large" | "medium" | "small";

export interface TabsProps<T> {
    tabs: Tab<T>[];
    value: T;
    onChange: (value: T) => void;
    type?: "primary" | "secondary";
    size?: TabsSize;
    mode?: "accent" | "brand";
}

export const Tabs = <T = string,>(props: TabsProps<T>) => {
    const {
        tabs,
        value,
        onChange,
        type = "primary",
        size = "medium",
        mode = "accent",
    }: TabsProps<T> = props;

    const renderIcon = (icon?: ReactNode, className?: string) => {
        if (isValidElement<SVGElement>(icon)) {
            return cloneElement(icon, { className: clsx(styles.icon, className) });
        }
    };

    const renderPrimaryTab = (tab: Tab<T>) => {
        return (
            <button
                className={clsx(styles.button)}
                onClick={() => onChange(tab.value)}
                key={tab.name}
            >
                <div
                    className={clsx(styles.tab, styles[type], styles[size], styles[mode], {
                        [styles.active]: tab.value === value,
                    })}
                    key={tab.name}
                >
                    {renderTabContent(tab)}
                </div>
            </button>
        );
    };

    const renderSecondaryTab = (tab: Tab<T>) => {
        return (
            <button
                className={clsx(styles.tab, styles[type], styles[size], styles[mode], {
                    [styles.active]: tab.value === value,
                })}
                onClick={() => onChange(tab.value)}
                key={tab.name}
            >
                {renderTabContent(tab)}
            </button>
        );
    };

    const renderTabContent = (tab: Tab<T>) => {
        const typoMap: Record<TabsSize, TypoVariant> = {
            large: "actionXL",
            medium: "actionL",
            small: "actionM",
        };
        return (
            <>
                <div className={styles.startContent}>
                    {renderIcon(tab.iconBefore)}
                    <Typo variant={typoMap[size]}>{tab.name}</Typo>
                </div>
                {(tab.iconAfter || tab.counter !== undefined) && (
                    <div className={styles.endContent}>
                        {renderIcon(tab.iconAfter)}
                        {!!tab.counter && (
                            <Counter
                                type={"primary"}
                                mode={tab.value === value ? mode : "neutral"}
                                size={size}
                                value={tab.counter}
                            />
                        )}
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={clsx(styles.tabs, styles[type])}>
            {tabs.map((tab) =>
                type === "primary" ? renderPrimaryTab(tab) : renderSecondaryTab(tab),
            )}
        </div>
    );
};
