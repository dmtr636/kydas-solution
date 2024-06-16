import styles from "./Header.module.scss";
import { Fragment, ReactNode, useState } from "react";
import { IconBack } from "src/ui/assets/icons";
import { clsx } from "clsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { getScrollBarWidth } from "src/ui/utils/getScrollbarWidth.ts";

export interface HeaderProps {
    title: ReactNode;
    notification?: ReactNode;
    avatar?: ReactNode;
    actions?: ReactNode[];
    onBack?: () => void;
    sticky?: boolean;
}

export const Header = (props: HeaderProps) => {
    const { title, notification, avatar, actions, onBack, sticky }: HeaderProps = props;
    const [scrollbarWidth] = useState(() => getScrollBarWidth());

    return (
        <>
            <div
                className={styles.header}
                style={{
                    marginRight: `-${scrollbarWidth}px`,
                }}
            >
                <div className={styles.titleRow}>
                    <div className={styles.title}>
                        {onBack && (
                            <ButtonIcon
                                className={styles.backButton}
                                mode={"neutral"}
                                onClick={onBack}
                            >
                                <IconBack />
                            </ButtonIcon>
                        )}
                        {title}
                    </div>
                    <div className={styles.titleRowActions}>
                        {notification}
                        {avatar}
                    </div>
                </div>
            </div>
            {!!actions?.length && (
                <div
                    className={clsx(styles.header, { [styles.sticky]: sticky })}
                    style={{
                        marginRight: `-${scrollbarWidth}px`,
                    }}
                >
                    <div className={styles.actionsRow}>
                        {actions?.map((action, index) => <Fragment key={index}>{action}</Fragment>)}
                    </div>
                </div>
            )}
        </>
    );
};
