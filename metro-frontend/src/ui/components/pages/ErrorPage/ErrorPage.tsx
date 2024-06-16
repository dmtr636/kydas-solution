import { ErrorResponse, useNavigate, useRouteError } from "react-router-dom";
import ErrorImage from "./ErrorImage.svg?react";
import styles from "./ErrorPage.module.scss";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconBack } from "src/ui/assets/icons";
import { store } from "src/app/AppStore.ts";

export const ErrorPage = () => {
    const error = useRouteError() as ErrorResponse | Error;
    const navigate = useNavigate();

    console.error(error);

    const is404Error = "status" in error && error.status === 404;

    const getErrorMessage = () => {
        if (is404Error) {
            return "Ошибка 404";
        }
        if ("message" in error && error.message) {
            return `Неизвестная ошибка (${error.message})`;
        }
        return `Неизвестная ошибка`;
    };

    const getText = () => {
        if (is404Error) {
            return (
                "Возможно, страница была удалена, переехала на другой " +
                "адрес или её никогда не существовало. В любом случае вы " +
                "сможете вернуться обратно в сервис"
            );
        }
        return (
            "Попробуйте выполнить операцию ещё раз. Если ошибка " +
            "повторяется, то свяжитесь с нами и, пожалуйста, сообщите, " +
            "что случилось"
        );
    };

    return (
        <div className={styles.container}>
            <ErrorImage />
            <div>
                <Typo variant={"subheadXL"} className={styles.errorDescription}>
                    {getErrorMessage()}
                </Typo>
                <Typo variant={"h1"} className={styles.title}>
                    Нам жаль, что это произошло
                </Typo>
                <Typo variant={"bodyXL"} className={styles.text}>
                    {getText()}
                </Typo>
                <div className={styles.actions}>
                    {is404Error ? (
                        <Button
                            size={"large"}
                            iconBefore={<IconBack />}
                            onClick={() => navigate("/", { replace: true })}
                        >
                            Вернуться на главную
                        </Button>
                    ) : (
                        <>
                            <Button size={"large"} onClick={() => window.location.reload()}>
                                Перезагрузить страницу
                            </Button>
                            {store.adminLayout.layoutData?.contactLink && (
                                <Button
                                    size={"large"}
                                    type={"tertiary"}
                                    onClick={() =>
                                        window.open(
                                            store.adminLayout.layoutData?.contactLink ?? "",
                                            "_blank",
                                        )
                                    }
                                >
                                    Связаться с нами
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
