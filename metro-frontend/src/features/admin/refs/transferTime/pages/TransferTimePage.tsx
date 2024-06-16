import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { IconQuestion } from "src/ui/assets/icons";
import { useEffect } from "react";
import { store } from "src/app/AppStore.ts";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { MetroStation } from "src/features/admin/refs/stations/components/MetroStation/MetroStation.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";

export const TransferTimePage = observer(() => {
    useEffect(() => {
        store.stations.filter.search = "";
    }, []);

    return (
        <AdminPageContentLayout
            title={"Время пересадок между станциями"}
            breadCrumbs={[
                {
                    name: "Справочники",
                    icon: <IconQuestion />,
                },
                {
                    name: "Время пересадок между станциями",
                },
            ]}
        >
            <ExplorationWithStore
                inputPlaceholder={"Поиск по названию станции"}
                filterStore={store.stations.filter}
                enableFilter={false}
            />
            <Table
                data={store.stations.filteredStationsTransferTimes}
                columns={[
                    {
                        name: "Станция 1",
                        width: 350,
                        render: (station) => (
                            <MetroStation
                                station={
                                    store.stations.stations.find(
                                        (s) => s.id === station.stationId1,
                                    )!
                                }
                            />
                        ),
                        borderRight: true,
                    },
                    {
                        name: "Станция 2",
                        width: 350,
                        render: (station) => (
                            <MetroStation
                                station={
                                    store.stations.stations.find(
                                        (s) => s.id === station.stationId2,
                                    )!
                                }
                            />
                        ),
                        borderRight: true,
                    },
                    {
                        name: "Время (минут)",
                        width: 200,
                        render: (station) => <Typo variant={"actionL"}>{station.timeMinutes}</Typo>,
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
