import styles from "./Avatar.module.scss";
import { clsx } from "clsx";
import { IconUserRounded } from "src/ui/assets/icons";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { DropdownListOption } from "src/ui/components/solutions/DropdownList/DropdownList.types.ts";
import { SingleDropdownList } from "src/ui/components/solutions/DropdownList/SingleDropdownList.tsx";
import { ReactNode } from "react";

interface AvatarProps {
    userName?: string;
    photoUrl?: string;
    size?: "small" | "large";
    dropdownListOptions?: DropdownListOption[];
    icon?: ReactNode;
}

export const Avatar = (props: AvatarProps) => {
    const { userName, photoUrl, size = "small", dropdownListOptions, icon }: AvatarProps = props;

    const initials = userName
        ?.split(" ")
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase())
        .join("");

    const renderAvatar = () => (
        <button
            className={clsx(styles.avatar, styles[size])}
            disabled={!dropdownListOptions?.length}
        >
            {photoUrl ? (
                <img className={styles.photo} src={photoUrl} alt={"Аватар"} />
            ) : icon ? (
                icon
            ) : initials ? (
                <Typo variant={size === "large" ? "h2" : "subheadXL"}>{initials}</Typo>
            ) : (
                <IconUserRounded className={styles.icon} />
            )}
        </button>
    );

    if (!dropdownListOptions?.length) {
        return renderAvatar();
    }

    return (
        <SingleDropdownList
            options={dropdownListOptions}
            mode={"neutral"}
            tipPosition={"top-right"}
        >
            {renderAvatar()}
        </SingleDropdownList>
    );
};
