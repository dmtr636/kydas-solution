import { ReactNode } from "react";

export interface DropdownListOption<T = string> {
    name: string;
    value?: T;
    onClick?: () => void;
    disabled?: boolean;
    icon?: ReactNode;
    listItemIcon?: ReactNode;
}

export interface MultipleDropdownListOption<T> extends DropdownListOption<T> {
    value: T;
}

export type DropdownListOptions<T = string> = DropdownListOption<T>[] | DropdownListOption<T>[][];

export type MultipleDropdownListOptions<T> =
    | MultipleDropdownListOption<T>[]
    | MultipleDropdownListOption<T>[][];

export type DropdownListMode = "accent" | "neutral";
export type DropdownListSize = "large" | "medium";
