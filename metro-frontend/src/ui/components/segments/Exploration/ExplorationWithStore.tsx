import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { Exploration, FilterChip } from "src/ui/components/segments/Exploration/Exploration.tsx";
import { ReactNode, useState } from "react";
import { Drawer } from "src/ui/components/segments/Drawer/Drawer.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { observer } from "mobx-react-lite";

interface ExplorationWithStoreProps {
    inputPlaceholder: string;
    filterStore: FilterStore;
    enableFilter: boolean;
    filterContent?: ReactNode;
    filters?: FilterChip[];
    applyButtonLabel?: string;
}

export const ExplorationWithStore = observer((props: ExplorationWithStoreProps) => {
    const [showFilterDrawer, setShowFilterDrawer] = useState(false);
    const store = props.filterStore;

    return (
        <>
            <Exploration
                inputPlaceholder={props.inputPlaceholder}
                onInputChange={(value) => store.setSearch(value)}
                inputValue={store.search}
                sortOptions={store.sortOptions}
                sortValue={store.sort}
                onSortChange={(value) => store.setSort(value)}
                onFilterButtonClick={
                    props.enableFilter ? () => setShowFilterDrawer(true) : undefined
                }
                filters={props.filters}
                onDeleteFilter={(field, value) => store.resetFilter(field, value)}
                filterCounter={store.appliedFiltersCount || undefined}
            />
            <Drawer
                open={showFilterDrawer}
                onClose={() => {
                    store.filterForm = JSON.parse(JSON.stringify(store.filterValues));
                    setShowFilterDrawer(false);
                }}
                title={"Фильтры"}
                actions={(onClose) => [
                    <Button
                        key={"apply"}
                        fullWidth={true}
                        onClick={() => {
                            store.applyFilters();
                            onClose();
                        }}
                        disabled={
                            JSON.stringify(store.filterValues) === JSON.stringify(store.filterForm)
                        }
                    >
                        {props.applyButtonLabel ?? "Применить фильтры"}
                    </Button>,
                    <Button
                        key={"reset"}
                        type={"tertiary"}
                        fullWidth={true}
                        onClick={() => {
                            store.resetFilters();
                            store.applyFilters();
                            onClose();
                        }}
                        disabled={!Object.values(store.filterForm).flat().length}
                    >
                        Сбросить фильтры
                    </Button>,
                ]}
            >
                {props.filterContent}
            </Drawer>
        </>
    );
});
