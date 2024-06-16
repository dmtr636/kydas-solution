import { IconArrowDown } from "src/ui/assets/icons";
import { ReactNode, useEffect, useState } from "react";
import {
    DropdownListMode,
    DropdownListOption,
} from "src/ui/components/solutions/DropdownList/DropdownList.types.ts";
import { ButtonSize, ButtonType } from "src/ui/components/controls/Button/Button.types.ts";
import { DropdownList } from "src/ui/components/solutions/DropdownList/DropdownList.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { clsx } from "clsx";
import styles from "./SelectButton.module.scss";

interface SelectButtonProps<T> {
    options: DropdownListOption<T>[];
    value: T;
    onChange: (value: T) => void;
    mode: DropdownListMode;
    buttonType: ButtonType;
    buttonSize: ButtonSize;
    buttonIconAfter?: ReactNode;
    buttonIconBefore?: ReactNode;
    width?: number;
    onRender?: (setShowDropdown: (value: boolean) => void) => void;
}

export const SelectButton = <T,>(props: SelectButtonProps<T>) => {
    const {
        options,
        value,
        onChange,
        mode,
        buttonType,
        buttonSize,
        buttonIconBefore,
        buttonIconAfter,
        width,
        onRender,
    }: SelectButtonProps<T> = props;
    const [showDropdown, setShowDropdown] = useState(false);
    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        onRender?.(setShowDropdown);
    }, []);

    return (
        <DropdownList<T>
            options={options}
            value={value}
            mode={mode}
            onChange={(option) => onChange(option.value as T)}
            hideTip={true}
            show={showDropdown}
            setShow={setShowDropdown}
            fullWidth={true}
        >
            <Button
                type={buttonType}
                mode={mode}
                size={buttonSize}
                iconBefore={buttonIconBefore}
                iconAfter={
                    buttonIconAfter ??
                    (!buttonIconBefore && (
                        <IconArrowDown
                            className={clsx(styles.iconArrow, {
                                [styles.showDropdown]: showDropdown,
                            })}
                        />
                    ))
                }
                style={{ width: width ? `${width}px` : undefined }}
                hover={showDropdown}
                availableValues={options.map((o) => o.name)}
            >
                {selectedOption?.name}
            </Button>
        </DropdownList>
    );
};
