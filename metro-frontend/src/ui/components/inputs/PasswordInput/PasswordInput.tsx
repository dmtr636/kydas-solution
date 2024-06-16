import React, { ChangeEvent, useState } from "react";
import { Input } from "../Input/Input";
import { IconDontShowPass, IconPassword, IconShowPass } from "src/ui/assets/icons";
import { InputSize } from "../Input/Input.types";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";

export const PasswordInput = ({
    value,
    onChange,
    disabled,
    error,
    size = "large",
    showName = true,
    brand,
    readonly,
}: {
    value: string;
    onChange: (pass: string) => void;
    disabled?: boolean;
    error?: boolean;
    size?: InputSize;
    showName?: boolean;
    brand?: boolean;
    readonly?: boolean;
}) => {
    const [showPass, setShowPass] = React.useState(false);
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleInputFocus = (): void => {
        setIsInputFocused(true);
    };
    const handleInputBlur = (): void => {
        setIsInputFocused(false);
    };
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value);
    };
    const buttonSize = size === "large" ? "small" : "tiny";

    return (
        <>
            <Input
                placeholder="Введите пароль"
                size={size}
                types={showPass ? "text" : "password"}
                value={value}
                onChange={handleInputChange}
                formName={showName ? "Пароль" : ""}
                startIcon={<IconPassword />}
                error={error}
                disabled={disabled}
                isFocused={isInputFocused}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                showTooltip={showPass}
                brand={brand}
                readonly={readonly}
                endIcon={
                    showPass ? (
                        <ButtonIcon
                            size={buttonSize}
                            disabled={disabled}
                            type="tertiary"
                            mode="neutral"
                            pale={true}
                            /* focused={isInputFocused} */ onClick={() => setShowPass(!showPass)}
                        >
                            <IconShowPass />
                        </ButtonIcon>
                    ) : (
                        <ButtonIcon
                            pale={true}
                            size={buttonSize}
                            disabled={disabled}
                            type="tertiary"
                            /* focused={isInputFocused} */ mode="neutral"
                            onClick={() => setShowPass(!showPass)}
                        >
                            <IconDontShowPass />
                        </ButtonIcon>
                    )
                }
            />
        </>
    );
};
