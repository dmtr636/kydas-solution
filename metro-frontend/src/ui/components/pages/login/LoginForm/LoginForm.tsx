import { FormEvent, ReactNode, useEffect } from "react";
import styles from "./style.module.scss";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";
import { PasswordInput } from "src/ui/components/inputs/PasswordInput/PasswordInput.tsx";
import { IconAttention, IconSuccess } from "src/ui/assets/icons";
import { Alert } from "src/ui/components/solutions/Alert/Alert.tsx";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import clsx from "clsx";
import { getEmailDomain } from "src/shared/config/domain.ts";

interface loginFormProps {
    logo: ReactNode | string;
    email: string;
    password: string;
    isChecked: boolean;
    onChangeEmail: (email: string) => void;
    onChangePassword: (pass: string) => void;
    onChangeChecked: (isChecked: boolean) => void;
    onClickEnter: () => void;
    recover?: boolean;
    onClickRecover?: () => void;
    showAlert: boolean;
    subtitleAlertext: () => string | string;
    titleAlertText: () => string | string;
    error: boolean;
    blockButton?: boolean;
    passIsChange: boolean;
    isLoading?: boolean;
    fullwidthButton?: boolean;
    brand?: boolean;
}

export const LoginForm = ({
    logo,
    email,
    password,
    isChecked,
    onChangeEmail,
    onChangePassword,
    onClickEnter,
    onClickRecover,
    onChangeChecked,
    recover = true,
    subtitleAlertext,
    showAlert = false,
    error,
    blockButton,
    titleAlertText,
    passIsChange,
    isLoading = false,
    fullwidthButton,
    brand,
}: loginFormProps) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const disabledButton = !(password && emailRegex.test(email.trim()));
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onClickEnter();
    };
    useEffect(() => {
        if (window.innerWidth < 720) {
            if (getEmailDomain()) {
                onChangeEmail(`inspector-1@${getEmailDomain()}`);
            }
        }
    }, [window.innerWidth]);
    return (
        <form className={styles.container} onSubmit={handleSubmit}>
            <div className={styles.logo}>{logo} </div>
            <div className={styles.inputs}>
                <EmailInput
                    brand={brand}
                    value={email}
                    onChange={onChangeEmail}
                    error={error}
                    formText={getEmailDomain() ?
                        <div className={styles.linkButtons}>
                            <button
                                type={"button"}
                                className={clsx(styles.linkButton, {
                                    [styles.selected]: email.includes("admin-"),
                                })}
                                onClick={() => onChangeEmail(`admin-1@${getEmailDomain()}`)}
                            >
                                Админ
                            </button>
                            <div className={styles.divider} />
                            <button
                                type={"button"}
                                className={clsx(styles.linkButton, {
                                    [styles.selected]: email.includes("specialist-"),
                                })}
                                onClick={() => onChangeEmail(`specialist-1@${getEmailDomain()}`)}
                            >
                                Специалист
                            </button>
                            <div className={styles.divider} />
                            <button
                                type={"button"}
                                className={clsx(styles.linkButton, {
                                    [styles.selected]: email.includes("operator-"),
                                })}
                                onClick={() => onChangeEmail(`operator-1@${getEmailDomain()}`)}
                            >
                                Оператор
                            </button>
                            <div className={styles.divider} />
                            <button
                                type={"button"}
                                className={clsx(styles.linkButton, {
                                    [styles.selected]: email.includes("inspector-"),
                                })}
                                onClick={() => onChangeEmail(`inspector-1@${getEmailDomain()}`)}
                            >
                                Инспектор
                            </button>
                        </div> : undefined
                    }
                />
                <PasswordInput
                    brand={brand}
                    value={password}
                    onChange={onChangePassword}
                    error={error}
                />
            </div>
            <div className={styles.checkbox}>
                <Checkbox title="Запомнить меня" checked={isChecked} onChange={onChangeChecked} />
            </div>
            {showAlert && (
                <div className={styles.alert}>
                    {passIsChange ? (
                        <Alert
                            mode="positive"
                            title={"Новый пароль установлен"}
                            icon={<IconSuccess />}
                        />
                    ) : (
                        <Alert
                            mode="negative"
                            title={titleAlertText()}
                            subtitle={subtitleAlertext()}
                            icon={<IconAttention />}
                        />
                    )}
                </div>
            )}
            <div className={styles.buttonsBLock}>
                <div className={styles.enterButton}>
                    <Button
                        isSubmit={true}
                        loading={isLoading}
                        disabled={blockButton || disabledButton}
                        onClick={onClickEnter}
                        type="primary"
                        size="large"
                        mode={brand ? "brand" : "accent"}
                        fullWidth={fullwidthButton}
                    >
                        Войти
                    </Button>
                </div>

                {recover && (
                    <div className={styles.recoverButton}>
                        <Button onClick={onClickRecover} type="tertiary" size="large" mode="accent">
                            Восстановить пароль
                        </Button>
                    </div>
                )}
            </div>
        </form>
    );
};
