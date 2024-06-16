import { ReactNode } from "react";

export interface TableColumn<T> {
    name: string | ReactNode;
    width: number;
    render: (object: T) => ReactNode;
    sortField?: string;
    borderRight?: boolean;
}
