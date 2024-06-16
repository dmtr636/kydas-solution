import styles from "./PassengerInfo.module.scss";
import { observer } from "mobx-react-lite";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import { useState } from "react";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { Tab, Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { formatDate, formatTime } from "src/shared/utils/date.ts";
import { RequestStatus } from "src/features/admin/requests/components/RequestStatus/RequestStatus.tsx";
import { TripRoute } from "src/features/admin/requests/components/TripRoute/TripRoute.tsx";
import { useNavigate } from "react-router-dom";
import { RequestAssignedEmployees } from "src/features/admin/requests/components/RequestAssignedEmployees/RequestAssignedEmployees.tsx";
import healthArray from "src/features/request/healthArray.ts";
import { getHealthGroupById } from "src/features/admin/requests/utils/healthArray.ts";
import { clsx } from "clsx";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import { IconHeart } from "src/ui/assets/icons";
import { formatPhoneNumber } from "src/shared/utils/phone.ts";

const tabs: Tab[] = [
    {
        name: "Основная информация",
        value: "info",
    },
    {
        name: "Заявки",
        value: "requests",
    },
];

function getAgeString(age: number): string {
    const lastDigit = age % 10;
    const lastTwoDigits = age % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
        return `${age} лет`;
    }

    switch (lastDigit) {
        case 1:
            return `${age} год`;
        case 2:
        case 3:
        case 4:
            return `${age} года`;
        default:
            return `${age} лет`;
    }
}

export const PassengerInfo = observer(() => {
    const passenger: any = store.passengers.request;
    const [tab, setTab] = useState(tabs[0].value);
    const navigate = useNavigate();

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    {passenger ? (
                        <>
                            <div className={styles.avatar}>
                                <IconHeart />
                            </div>
                            <div className={styles.employeeInfoCol}>
                                <Typo variant={"actionXL"}>{passenger.fullName} </Typo>
                                {healthArray.find((i) => i.value === passenger.groupId)?.name}
                            </div>
                        </>
                    ) : (
                        <Skeleton height={80} width={"100%"} />
                    )}
                </div>
                <Tabs tabs={tabs} value={tab} onChange={setTab} />
            </div>

            {tab === "info" && (
                <div className={styles.params}>
                    <div className={styles.bio}>
                        <div className={styles.paramsText}>
                            <Typo variant={"h5"}>Личные данные</Typo>
                        </div>
                        <div className={styles.bioInfo}>
                            <div className={styles.bioInfoItem} style={{ width: "368px" }}>
                                <div className={styles.bioInfoHead}>ФИО</div>
                                <div className={styles.bioInfoSubHead}>{passenger?.fullName}</div>
                            </div>
                            <div className={styles.bioInfoItem} style={{ width: "132px" }}>
                                <div className={styles.bioInfoHead}>Пол</div>
                                <div className={styles.bioInfoSubHead}>
                                    {passenger?.sex === "male" ? "Мужчина" : "Женщина"}
                                </div>
                            </div>
                            <div className={styles.bioInfoItem}>
                                <div className={styles.bioInfoHead}>Возраст</div>
                                <div className={styles.bioInfoSubHead}>
                                    {getAgeString(Number(passenger?.age))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.bioInfo} style={{ marginBottom: 0 }}>
                            <div
                                className={styles.bioInfoItem}
                                style={{ paddingLeft: "0", width: "368px" }}
                            >
                                <div className={styles.bioInfoHead}>Категория</div>
                                <div className={styles.bioInfoSubHead}>
                                    {passenger && getHealthGroupById(passenger.groupId)?.name}
                                </div>
                            </div>
                            <div className={styles.bioInfoItem}>
                                <div className={styles.bioInfoHead}>Наличие ЭКС</div>
                                <div className={styles.bioInfoSubHead}>
                                    {passenger?.pacemaker ? "Имеется" : "Отсутствует"}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.bio}>
                        <div className={styles.head}>
                            <Typo variant={"h5"}>Контактные данные</Typo>
                        </div>
                        <div className={styles.contactArray}>
                            <div
                                className={styles.bioInfoItem}
                                style={{ width: "368px", borderRight: "none" }}
                            >
                                <div className={styles.bioInfoHead}>Телефон (основной)</div>
                                <div className={styles.bioInfoSubHead}>
                                    {passenger?.phone && formatPhoneNumber(passenger.phone)}
                                </div>
                                {passenger?.phoneDescription && (
                                    <div className={styles.descriptionPhone}>
                                        {passenger?.phoneDescription}
                                    </div>
                                )}
                            </div>
                            {passenger?.phoneSecondary && (
                                <div className={clsx(styles.bioInfoItem, styles.borderleft)}>
                                    <div className={styles.bioInfoHead}>
                                        Телефон (дополнительный)
                                    </div>
                                    <div className={styles.bioInfoSubHead}>
                                        {formatPhoneNumber(passenger?.phoneSecondary)}
                                    </div>
                                    {passenger?.phoneDescription && (
                                        <div className={styles.descriptionPhone}>
                                            {passenger?.phoneSecondaryDescription}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className={styles.lastblock}>
                        <div className={styles.paramsText}>
                            <Typo variant={"h5"}>Личные данные</Typo>
                        </div>
                        <div className={styles.textarea}>
                            <TextArea height={224} readonly={true} value={passenger?.comment} />
                        </div>
                    </div>
                </div>
            )}

            {tab === "requests" && (
                <Table
                    data={store.request
                        .sortRequests(store.request.requests.slice())
                        .filter((r) => r.passengerId === passenger?.id)}
                    onRowClick={(data) => navigate(`/admin/requests/${data.id}`)}
                    columns={[
                        {
                            name: "№ Заявки",
                            width: 153,
                            render: (request) => (
                                <Typo variant={"actionL"}>M-{request.number}</Typo>
                            ),
                            sortField: "number",
                        },
                        {
                            name: "Дата",
                            width: 104,
                            render: (request) => (
                                <div className={styles.dateField}>
                                    <Typo variant={"actionL"}>
                                        {formatDate(request.info.tripDate)}
                                    </Typo>
                                    <Typo variant={"actionL"} className={styles.time}>
                                        {formatTime(request.info.tripDate)}
                                    </Typo>
                                </div>
                            ),
                            sortField: "tripDate",
                        },
                        {
                            name: "Статус",
                            width: 213,
                            render: (request) => <RequestStatus request={request} />,
                            sortField: "status",
                        },
                        {
                            name: "Назначенные инспекторы",
                            width: 226,
                            render: (request) => <RequestAssignedEmployees request={request} />,
                        },
                        {
                            name: "Маршрут",
                            width: 242,
                            render: (request) => (
                                <TripRoute
                                    arrivalStationId={request.info.arrivalStationId}
                                    departureStationId={request.info.departureStationId}
                                />
                            ),
                        },
                    ]}
                    filterStore={store.request.filter}
                    loading={store.request.loader.loading || store.employee.loader.loading}
                    card={false}
                />
            )}
        </div>
    );
});
