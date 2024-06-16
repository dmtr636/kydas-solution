import styles from "./Card.module.scss";
import { ReactNode } from "react";
import { clsx } from "clsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";

export interface CardProps {
    children: ReactNode;
    title?: ReactNode;
    className?: string;
}

export const Card = (props: CardProps) => {
    const { children, title, className }: CardProps = props;
    return (
        <div className={clsx(styles.card, className)}>
            {title && (
                <Typo variant={"h5"} className={styles.title}>
                    {title}
                </Typo>
            )}
            {children}
        </div>
    );
};
