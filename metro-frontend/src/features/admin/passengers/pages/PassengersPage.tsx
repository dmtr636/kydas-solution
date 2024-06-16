import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { store } from "src/app/AppStore.ts";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { IconHeart, IconPlus } from "src/ui/assets/icons";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { numDecl } from "src/shared/utils/numDecl.ts";
import styles from "./RequestsPage.module.scss";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { filterPassengersChip } from "src/features/admin/passengers/utils/filterPassengersChip.ts";
import { PassengersFilter } from "src/features/admin/passengers/PassengersFilter/PassengersFilter.tsx";
import { IPassengerTypes } from "src/features/admin/passengers/utils/passengerTypes.ts";
import healthArray from "src/features/request/healthArray.ts";
import { formatPhoneNumber } from "src/shared/utils/phone.ts";

export const PassengersPage = observer(() => {
    const navigate = useNavigate();

    const getCountForFilterForm = () => {
        return store.passengers.filterRequests(store.passengers.filter.filterForm).length;
    };

    const getFilterApplyButtonLabel = () => {
        const count = getCountForFilterForm();
        let label = "Применить";
        label += ` (${count}  ${numDecl(count, ["заявка", "заявки", "заявок"])})`;
        return label;
    };

    useEffect(
        () => {
            store.passengers.fetchAll();
        },
        [
            /*store.passengers.filter.search*/
        ],
    );

    return (
        <AdminPageContentLayout
            title={"Пассажиры"}
            actions={[
                <Button
                    key={"add"}
                    type={"primary"}
                    iconBefore={<IconPlus />}
                    onClick={() => {
                        navigate("/admin/passengers/add");
                    }}
                >
                    Добавить пассажира
                </Button>,
            ]}
        >
            <ExplorationWithStore
                inputPlaceholder={"Поиск по ФИО пассажира или по мобильному номеру"}
                filterStore={store.passengers.filter}
                enableFilter={true}
                filterContent={<PassengersFilter />}
                filters={filterPassengersChip()}
                applyButtonLabel={getFilterApplyButtonLabel()}
            />
            <Table
                data={store.passengers.filteredRequests}
                onRowClick={(data) => navigate(`/admin/passengers/${data.id}`)}
                tableHeaderBorderRadius={true}
                columns={[
                    {
                        name: "ФИО пассажира",
                        width: 375,
                        sortField: "fullName",
                        render: (passengers: IPassengerTypes) => (
                            <div className={styles.passenger}>
                                {" "}
                                <div className={styles.passengerIcon}>
                                    <IconHeart />
                                </div>{" "}
                                <Typo variant={"actionL"}> {passengers.fullName}</Typo>
                            </div>
                        ),
                    },
                    {
                        name: "Телефон",
                        borderRight: true,
                        width: 200,
                        render: (passengers: IPassengerTypes) => (
                            <Typo variant={"actionL"}>
                                {passengers?.phone && formatPhoneNumber(passengers.phone)}
                            </Typo>
                        ),
                    },
                    {
                        name: "Категория",
                        width: 385,
                        render: (passengers: IPassengerTypes) => (
                            <Typo variant={"actionL"}>
                                {
                                    healthArray.find((obj: any) => obj.value === passengers.groupId)
                                        ?.name
                                }
                            </Typo>
                        ),
                    },
                ]}
                loading={store.passengers.loader.loading}
                filterStore={store.passengers.filter}
            />
        </AdminPageContentLayout>
    );
});
