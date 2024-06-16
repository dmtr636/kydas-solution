import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { IconArrowDown, IconClose, IconPlus } from "src/ui/assets/icons";
import { AutocompleteOption, AutocompleteSize } from "./Autocomplete.types.ts";
import { ReactNode, useEffect, useMemo, useState } from "react";
import styles from "./Autocomplete.module.scss";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { SingleDropdownList } from "src/ui/components/solutions/DropdownList/SingleDropdownList.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { DropdownListOption } from "src/ui/components/solutions/DropdownList/DropdownList.types.ts";
import { clsx } from "clsx";
import { ListItem } from "src/ui/components/controls/ListItem/ListItem.tsx";

export interface SingleAutocompleteProps<T> {
    options: AutocompleteOption<T>[];
    value: T | null;
    onValueChange: (value: T | null) => void;
    onOptionChange?: (option: AutocompleteOption<T> | null) => void;
    iconBefore?: ReactNode;
    formName?: string;
    formNotification?: ReactNode;
    placeholder?: string;
    size?: AutocompleteSize;
    multiple?: false;
    error?: boolean;
    brand?: boolean;
    required?: boolean;
    addButtonLabel?: string;
    onAddButtonClick?: (inputValue: string) => void;
    disabled?: boolean;
}

export const SingleAutocomplete = <T = string,>(props: SingleAutocompleteProps<T>) => {
    const {
        options,
        value,
        onValueChange,
        onOptionChange,
        iconBefore,
        formName,
        formNotification,
        placeholder,
        size = "medium",
        error,
        brand,
        required,
    }: SingleAutocompleteProps<T> = props;
    const [hover, setHover] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [dirty, setDirty] = useState(false);

    const selectedOption = useMemo(() => {
        return options.find((option) => option.value === value);
    }, [value, options.length]);

    useEffect(() => {
        setInputValue(selectedOption?.name ?? "");
    }, [value]);

    const filteredOptions = useMemo(() => {
        if (!dirty) {
            return options;
        }
        return options.filter((option) =>
            option.name.toLowerCase().startsWith(inputValue.toLowerCase()),
        );
    }, [inputValue, dirty, options.length]);

    const handleChange = (option: DropdownListOption<T | null> | null) => {
        setInputValue(option?.name ?? "");
        onValueChange(option?.value ?? null);
        onOptionChange?.(option as AutocompleteOption<T>);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDirty(true);
        setInputValue(event.target.value);
        if (!event.target.value) {
            onValueChange(null);
            return;
        }
    };

    const handleShowDropdown = (show: boolean) => {
        setShowDropdown(show);
        if (!show) {
            setDirty(false);
            const option = options.find((option) => option.name === inputValue);
            if (option) {
                onValueChange(option.value);
                onOptionChange?.(option);
            } else {
                if (selectedOption?.name !== inputValue) {
                    setInputValue(selectedOption?.name ?? "");
                }
            }
        }
    };

    const renderFooter = () => {
        if (filteredOptions.length === 0) {
            if (props.addButtonLabel) {
                return (
                    <ListItem
                        size={"large"}
                        mode={"accent"}
                        iconBefore={<IconPlus />}
                        onClick={() => {
                            props.onAddButtonClick?.(inputValue);
                            setTimeout(() => {
                                setShowDropdown(false);
                            }, 10);
                        }}
                    >
                        {props.addButtonLabel}
                    </ListItem>
                );
            }
            return (
                <Typo variant={size === "large" ? "actionXL" : "actionL"} className={styles.footer}>
                    Ничего не найдено
                </Typo>
            );
        }
    };

    return (
        <SingleDropdownList<T | null>
            options={filteredOptions}
            value={value}
            onChange={handleChange}
            fullWidth={true}
            mode="neutral"
            show={showDropdown}
            setShow={handleShowDropdown}
            size={size}
            hideTip={true}
            footer={renderFooter()}
            footerNoPadding={!!props.addButtonLabel}
        >
            <Input
                required={required}
                formName={formName}
                placeholder={placeholder ?? ""}
                formText={formNotification}
                value={inputValue}
                onChange={handleInputChange}
                size={size}
                startIcon={iconBefore}
                customStartIcon={selectedOption?.icon}
                brand={brand}
                disabled={props.disabled}
                endActions={
                    !props.disabled && (
                        <div className={styles.inputEndActions}>
                            {inputValue && hover && (
                                <ButtonIcon
                                    mode="neutral"
                                    size={size === "large" ? "small" : "tiny"}
                                    pale={true}
                                    onClick={() => handleChange(null)}
                                >
                                    <IconClose />
                                </ButtonIcon>
                            )}
                            <ButtonIcon
                                mode="neutral"
                                size={size === "large" ? "small" : "tiny"}
                                hover={!value && hover}
                                pale={true}
                            >
                                <IconArrowDown
                                    className={clsx(styles.iconArrow, {
                                        [styles.showDropdown]: showDropdown,
                                    })}
                                />
                            </ButtonIcon>
                        </div>
                    )
                }
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={styles.Input}
                isFocused={showDropdown}
                error={error}
            />
        </SingleDropdownList>
    );
};
