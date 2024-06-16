import styles from "./SidebarMenuItem.module.scss";
import {
    SidebarChildRoute,
    SidebarRoute,
} from "src/ui/components/segments/Sidebar/Sidebar.types.ts";
import { IconArrowRight } from "src/ui/assets/icons";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo";
import {
    COLLAPSED_SIDEBAR_WIDTH,
    SIDEBAR_WIDTH,
} from "src/ui/components/segments/Sidebar/Sidebar.tsx";
import { clsx } from "clsx";

interface SidebarMenuItemProps {
    route: SidebarRoute;
    collapsed: boolean;
    showSubmenu: boolean;
    setShowSubmenu: (show: boolean) => void;
    disableHoverEvents: boolean;
    setDisableHoverEvents: (value: boolean) => void;
}

const SUBMENU_CLOSE_DELAY_MS = 500;
const SUBMENU_OPEN_DELAY_MS = 200;

export const SidebarMenuItem = (props: SidebarMenuItemProps) => {
    const {
        route,
        collapsed,
        showSubmenu,
        setShowSubmenu,
        disableHoverEvents,
        setDisableHoverEvents,
    }: SidebarMenuItemProps = props;
    const closeTimeoutRef = useRef<NodeJS.Timeout>();
    const openTimeoutRef = useRef<NodeJS.Timeout>();

    const hasSubmenu = !!props.route.children?.length;

    const handleMenuItemClick = (e: React.MouseEvent) => {
        if (hasSubmenu) {
            e.preventDefault();
            setShowSubmenu(disableHoverEvents ? !showSubmenu : true);
            setDisableHoverEvents(!disableHoverEvents);
        } else {
            setDisableHoverEvents(false);
            setShowSubmenu(false);
        }
        route.onClick?.();
    };

    const handleMenuItemMouseEnter = () => {
        if (disableHoverEvents) {
            return;
        }
        if (hasSubmenu) {
            clearTimeout(closeTimeoutRef.current);
            openTimeoutRef.current = setTimeout(() => {
                setShowSubmenu(true);
            }, SUBMENU_OPEN_DELAY_MS);
        }
    };

    const handleSubmenuMouseEnter = () => {
        if (disableHoverEvents) {
            return;
        }
        clearTimeout(closeTimeoutRef.current);
    };

    const handleMenuItemMouseLeave = () => {
        if (disableHoverEvents) {
            return;
        }
        if (hasSubmenu) {
            clearTimeout(openTimeoutRef.current);
            closeTimeoutRef.current = setTimeout(() => {
                setShowSubmenu(false);
            }, SUBMENU_CLOSE_DELAY_MS);
        }
    };

    const handleSubmenuMouseLeave = () => {
        if (disableHoverEvents) {
            return;
        }
        setShowSubmenu(false);
    };

    const handleSubmenuMouseClick = (route: SidebarChildRoute) => {
        route.onClick?.();
        setDisableHoverEvents(false);
    };

    const renderSubmenu = () => {
        if (!route.children?.length || !showSubmenu) {
            return;
        }
        const style = {
            left: collapsed ? COLLAPSED_SIDEBAR_WIDTH : SIDEBAR_WIDTH,
        };
        return createPortal(
            <div
                className={styles.submenu}
                style={style}
                onMouseEnter={handleSubmenuMouseEnter}
                onMouseLeave={handleSubmenuMouseLeave}
            >
                <Typo variant={"h5"} className={styles.submenuHeader}>
                    {route.name}
                </Typo>
                <div className={styles.submenuItems}>{route.children.map(renderSubmenuItem)}</div>
            </div>,
            document.body,
        );
    };

    const renderSubmenuItem = (route: SidebarChildRoute) => (
        <NavLink
            to={route.path}
            {...getNavLinkTargetProps(route.path)}
            key={route.path + route.name}
        >
            {({ isActive }) => (
                <Button
                    onClick={() => handleSubmenuMouseClick(route)}
                    type={"tertiary"}
                    mode={"contrast"}
                    align={"start"}
                    className={styles.menuItem}
                    focused={isActive}
                    key={route.path}
                    fullWidth={true}
                >
                    {route.name}
                </Button>
            )}
        </NavLink>
    );

    const renderMenuItem = () => (
        <NavLink
            to={route.path}
            end={route.end !== false && !hasSubmenu}
            key={route.path + route.name}
            tabIndex={-1}
            {...getNavLinkTargetProps(route.path)}
        >
            {({ isActive }) => (
                <Button
                    onClick={handleMenuItemClick}
                    onMouseEnter={handleMenuItemMouseEnter}
                    onMouseLeave={handleMenuItemMouseLeave}
                    iconBefore={route.icon}
                    iconAfter={
                        !collapsed &&
                        route.children && (
                            <IconArrowRight
                                className={clsx(styles.arrow, { [styles.rotated]: showSubmenu })}
                            />
                        )
                    }
                    counter={!collapsed ? route.counterValue : undefined}
                    type={"tertiary"}
                    mode={"contrast"}
                    align={"start"}
                    className={styles.menuItem}
                    focused={isActive}
                    key={route.path}
                    fullWidth={true}
                >
                    {!collapsed && route.name}
                </Button>
            )}
        </NavLink>
    );

    const getNavLinkTargetProps = (path: string) => ({
        target: path.startsWith("http") ? "_blank" : undefined,
        rel: path.startsWith("http") ? "noopener noreferrer" : undefined,
    });

    return (
        <>
            {renderMenuItem()}
            {renderSubmenu()}
        </>
    );
};
