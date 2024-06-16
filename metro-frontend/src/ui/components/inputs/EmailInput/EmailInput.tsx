import React, { ChangeEvent, ReactNode, useState } from "react";
import { IconEmail } from "src/ui/assets/icons";
import { Input } from "../Input/Input";
import { InputSize } from "../Input/Input.types";

export const EmailInput = ({
    value,
    onChange,
    disabled,
    error,
    size = "large",
    showName = true,
    showIcon = true,
    formText,
    formName = "Почта",
    brand,
    setValid,
    required,
    placeholder,
    readonly,
}: {
    value: string;
    onChange: (email: string) => void;
    disabled?: boolean;
    error?: boolean;
    size?: InputSize;
    showName?: boolean;
    showIcon?: boolean;
    formText?: ReactNode;
    brand?: boolean;
    formName?: string | ReactNode;
    setValid?: (boolean: boolean) => void;
    required?: boolean;
    placeholder?: string;
    readonly?: boolean;
}) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /*     const [value, setValue] = React.useState("")
     */
    const [emailIsValid, setEmailIsValid] = React.useState(true);
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        /*         setValue(event.target.value);
         */
        onChange(event.target.value);
        const isValid = emailRegex.test(event.target.value);
        setEmailIsValid(isValid);
        if (setValid) {
            setValid(isValid);
        }
    };
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleInputFocus = (): void => {
        setIsInputFocused(true);
    };
    const handleInputBlur = (): void => {
        setIsInputFocused(false);
    };
    const showError = !emailIsValid && !isInputFocused && !(value.trim() === "");
    return (
        <>
            <Input
                types="text"
                size={size}
                error={showError || error}
                onChange={handleInputChange}
                value={value}
                placeholder={placeholder ?? "Введите почту"}
                formName={showName ? formName : ""}
                formText={showError ? "Нужна почта в формате example@email.com" : formText}
                isFocused={isInputFocused}
                startIcon={showIcon && <IconEmail />}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                disabled={disabled}
                brand={brand}
                required={required}
                readonly={readonly}
            />
        </>
    );
};
