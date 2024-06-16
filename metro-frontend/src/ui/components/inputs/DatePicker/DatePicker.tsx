import styles from "./DatePicker.module.scss";
import { useEffect, useMemo, useState } from "react";

import { PopoverBase } from "src/ui/components/solutions/PopoverBase/PopoverBase.tsx";
import {
    Calendar,
    CalendarChangeReason,
    CalendarProps,
} from "src/ui/components/solutions/Calendar/Calendar.tsx";
import { Input, InputProps } from "src/ui/components/inputs/Input/Input.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { IconCalendar, IconClose } from "src/ui/assets/icons";
import { clsx } from "clsx";

export interface DatePickerProps
    extends CalendarProps,
        Pick<
            InputProps,
            "formName" | "placeholder" | "formText" | "startIcon" | "size" | "required"
        > {
    value: string | null;
    brand?: boolean;
    manualInput?: boolean;
    disableClear?: boolean;
    readonly?: boolean;
}

export const DatePicker = (props: DatePickerProps) => {
    const {
        value,
        formName,
        formText,
        placeholder,
        startIcon,
        size = "medium",
        onChange,
        brand,
        required,
        disableTime,
        manualInput,
        disableClear,
        readonly,
    }: DatePickerProps = props;
    const [showCalendar, setShowCalendar] = useState(false);
    const [hover, setHover] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const date = useMemo(() => {
        if (value) {
            return new Date(value);
        }
    }, [value]);

    useEffect(() => {
        if (date) {
            setInputValue(date.toLocaleDateString());
        } else {
            setInputValue("");
        }
    }, [date]);

    const handleChange = (dateValue: string | null, reason?: CalendarChangeReason) => {
        onChange(dateValue);
        if (reason === "clickDay") {
            if (disableTime) {
                setShowCalendar(false);
            }
        }
    };

    const getInputValue = (date?: Date) => {
        if (manualInput) {
            return inputValue;
        }
        if (date) {
            if (disableTime) {
                return date.toLocaleDateString();
            }
            return `${date.toLocaleDateString()} / ${date.toLocaleTimeString([], { timeStyle: "short" })}`;
        }
        return "";
    };

    const getDefaultPlaceholder = () => {
        if (manualInput) {
            return "ДД.ММ.ГГГГ";
        }
        return !disableTime ? "Выберите дату и время" : "Выберите дату";
    };

    const isValidFullDate = (value: string) => {
        const fulldateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
        if (!fulldateRegex.test(value)) {
            return false;
        }
        const [day, month, year] = value.split(".");
        const isValidDay = parseInt(day, 10) >= 1 && parseInt(day, 10) <= 31;
        const isValidMonth = parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12;
        const isValidYear = parseInt(year, 10) >= 1900 && parseInt(year, 10) <= 2100;
        return isValidDay && isValidMonth && isValidYear;
    };

    return (
        <PopoverBase
            mode={"contrast"}
            triggerEvent={manualInput ? "none" : "click"}
            content={
                <Calendar
                    {...props}
                    onChange={handleChange}
                    disableTime={manualInput ? true : disableTime}
                />
            }
            show={showCalendar}
            setShow={setShowCalendar}
            fullWidth={true}
            hideTip={true}
        >
            <Input
                formName={formName}
                placeholder={placeholder ?? getDefaultPlaceholder()}
                formText={formText}
                value={getInputValue(date)}
                onChange={(event) => {
                    if (manualInput) {
                        setInputValue(event.target.value);
                        if (isValidFullDate(event.target.value)) {
                            const [day, month, year] = event.target.value.split(".");
                            handleChange(
                                new Date(
                                    Number(year),
                                    Number(month) - 1,
                                    Number(day),
                                ).toISOString(),
                            );
                        }
                    }
                }}
                size={size}
                required={required}
                brand={brand}
                readonly={readonly}
                startIcon={startIcon}
                endActions={
                    <div className={styles.inputEndActions}>
                        {value && hover && !disableClear && (
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
                            onClick={() => {
                                if (manualInput) {
                                    setShowCalendar(!showCalendar);
                                }
                            }}
                        >
                            <IconCalendar />
                        </ButtonIcon>
                    </div>
                }
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                className={clsx(styles.Input, { [styles.manualInput]: manualInput })}
                isFocused={showCalendar}
                style={{ width: 326 }}
                maskType={manualInput ? "fulldate" : undefined}
                onBlur={() => {
                    if (manualInput) {
                        if (!isValidFullDate(inputValue)) {
                            setInputValue("");
                            handleChange(null);
                        }
                    }
                }}
            />
        </PopoverBase>
    );
};
