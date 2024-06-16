import styles from "./Person.module.scss";
import { Avatar } from "src/ui/components/solutions/Avatar/Avatar.tsx";
import { TooltipTypo } from "src/ui/components/info/TooltipTypo/TooltipTypo.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { IconClose, IconEdit } from "src/ui/assets/icons";
import { ReactNode } from "react";
import { clsx } from "clsx";

interface PersonProps {
    fullName?: string;
    firstName?: string | null;
    lastName?: string | null;
    patronymic?: string | null;
    onEdit?: () => void;
    onDelete?: () => void;
    onClick?: () => void;
    icon?: ReactNode;
    iconAfter?: ReactNode;
    additionalText?: ReactNode;
    deleteIcon?: ReactNode;
    disabledDelete?: boolean;
}

export const Person = (props: PersonProps) => {
    const name =
        props.fullName ??
        [props.lastName, props.firstName, props.patronymic].filter(Boolean).join(" ");
    return (
        <div
            className={clsx(styles.person, { [styles.clickable]: !!props.onClick })}
            onClick={props.onClick}
        >
            <Avatar userName={name} size={"small"} icon={props.icon} />
            <TooltipTypo variant={"actionL"}>
                {name}
                {props.additionalText}
            </TooltipTypo>
            {props.iconAfter}
            {(props.onDelete || props.onEdit) && (
                <div className={styles.actions}>
                    {props.onEdit && (
                        <ButtonIcon
                            mode={"neutral"}
                            size={"small"}
                            pale={true}
                            onClick={props.onEdit}
                        >
                            <IconEdit />
                        </ButtonIcon>
                    )}
                    {props.onDelete && (
                        <ButtonIcon
                            mode={"neutral"}
                            size={"small"}
                            pale={true}
                            onClick={props.onDelete}
                            disabled={props.disabledDelete}
                        >
                            {props.deleteIcon ?? <IconClose />}
                        </ButtonIcon>
                    )}
                </div>
            )}
        </div>
    );
};
