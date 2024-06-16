import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { IconArrowDown, IconArrowUp, IconClose } from "src/ui/assets/icons";
import { ReactNode, useMemo, useRef, useState } from "react";
import styles from "./Select.module.scss";
import { TextMeasurer } from "src/ui/utils/TextMeasurer.ts";
import { clsx } from "clsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { SelectOption, SelectSize } from "src/ui/components/inputs/Select/Select.types.ts";
import { MultipleDropdownListOption } from "src/ui/components/solutions/DropdownList/DropdownList.types.ts";
import { MultipleDropdownList } from "src/ui/components/solutions/DropdownList/MultipleDropdownList.tsx";
import { Counter } from "src/ui/components/info/Counter/Counter.tsx";

export interface MultipleSelectProps<T> {
    options: SelectOption<T>[];
    values: T[];
    onValuesChange: (values: T[]) => void;
    onOptionsChange?: (options: SelectOption<T>[]) => void;
    iconBefore?: ReactNode;
    formName?: string;
    formNotification?: ReactNode;
    placeholder?: string;
    size?: SelectSize;
    multiple: true;
    error?: boolean;
    disableClear?: boolean;
}

export const MultipleSelect = <T = string,>(props: MultipleSelectProps<T>) => {
    const {
        options,
        values,
        onValuesChange,
        onOptionsChange,
        iconBefore,
        formName,
        formNotification,
        placeholder,
        size = "medium",
        error,
        disableClear,
    }: MultipleSelectProps<T> = props;
    const [hover, setHover] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedOptions = options.filter((option) => values.includes(option.value));

    const displayedOptionsCount = useMemo(() => {
        if (!inputRef.current) {
            return 0;
        }
        const inputWidth = inputRef.current.clientWidth;
        const optionNames: string[] = [];
        for (const option of selectedOptions) {
            optionNames.push(option.name);
            const totalWidth = TextMeasurer.getTextWidth(
                optionNames.join(", ").concat(" ... "),
                inputRef.current,
            );
            if (totalWidth > inputWidth) {
                break;
            }
        }
        return optionNames.length;
    }, [selectedOptions.length, inputRef.current]);

    const handleChange = (options: MultipleDropdownListOption<T>[]) => {
        onValuesChange(options.map((option) => option.value));
        onOptionsChange?.(options);
    };

    return (
        <MultipleDropdownList<T>
            options={options}
            values={values}
            onChange={handleChange}
            fullWidth={true}
            mode="neutral"
            setShow={setShowDropdown}
            size={size}
            hideTip={true}
            multiple={true}
        >
            <Input
                formName={formName}
                placeholder={placeholder ?? ""}
                formText={formNotification}
                value={selectedOptions.map((option) => option.name).join(", ")}
                onChange={() => {}}
                size={size}
                startIcon={iconBefore}
                endActions={
                    <div className={clsx(styles.inputEndActions, styles[size])}>
                        {hover && !disableClear && !!values.length && (
                            <ButtonIcon
                                mode="neutral"
                                size={size === "large" ? "small" : "tiny"}
                                pale={true}
                                onClick={() => handleChange([])}
                            >
                                <IconClose />
                            </ButtonIcon>
                        )}
                        {values.length > displayedOptionsCount && (
                            <Counter
                                value={values.length}
                                maxValue={values.length - displayedOptionsCount}
                                mode={"neutral"}
                                size={size}
                            />
                        )}
                        <ButtonIcon
                            mode="neutral"
                            size={size === "large" ? "small" : "tiny"}
                            hover={values.length === 0 && hover}
                            pale={true}
                        >
                            <IconArrowDown
                                className={clsx(styles.iconArrow, {
                                    [styles.showDropdown]: showDropdown,
                                })}
                            />
                        </ButtonIcon>
                    </div>
                }
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={styles.Input}
                isFocused={showDropdown}
                error={error}
                inputRef={inputRef}
            />
        </MultipleDropdownList>
    );
};
