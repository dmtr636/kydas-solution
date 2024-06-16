import React, { useRef, useEffect, useState, ChangeEvent } from "react";
import clsx from "clsx";
import styles from "./styles.module.scss";
import { InputSize } from "src/ui/components/inputs/Input/Input.types";

interface TextAreaProps {
    formName?: string | React.ReactNode;
    formText?: string | React.ReactNode;
    value: any;
    onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    readonly?: boolean;
    height?: number;
    size?: InputSize;
    brand?: boolean;
    appendTextToValue?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
    value,
    onChange,
    placeholder,
    formText,
    formName,
    size = "large",
    height: propHeight,
    readonly,
    brand,
    appendTextToValue,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [height, setHeight] = useState("auto");

    const handleResize = () => {
        if (!propHeight && textareaRef.current) {
            textareaRef.current.style.height = "auto";
            setHeight(`${textareaRef.current.scrollHeight}px`);
        }
    };

    useEffect(() => {
        handleResize();
    }, [propHeight, value]); // Добавление зависимости от value для пересчета высоты при изменении текста

    const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        handleResize();
        if (onChange) {
            onChange(event);
        }
    };

    return (
        <div className={styles.commentBlock}>
            {formName && <div className={clsx(styles.formName, styles[size])}>{formName}</div>}
            <textarea
                style={{ height: propHeight || height }}
                ref={textareaRef}
                disabled={readonly}
                className={clsx(styles.textarea, styles.large, {
                    [styles.readonly]: readonly,
                    [styles.brand]: brand,
                })}
                onChange={handleChange}
                value={(value ?? "") + (appendTextToValue ?? "")}
                placeholder={placeholder}
            />
            {formText && <div className={clsx(styles.formText, styles[size])}>{formText}</div>}
        </div>
    );
};

export default TextArea;
