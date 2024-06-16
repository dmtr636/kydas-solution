import styles from "./Sidebar.module.scss";
import { ReactNode, useEffect, useState } from "react";
import { SidebarRoute } from "src/ui/components/segments/Sidebar/Sidebar.types.ts";
import { IconCollapse } from "src/ui/assets/icons";
import { clsx } from "clsx";
import { SidebarMenuItem } from "src/ui/components/segments/Sidebar/SidebarMenuItem/SidebarMenuItem.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { ADMIN_PAGE_CONTENT_LAYOUT_ID } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { Link } from "react-router-dom";

interface SidebarProps {
    logo: ReactNode;
    routes: SidebarRoute[];
    footerRoutes?: SidebarRoute[];
}

export const SIDEBAR_WIDTH = 240;
export const COLLAPSED_SIDEBAR_WIDTH = 76;

export const Sidebar = (props: SidebarProps) => {
    const { logo, routes, footerRoutes }: SidebarProps = props;
    const [collapsed, setCollapsed] = useState(false);
    const [showSubmenu, setShowSubmenu] = useState(false);
    const [disableHoverEvents, setDisableHoverEvents] = useState(false);

    useEffect(() => {
        const onClickOutside = () => {
            setDisableHoverEvents(false);
            setShowSubmenu(false);
        };
        const container = document.getElementById(ADMIN_PAGE_CONTENT_LAYOUT_ID);
        container?.addEventListener("click", onClickOutside);
        return () => container?.removeEventListener("click", onClickOutside);
    }, []);

    const sidebarClassName = clsx(styles.sidebar, {
        [styles.collapsed]: collapsed,
        [styles.withSubmenu]: showSubmenu,
    });
    const sidebarStyle = {
        width: collapsed ? `${COLLAPSED_SIDEBAR_WIDTH}px` : `${SIDEBAR_WIDTH}px`,
    };

    const renderRoutes = (routes: SidebarRoute[]) => {
        return routes.map((route) => (
            <SidebarMenuItem
                route={route}
                collapsed={collapsed}
                showSubmenu={showSubmenu}
                setShowSubmenu={setShowSubmenu}
                disableHoverEvents={disableHoverEvents}
                setDisableHoverEvents={setDisableHoverEvents}
                key={route.path + route.name}
            />
        ));
    };

    return (
        <div className={sidebarClassName} style={sidebarStyle}>
            <div className={styles.header}>
                {!collapsed && (
                    <Link to={"/admin"} className={styles.logo}>
                        {logo}
                    </Link>
                )}
                <ButtonIcon
                    mode={"contrast"}
                    onClick={() => setCollapsed(!collapsed)}
                    className={styles.collapseButton}
                >
                    <IconCollapse />
                </ButtonIcon>
            </div>
            <div className={styles.menu}>{renderRoutes(routes)}</div>
            {footerRoutes && footerRoutes.length && (
                <div className={styles.footer}>
                    <div className={styles.menu}>{renderRoutes(footerRoutes)}</div>
                </div>
            )}
        </div>
    );
};
