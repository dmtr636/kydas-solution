import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { IconArrowDown, IconArrowUp, IconClose } from "src/ui/assets/icons";
import { AutocompleteOption, AutocompleteSize } from "./Autocomplete.types.ts";
import { ReactNode, useState } from "react";
import styles from "./Autocomplete.module.scss";
import { MultipleDropdownListOption } from "src/ui/components/solutions/DropdownList/DropdownList.types.ts";
import { MultipleDropdownList } from "src/ui/components/solutions/DropdownList/MultipleDropdownList.tsx";
import { Counter } from "src/ui/components/info/Counter/Counter.tsx";

export interface MultipleAutocompleteProps {
    options: AutocompleteOption[];
    values: string[];
    onValuesChange: (values: string[]) => void;
    onOptionsChange?: (options: AutocompleteOption[]) => void;
    iconBefore?: ReactNode;
    formName?: string;
    formNotification?: string;
    placeholder?: string;
    size?: AutocompleteSize;
    multiple: true;
    error?: boolean;
    required?: boolean;
}

export const MultipleAutocomplete = (props: MultipleAutocompleteProps) => {
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
        required,
    }: MultipleAutocompleteProps = props;
    const [hover, setHover] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleChange = (options: MultipleDropdownListOption<string>[]) => {
        onValuesChange(options.map((option) => option.value));
        onOptionsChange?.(options);
    };

    return (
        <MultipleDropdownList
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
                value={options.find((option) => option.value === values[0])?.name ?? ""}
                onChange={() => {}}
                size={size}
                required={required}
                startIcon={iconBefore}
                endActions={
                    <div className={styles.inputEndActions}>
                        {values.length === 1 && hover && (
                            <ButtonIcon
                                mode="neutral"
                                size={size === "large" ? "small" : "tiny"}
                                pale={true}
                                onClick={() => handleChange([])}
                            >
                                <IconClose />
                            </ButtonIcon>
                        )}
                        {values.length > 1 && (
                            <Counter
                                value={values.length}
                                maxValue={values.length - 1}
                                mode={"neutral"}
                                size={size}
                            />
                        )}
                        <ButtonIcon
                            mode="neutral"
                            size={size === "large" ? "small" : "tiny"}
                            hover={values.length !== 1 && hover}
                            pale={true}
                        >
                            {showDropdown ? <IconArrowUp /> : <IconArrowDown />}
                        </ButtonIcon>
                    </div>
                }
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={styles.Input}
                isFocused={showDropdown}
                error={error}
            />
        </MultipleDropdownList>
    );
};
