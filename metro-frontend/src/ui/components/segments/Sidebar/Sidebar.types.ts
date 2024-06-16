import { ReactNode } from "react";

export interface SidebarRoute {
    name: string;
    path: string;
    end?: boolean;
    icon?: ReactNode;
    counterValue?: number;
    onClick?: () => void;
    children?: SidebarChildRoute[];
}

export interface SidebarChildRoute {
    name: string;
    path: string;
    counterValue?: number;
    onClick?: () => void;
}
