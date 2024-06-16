import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { IconQuestion } from "src/ui/assets/icons";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { store } from "src/app/AppStore.ts";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { MetroLine } from "src/features/admin/refs/stations/components/MetroLine/MetroLine.tsx";
import { useEffect } from "react";

export const StationsPage = observer(() => {
    useEffect(() => {
        store.stations.filter.search = "";
    }, []);

    return (
        <AdminPageContentLayout
            title={"Станции"}
            breadCrumbs={[
                {
                    name: "Справочники",
                    icon: <IconQuestion />,
                },
                {
                    name: "Станции",
                },
            ]}
        >
            <ExplorationWithStore
                inputPlaceholder={"Поиск по ID и названию станции"}
                filterStore={store.stations.filter}
                enableFilter={false}
            />
            <Table
                data={store.stations.filteredStations}
                columns={[
                    {
                        name: "ID станции",
                        width: 140,
                        render: (station) => <Typo variant={"actionL"}>{station.id}</Typo>,
                    },
                    {
                        name: "Название станции",
                        width: 400,
                        render: (station) => <Typo variant={"actionL"}>{station.name}</Typo>,
                        borderRight: true,
                    },
                    {
                        name: "Линия",
                        width: 400,
                        render: (station) => <MetroLine station={station} />,
                    },
                ]}
                loading={store.stations.loader.loading}
                filterStore={store.stations.filter}
                tableHeaderBorderRadius
                onePageHeader
            />
        </AdminPageContentLayout>
    );
});
