import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { Input } from "../Input/Input";
import { InputSize } from "../Input/Input.types";
import { IconPhoneMetro, IconTelephone } from "src/ui/assets/icons";

export const PhoneInput = ({
    value,
    onChange,
    disabled,
    error,
    size = "large",
    placeholder,
    formName,
    formText,
    outlined,
    brand,
    required,
    disableStartIcon,
    readonly,
}: {
    value: string;
    onChange: (date: string) => void;
    disabled?: boolean;
    error?: boolean;
    size?: InputSize;
    placeholder?: string;
    formText?: string | ReactNode;
    formName?: string | ReactNode;
    outlined?: boolean;
    brand?: boolean;
    required?: boolean;
    disableStartIcon?: boolean;
    readonly?: boolean;
}) => {
    const [phoneMask, setPhoneMask] = useState("");

    function removePhoneMask(phoneNumber: string) {
        return phoneNumber.replace(/[^\d+]/g, "");
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        const newValue = event.target.value;
        setPhoneMask(newValue);
        onChange(removePhoneMask(newValue));
    };

    const [isInputFocused, setIsInputFocused] = useState(false);
    const handleInputFocus = (): void => {
        setIsInputFocused(true);
    };
    const handleInputBlur = (): void => {
        setIsInputFocused(false);
    };

    const showError =
        !(value?.length === 12) && !isInputFocused && !(value === "") && !(value === "+");

    function formatPhoneNumber(phoneNumber: string) {
        if (phoneNumber.length !== 12) {
            return phoneNumber;
        }

        const countryCode = phoneNumber.slice(1, 2);
        const firstPart = phoneNumber.slice(2, 5);
        const secondPart = phoneNumber.slice(5, 8);
        const thirdPart = phoneNumber.slice(8, 10);
        const fourthPart = phoneNumber.slice(10, 12);

        const formattedPhoneNumber =
            "+" +
            countryCode +
            " (" +
            firstPart +
            ") " +
            secondPart +
            "-" +
            thirdPart +
            "-" +
            fourthPart;

        return formattedPhoneNumber;
    }

    useEffect(() => {
        if (value) {
            setPhoneMask(formatPhoneNumber(value));
        } else {
            setPhoneMask("");
        }
    }, [value]);
    return (
        <>
            <Input
                types="text"
                size={size}
                error={showError || error}
                onChange={handleInputChange}
                value={phoneMask}
                placeholder={placeholder}
                formName={formName}
                formText={formText}
                isFocused={isInputFocused}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                disabled={disabled}
                maskType={"phone"}
                outlined={outlined}
                startIcon={!disableStartIcon ? <IconTelephone /> : undefined}
                brand={brand}
                readonly={readonly}
                required={required}
            />
        </>
    );
};
