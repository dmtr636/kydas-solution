import styles from "./Overlay.module.scss";
import { IconClose } from "src/ui/assets/icons";
import { ReactNode, useEffect, useRef } from "react";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { createPortal } from "react-dom";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { clsx } from "clsx";

interface OverlayProps {
    open: boolean;
    onClose?: () => void;
    title: string;
    children: ReactNode;
    actions: ReactNode[];
    closeOnBackdropClick?: boolean;
    mode?: "accent" | "neutral" | "negative";
}

export const Overlay = (props: OverlayProps) => {
    const {
        open,
        onClose,
        title,
        children,
        actions,
        closeOnBackdropClick,
        mode = "neutral",
    }: OverlayProps = props;
    const dragging = useRef(false);
    const translate = useRef({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open) {
            translate.current = { x: 0, y: 0 };
            document.addEventListener("mouseup", handleDocumentMouseUp);
        }
        return () => document.removeEventListener("mouseup", handleDocumentMouseUp);
    }, [open]);

    const handleDocumentMouseUp = () => {
        dragging.current = false;
    };

    if (!open) {
        return null;
    }

    return createPortal(
        <div
            className={styles.background}
            onClick={() => {
                if (closeOnBackdropClick) {
                    onClose?.();
                }
            }}
            onMouseMove={(event) => {
                if (dragging.current && cardRef.current) {
                    let { x, y } = translate.current;
                    x += event.movementX;
                    y += event.movementY;
                    translate.current = { x, y };
                    cardRef.current.style.translate = `${x}px ${y}px`;
                }
            }}
        >
            <div ref={cardRef} className={styles.card}>
                <div
                    className={clsx(styles.header, styles[mode])}
                    onMouseDown={() => {
                        dragging.current = true;
                    }}
                >
                    <Typo variant={"h5"} className={styles.title}>
                        {title}
                    </Typo>
                    {onClose && (
                        <ButtonIcon
                            className={styles.closeIcon}
                            onClick={onClose}
                            type={"outlined"}
                            mode={"neutral"}
                            size={"small"}
                            onMouseDown={(event) => event.stopPropagation()}
                        >
                            <IconClose />
                        </ButtonIcon>
                    )}
                </div>
                <div className={styles.content}>
                    {children}
                    <div className={styles.actions}>
                        {actions.map((action, index) => (
                            <div key={index}>{action}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>,
        document.body,
    );
};
