import { TableColumn } from "src/ui/components/segments/Table/Table.types.ts";
import { ReactNode, useEffect, useState } from "react";
import styles from "./Table.module.scss";
import { clsx } from "clsx";
import { SkeletonList } from "src/ui/components/info/Skeleton/SkeletonList.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { IconSortingArrowDown, IconSortingArrows, IconSortingArrowUp } from "src/ui/assets/icons";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { observer } from "mobx-react-lite";
import { ADMIN_PAGE_CONTENT_LAYOUT_ID } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { throttle } from "src/shared/utils/throttle.ts";

interface TableProps<T> {
    data: T[];
    columns: TableColumn<T>[];
    tabs?: ReactNode;
    headerFilters?: ReactNode;
    loading?: boolean;
    filterStore?: FilterStore;
    onRowClick?: (data: T) => void;
    card?: boolean;
    onePageHeader?: boolean;
    tableHeaderBorderRadius?: boolean;
    noSticky?: boolean;
    rowHeight?: number;
}

export const Table = observer(<T extends object>(props: TableProps<T>) => {
    const [sliceLength, setSliceLength] = useState(50);

    useEffect(() => {
        const onScroll = throttle(() => {
            if (container) {
                if (
                    container.scrollTop + container.clientHeight + 500 > container.scrollHeight &&
                    sliceLength < props.data.length
                ) {
                    setSliceLength(sliceLength + 50);
                }
            }
        }, 20);
        const container = document.getElementById(ADMIN_PAGE_CONTENT_LAYOUT_ID);
        container?.addEventListener("scroll", onScroll);
        return () => container?.removeEventListener("scroll", onScroll);
    }, [sliceLength, props.data.length]);

    const renderSortingIcon = (column: TableColumn<T>) => {
        if (props.filterStore?.sortField === column.sortField) {
            if (props.filterStore?.sortDirection === "asc") {
                return <IconSortingArrowUp className={styles.sortingArrows} />;
            } else {
                return <IconSortingArrowDown className={styles.sortingArrows} />;
            }
        }
        return <IconSortingArrows className={styles.sortingArrows} />;
    };

    const handleColumnTitleButtonClick = (column: TableColumn<T>) => {
        if (props.filterStore?.sortField === column.sortField) {
            const newDirection = props.filterStore?.sortDirection === "desc" ? "asc" : "desc";
            props.filterStore?.setSort(`${column.sortField}-${newDirection}`);
        } else {
            props.filterStore?.setSort(`${column.sortField}-desc`);
        }
    };

    const getData = () => {
        if (sliceLength) {
            return props.data.slice(0, sliceLength);
        } else {
            return props.data;
        }
    };

    return (
        <div
            className={clsx(styles.container, {
                [styles.card]: props.card !== false,
                [styles.tableHeaderBorderRadius]: props.tableHeaderBorderRadius,
            })}
        >
            {props.tabs && <div className={styles.tabs}>{props.tabs}</div>}
            {props.headerFilters && (
                <div className={styles.headerFilters}>{props.headerFilters}</div>
            )}
            <div
                className={clsx(styles.row, styles.headerRow, {
                    [styles.onePageHeader]: props.onePageHeader,
                    [styles.tableHeaderBorderRadius]: props.tableHeaderBorderRadius,
                    [styles.noSticky]: props.noSticky,
                })}
            >
                {props.columns.map((column, index) => (
                    <div
                        className={clsx(styles.cell, styles.headerCell, {
                            [styles.borderRight]: column.borderRight,
                        })}
                        style={{ width: column.width }}
                        key={index}
                    >
                        {column.sortField ? (
                            <button
                                className={clsx(styles.columnTitleButton, {
                                    [styles.active]:
                                        props.filterStore?.sortField === column.sortField,
                                })}
                                onClick={() => handleColumnTitleButtonClick(column)}
                            >
                                <Typo variant={"actionL"}>{column.name}</Typo>
                                {renderSortingIcon(column)}
                            </button>
                        ) : (
                            <Typo variant={"actionL"}>{column.name}</Typo>
                        )}
                    </div>
                ))}
            </div>
            {props.loading && <SkeletonList margin={"20px 32px"} gap={"0px"} />}
            {!props.loading &&
                getData().map((item: T, index) => (
                    <div
                        className={clsx(styles.row, styles.dataRow, {
                            [styles.clickable]: !!props.onRowClick,
                        })}
                        style={{ height: props.rowHeight }}
                        onClick={() => props.onRowClick?.(item)}
                        key={"id" in item ? `${item["id"]}` : index}
                    >
                        {props.columns.map((column, index) => (
                            <div
                                className={clsx(styles.cell, styles.dataCell, {
                                    [styles.borderRight]: column.borderRight,
                                })}
                                style={{ width: column.width }}
                                key={index}
                            >
                                {column.render(item) ?? (
                                    <Typo variant={"actionL"} className={styles.dash}>
                                        —
                                    </Typo>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            {!props.data.length && !props.loading && (
                <Typo variant={"subheadXL"} className={styles.emptyTable}>
                    Ничего не найдено
                </Typo>
            )}
        </div>
    );
});
