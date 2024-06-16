import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import styles from "./SnackbarProvider.module.scss";
import { SnackbarData, snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { Snackbar } from "src/ui/components/info/Snackbar/Snackbar.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { IconClose } from "src/ui/assets/icons";

const DELAY_MS = 2500;

export const SnackbarProvider = observer(() => {
    const firstSnackbar = snackbarStore.snackbars[0];

    useEffect(() => {
        if (firstSnackbar) {
            setTimeout(() => {
                snackbarStore.remove(firstSnackbar.id);
            }, DELAY_MS);
        }
    }, [firstSnackbar]);

    const getActions = (snackbar: SnackbarData) => {
        const actions = [];
        if (snackbar.actionButtonLabel) {
            actions.push(
                <Button
                    key={"actionButton"}
                    mode={snackbar.mode === "neutral" ? "contrast" : snackbar.mode}
                    size={"small"}
                    onClick={(event) => {
                        event.stopPropagation();
                        snackbar.onActionButtonClick?.();
                    }}
                >
                    {snackbar.actionButtonLabel}
                </Button>,
            );
        }
        if (snackbar.showCloseButton) {
            actions.push(
                <ButtonIcon
                    key={"closeButton"}
                    mode={snackbar.mode === "neutral" ? "contrast" : snackbar.mode}
                    size={"small"}
                >
                    <IconClose />
                </ButtonIcon>,
            );
        }
        return actions;
    };

    if (snackbarStore.count) {
        return createPortal(
            <div className={styles.container}>
                {snackbarStore.snackbars.map((snackbar) => (
                    <Snackbar
                        key={snackbar.id}
                        mode={snackbar.mode}
                        onClick={() => snackbarStore.remove(snackbar.id)}
                        actions={getActions(snackbar)}
                    >
                        {snackbar.message}
                    </Snackbar>
                ))}
            </div>,
            document.body,
        );
    }

    return null;
});
