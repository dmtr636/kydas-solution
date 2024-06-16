import styles from "./DropdownList.module.scss";
import { Fragment, ReactElement, ReactNode, useEffect, useRef, useState } from "react";

import {
    PopoverBase,
    PopoverBaseProps,
} from "src/ui/components/solutions/PopoverBase/PopoverBase.tsx";
import { clsx } from "clsx";
import {
    DropdownListMode,
    DropdownListOption,
    DropdownListOptions,
    DropdownListSize,
} from "src/ui/components/solutions/DropdownList/DropdownList.types.ts";
import { ListItem } from "src/ui/components/controls/ListItem/ListItem.tsx";

export interface SingleDropdownListProps<T>
    extends Pick<PopoverBaseProps, "fullWidth" | "show" | "setShow" | "tipPosition" | "hideTip"> {
    children: ReactElement;
    options: DropdownListOptions<T>;
    onChange?: (option: DropdownListOption<T>) => void;
    value?: T;
    mode?: DropdownListMode;
    size?: DropdownListSize;
    multiple?: false;
    footer?: ReactNode;
    footerNoPadding?: boolean;
    disableSelectedItem?: boolean;
}

export const SingleDropdownList = <T,>(props: SingleDropdownListProps<T>) => {
    const {
        children,
        options,
        onChange,
        value,
        mode = "accent",
        fullWidth,
        size = "medium",
        footer,
        disableSelectedItem = true,
    }: SingleDropdownListProps<T> = props;
    const [show, setShow] = useState(props.show ?? false);
    const selectedOptionRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setShow(props.show ?? show);
    }, [props.show]);

    useEffect(() => {
        const scrollContainer = selectedOptionRef.current?.parentElement?.parentElement;
        if (show && scrollContainer) {
            scrollContainer.scrollTop = 0;
        }
    }, [options.length]);

    useEffect(() => {
        props.setShow?.(show);
        const scrollContainer = selectedOptionRef.current?.parentElement?.parentElement;
        if (show && scrollContainer) {
            const scrollTop =
                selectedOptionRef.current.offsetTop +
                selectedOptionRef.current.offsetHeight / 2 -
                scrollContainer.offsetHeight / 2;
            scrollContainer.scrollTop = Math.max(scrollTop, 0);
        }
    }, [show]);

    const handleChange = (option: DropdownListOption<T>) => {
        setShow(false);
        onChange?.(option);
    };

    const renderList = () => {
        if (!options.length && !footer) {
            return null;
        }
        const listClassName = clsx(styles.list, styles[mode]);
        return (
            <div className={listClassName}>
                {options.map((option, index) =>
                    Array.isArray(option)
                        ? renderOptionGroup(option, index)
                        : renderOption(option, index),
                )}
                {footer && (
                    <div
                        className={clsx(styles.footer, styles[size], {
                            [styles.noPadding]: props.footerNoPadding,
                        })}
                    >
                        {footer}
                    </div>
                )}
            </div>
        );
    };

    const renderOptionGroup = (optionGroup: DropdownListOption<T>[], index: number) => {
        return (
            <Fragment key={`group-${index}`}>
                {optionGroup.map(renderOption)}
                <div className={styles.divider} />
            </Fragment>
        );
    };

    const renderOption = (option: DropdownListOption<T>, index: number) => {
        const isSelected = value !== undefined && option.value === value;
        return (
            <ListItem
                mode={mode}
                size={size}
                onClick={() => {
                    option.onClick?.();
                    handleChange(option);
                }}
                disabled={(disableSelectedItem && isSelected) || option.disabled}
                iconBefore={option.listItemIcon}
                customIconBefore={option.icon}
                key={index}
                _ref={isSelected ? selectedOptionRef : undefined}
            >
                {option.name}
            </ListItem>
        );
    };

    return (
        <PopoverBase
            {...props}
            mode={"contrast"}
            triggerEvent={"click"}
            content={renderList()}
            itemsLength={options.length}
            show={show}
            setShow={setShow}
            maxHeight={size === "large" ? 360 : 320}
            fullWidth={fullWidth}
        >
            {children}
        </PopoverBase>
    );
};
