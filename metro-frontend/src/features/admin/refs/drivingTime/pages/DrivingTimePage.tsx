import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { IconQuestion } from "src/ui/assets/icons";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { store } from "src/app/AppStore.ts";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { MetroLine } from "src/features/admin/refs/stations/components/MetroLine/MetroLine.tsx";
import { MetroStation } from "src/features/admin/refs/stations/components/MetroStation/MetroStation.tsx";
import { useEffect } from "react";

export const DrivingTimePage = observer(() => {
    useEffect(() => {
        store.stations.filter.search = "";
    }, []);

    return (
        <AdminPageContentLayout
            title={"Время движения между станциями"}
            breadCrumbs={[
                {
                    name: "Справочники",
                    icon: <IconQuestion />,
                },
                {
                    name: "Время движения между станциями",
                },
            ]}
        >
            <ExplorationWithStore
                inputPlaceholder={"Поиск по названию станции"}
                filterStore={store.stations.filter}
                enableFilter={false}
            />
            <Table
                data={store.stations.filteredStationsDrivingTimes}
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
