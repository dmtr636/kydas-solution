import styles from "./Input.module.scss";
import {
    ChangeEvent,
    CSSProperties,
    forwardRef,
    ReactNode,
    RefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import { clsx } from "clsx";
import { InputSize, InputType } from "src/ui/components/inputs/Input/Input.types.ts";
import ReactInputMask from "react-input-mask";
import { Tooltip } from "src/ui/components/info/Tooltip/Tooltip.tsx";

export interface InputProps {
    placeholder?: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    types?: InputType;
    size?: InputSize;
    startIcon?: ReactNode;
    customStartIcon?: ReactNode;
    endIcon?: ReactNode;
    endActions?: ReactNode;
    counterValue?: number;
    className?: string;
    style?: CSSProperties | undefined;
    value: any;
    error?: boolean;
    formName?: string | ReactNode;
    formText?: string | ReactNode;
    isFocused?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    disabled?: boolean;
    outlined?: boolean;
    autoFocus?: boolean;
    number?: boolean;
    inputRef?: RefObject<any>;
    maskType?: "phone" | "date" | "fulldate" | "time" | "year";
    centered?: boolean;
    brand?: boolean;
    required?: boolean;
    showTooltip?: boolean;
    id?: string;
    readonly?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const {
        placeholder,
        onChange,
        size = "medium",
        customStartIcon,
        startIcon,
        endIcon,
        endActions,
        className,
        formName = "",
        value,
        types = "text",
        error = false,
        formText = "",
        isFocused: propIsFocused,
        onFocus: propOnFocus,
        onBlur: propOnBlur,
        onMouseEnter,
        onMouseLeave,
        disabled,
        style,
        outlined = false,
        autoFocus,
        number,
        maskType,
        centered,
        brand,
        required,
        showTooltip = true,
        id,
        readonly,
    }: InputProps = props;

    const [isInputFocused, setIsInputFocused] = useState(false);

    const inputClassName = clsx(
        styles.inputContainer,
        styles[size],
        {
            [styles.outlined]: outlined,
            [styles.disabled]: disabled,
            [styles.focus]: isInputFocused,
            [styles.readonly]: readonly,
        },
        className,
    );
    const handleInputFocus = (): void => {
        setIsInputFocused(true);
        propOnFocus && propOnFocus();
    };
    const handleInputBlur = (): void => {
        setIsInputFocused(false);
        propOnBlur && propOnBlur();
    };
    useEffect(() => {
        if (propIsFocused !== undefined) {
            setIsInputFocused(propIsFocused);
        }
    }, [propIsFocused]);
    const masks = [
        { mask: "+7 (999) 999-99-99", placeholder: "+7 (___) ___-__-__" },
        { mask: "99.99.9999", placeholder: "ДД.ММ.ГГГГ" },

        { mask: "99.99", placeholder: "ДД.ММ" },
        { mask: "99:99", placeholder: "ММ:ЧЧ" },
        { mask: "9999", placeholder: "____" },
    ];

    let currentMask: any;
    let currentPlaceholder: any;
    if (maskType) {
        switch (maskType) {
            case "phone":
                currentMask = masks[0].mask;
                currentPlaceholder = masks[0].placeholder;
                break;
            case "fulldate":
                currentMask = masks[1].mask;
                currentPlaceholder = masks[1].placeholder;
                break;
            case "date":
                currentMask = masks[2].mask;
                currentPlaceholder = masks[2].placeholder;
                break;
            case "time":
                currentMask = masks[3].mask;
                currentPlaceholder = masks[3].placeholder;
                break;
            case "year":
                currentMask = masks[4].mask;
                currentPlaceholder = masks[4].placeholder;
                break;
            default:
                currentMask = "/*";
        }
    }

    const formNameText = required ? (
        <>
            {formName}
            <span className={styles.required}>*</span>
        </>
    ) : (
        formName
    );
    const inputRef = props.inputRef ?? useRef<any>(null);

    const focusInput = () => {
        inputRef.current.focus();
    };
    const needTooltip = inputRef.current?.scrollWidth > inputRef.current?.offsetWidth;
    const renderInput = () => {
        return (
            <div
                className={inputClassName}
                style={{ ...style }}
                ref={ref}
                onClick={() => {
                    focusInput();
                }}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div
                    className={clsx(styles.inputBorder, {
                        [styles.active]: isInputFocused,
                        [styles.error]: error,
                        [styles.disabled]: disabled,
                        [styles.outlined]: outlined,
                        [styles.brand]: brand,
                        [styles.readonly]: readonly,
                    })}
                />
                <div
                    className={clsx(styles.inputContent, styles[size], {
                        [styles.outlined]: outlined,
                    })}
                >
                    {startIcon && (
                        <div
                            className={clsx(styles.icon, styles.iconBlock, styles[size], {
                                [styles.focus]: isInputFocused || value,
                                [styles.readonly]: readonly,
                            })}
                        >
                            {startIcon}
                        </div>
                    )}

                    {customStartIcon && (
                        <div className={clsx(styles.customStartIcon, styles[size])}>
                            {customStartIcon}
                        </div>
                    )}

                    <ReactInputMask
                        id={id}
                        ref={inputRef}
                        type={number ? "number" : types}
                        value={value}
                        mask={currentMask}
                        className={clsx(styles.input, styles[size], {
                            [styles.focus]: isInputFocused,
                            [styles.disabled]: disabled,
                            [styles.password]: types === "password" && value.length > 0,
                            [styles.outlined]: outlined,
                            [styles.centered]: centered,
                        })}
                        onChange={onChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder={maskType && !placeholder ? currentPlaceholder : placeholder}
                        disabled={disabled || readonly}
                        autoFocus={autoFocus}
                        autoComplete={types === "password" ? "new-password" : undefined}
                    />

                    {endIcon && (
                        <div className={clsx(styles.iconBlock, styles[size])}>{endIcon}</div>
                    )}

                    {endActions}
                </div>
            </div>
        );
    };
    return (
        <div>
            {formName && (
                <div className={clsx(styles.formName, styles[size], { [styles.error]: error })}>
                    {formNameText}
                </div>
            )}
            {/*{needTooltip && !isInputFocused && showTooltip ? (
                <Tooltip tipPosition={"top-center"} mode={"neutral"} text={value}>
                    {renderInput()}
                </Tooltip>
            ) : (
                renderInput()
            )}
*/}{" "}
            {renderInput()}
            {formText && (
                <div className={clsx(styles.formText, styles[size], { [styles.error]: error })}>
                    {formText}
                </div>
            )}
        </div>
    );
});
Input.displayName = "Input";
