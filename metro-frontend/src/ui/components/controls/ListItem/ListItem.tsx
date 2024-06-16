import { ReactNode, RefObject } from "react";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconCheckboxOff, IconCheckboxOn } from "src/ui/assets/icons";

interface ListItemProps {
    children: ReactNode;
    onClick?: () => void;
    checked?: boolean;
    disabled?: boolean;
    mode?: "accent" | "neutral";
    size?: "large" | "medium";
    iconBefore?: ReactNode;
    customIconBefore?: ReactNode;
    _ref?: RefObject<HTMLButtonElement>;
}

export const ListItem = (props: ListItemProps) => {
    const {
        children,
        onClick,
        checked,
        disabled,
        mode = "neutral",
        size = "medium",
        iconBefore,
        customIconBefore,
        _ref,
    }: ListItemProps = props;

    const getIconBefore = () => {
        if (checked === false) {
            return <IconCheckboxOff />;
        }
        if (checked === true) {
            return <IconCheckboxOn />;
        }
        return iconBefore;
    };

    return (
        <Button
            type={"tertiary"}
            mode={mode}
            size={size}
            disabled={disabled}
            pale={checked === false}
            onClick={onClick}
            iconBefore={getIconBefore()}
            customIconBefore={customIconBefore}
            fullWidth={true}
            align={"start"}
            listItem={true}
            _ref={_ref}
        >
            {children}
        </Button>
    );
};
