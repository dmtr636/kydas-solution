import styles from "./RequestInfo.module.scss";
import { observer } from "mobx-react-lite";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import { RequestStatus } from "src/features/admin/requests/components/RequestStatus/RequestStatus.tsx";
import { ReactNode, useState } from "react";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { Tab, Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import { getLineIcon, getStationById } from "src/features/admin/requests/utils/stations.tsx";
import { clsx } from "clsx";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import { getHealthGroupById } from "src/features/admin/requests/utils/healthArray.ts";
import { Person } from "src/ui/components/solutions/Person/Person.tsx";
import { formatPhoneNumber } from "src/shared/utils/phone.ts";
import { Status } from "src/ui/components/info/Status/Status.tsx";
import { convoyStatuses } from "src/features/admin/requests/constants/convoyStatuses.ts";
import { Link } from "src/ui/components/controls/Link/Link.tsx";
import { intRange } from "src/ui/utils/intRange.ts";
import {
    IconMan,
    IconTransfer,
    IconTransferEnd,
    IconTransferWrap,
    IconTransferWrapContinue,
    IconWoman,
} from "src/ui/assets/icons";
import { timeToText } from "src/shared/utils/time.ts";
import { formatTime, localizeYears } from "src/shared/utils/date.ts";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { useNavigate } from "react-router-dom";

const tabs: Tab[] = [
    {
        name: "Все",
        value: "all",
    },
    {
        name: "Пассажир",
        value: "client",
    },
    {
        name: "Категория и ЭКС",
        value: "group",
    },
    {
        name: "Маршрут и дата поездки",
        value: "trip",
    },
    {
        name: "Детали поездки",
        value: "tripDetail",
    },
    {
        name: "Багаж",
        value: "baggage",
    },
    {
        name: "Инспекторы",
        value: "staff",
    },
];

export const RequestInfo = observer(() => {
    const request = store.request.request;
    const [tab, setTab] = useState(tabs[0].value);
    const navigate = useNavigate();

    const renderBlock = (block: (request: IRequest) => ReactNode, height: number) => {
        if (!request) {
            return <Skeleton height={height} width={"100%"} />;
        }
        return block(request);
    };

    const renderGroup = (groupTabName: string, groupContent: (request: IRequest) => ReactNode) => {
        const groupTab = tabs.find((t) => t.name === groupTabName);
        if (groupTab?.value === tab || tab === "all") {
            return (
                <div className={styles.section}>
                    <Typo variant={"h5"} className={styles.sectionHeader}>
                        {groupTab?.name}
                    </Typo>
                    {renderBlock(groupContent, 51)}
                </div>
            );
        }
    };

    const getBaggageType = (request: IRequest) => {
        let description = "";
        if (request.info.lightBaggage) {
            description += "лёгкий груз, ";
        }
        if (request.info.mediumBaggage) {
            description += "средний груз, ";
        }
        if (request.info.baggageDescription) {
            description += "другое, ";
        }
        description =
            description.charAt(0).toUpperCase() + description.slice(1, description.length - 2);
        return description;
    };

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    {renderBlock(
                        (request) => (
                            <>
                                <Typo variant={"h4"}>Заявка M-{request?.number}</Typo>
                                <RequestStatus request={request} autoShowTooltip={true} />
                                {request.status === "CONFIRMED" &&
                                    request.convoyStatus &&
                                    request.convoyStatus !== "ACCEPTED" && (
                                        <Status mode={"accent"} size={"small"}>
                                            {
                                                convoyStatuses[
                                                    request.convoyStatus as keyof typeof convoyStatuses
                                                ]
                                            }
                                        </Status>
                                    )}
                                <div className={styles.source}>
                                    <Typo variant={"subheadM"} className={styles.sourceLabel}>
                                        Источник заявки
                                    </Typo>
                                    <Typo variant={"bodyM"}>
                                        {request.fromSite
                                            ? "Заявка поступила с сайта"
                                            : "Заявка составлена оператором"}
                                    </Typo>
                                </div>
                            </>
                        ),
                        36,
                    )}
                </div>
                <Tabs tabs={tabs} value={tab} onChange={setTab} />
            </div>
            {renderGroup("Пассажир", (request) => (
                <div className={styles.subgroupsL}>
                    <div className={styles.infoRow}>
                        <div style={{ width: 328 }}>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                ФИО
                            </Typo>
                            <Link
                                disableVisited={true}
                                size={"large"}
                                href={`/admin/passengers/${request.passengerId}`}
                                firstLine={request.info.fullName}
                            />
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Пол
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.sex === "male" ? "Мужской" : "Женский"}
                            </Typo>
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Возраст
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.age ? localizeYears(request.info.age) : "-"}
                            </Typo>
                        </div>
                    </div>
                    <div className={styles.infoRow}>
                        <div style={{ width: 328 }}>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Телефон (основной)
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {formatPhoneNumber(request.info.phone)}
                            </Typo>
                            {request.info.phoneDescription && (
                                <Typo variant={"bodyL"} className={styles.infoValueDescription}>
                                    {request.info.phoneDescription}
                                </Typo>
                            )}
                        </div>
                        {request.info.phoneSecondary && <div className={styles.divider} />}
                        {request.info.phoneSecondary && (
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Телефон (дополнительный)
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {formatPhoneNumber(request.info.phoneSecondary)}
                                </Typo>
                                {request.info.phoneSecondaryDescription && (
                                    <Typo variant={"bodyL"} className={styles.infoValueDescription}>
                                        {request.info.phoneSecondaryDescription}
                                    </Typo>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {renderGroup("Категория и ЭКС", (request) => (
                <div className={styles.subgroups}>
                    <div className={styles.infoRow}>
                        <div style={{ width: 334 }}>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Категория
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.groupId
                                    ? getHealthGroupById(request.info.groupId)?.name
                                    : "Категория не указана"}
                            </Typo>
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Наличие ЭКС
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.pacemaker ? "Имеется" : "Отсутствует"}
                            </Typo>
                        </div>
                    </div>
                    {(request.info.groupId === 1 || request.info.groupId === 5) && (
                        <div style={{ width: 704 }}>
                            <TextArea
                                formName={"Описание коляски"}
                                size={"large"}
                                value={request.info.strollerDescription}
                                height={160}
                                readonly
                                placeholder={"Описание отсутствует"}
                            />
                        </div>
                    )}
                </div>
            ))}
            {renderGroup("Маршрут и дата поездки", (request) => (
                <div className={styles.subgroupsL}>
                    <div className={styles.infoRow}>
                        <div className={styles.infoColumn} style={{ width: 485 }}>
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Станция отправления
                                </Typo>
                                <Typo
                                    variant={"bodyXL"}
                                    className={clsx(styles.infoValue, styles.stationInfo)}
                                >
                                    <div className={styles.stationIcon}>
                                        {getLineIcon(request.info.departureStationId)}
                                    </div>
                                    {getStationById(request.info.departureStationId)?.name}
                                </Typo>
                            </div>
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Станция прибытия
                                </Typo>
                                <Typo
                                    variant={"bodyXL"}
                                    className={clsx(styles.infoValue, styles.stationInfo)}
                                >
                                    <div className={styles.stationIcon}>
                                        {getLineIcon(request.info.arrivalStationId)}
                                    </div>
                                    {getStationById(request.info.arrivalStationId)?.name}
                                </Typo>
                            </div>
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <div className={styles.infoColumn}>
                                <div>
                                    <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                        Дата и время поездки
                                    </Typo>
                                    <Typo variant={"bodyXL"} className={styles.infoValue}>
                                        {new Date(request.info.tripDate).toLocaleDateString() +
                                            " / " +
                                            new Date(request.info.tripDate).toLocaleTimeString([], {
                                                timeStyle: "short",
                                            })}
                                    </Typo>
                                </div>
                                {request.info.tripDateEnd && (
                                    <div>
                                        <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                            Предварительное завершение
                                        </Typo>
                                        <Typo variant={"bodyXL"} className={styles.infoValue}>
                                            {new Date(
                                                request.info.tripDateEnd,
                                            ).toLocaleDateString() +
                                                " / " +
                                                new Date(
                                                    request.info.tripDateEnd,
                                                ).toLocaleTimeString([], {
                                                    timeStyle: "short",
                                                })}
                                        </Typo>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <Typo variant={"subheadXL"} className={styles.infoLabel}>
                            Маршрут сопровождения{" "}
                            {request.tripDuration && (
                                <span style={{ color: "var(--color-components-text-neutral)" }}>
                                    ({timeToText(request.tripDuration)})
                                </span>
                            )}
                        </Typo>
                        <div className={styles.routeContainer}>
                            <div className={styles.routeRow}>
                                <div className={styles.routeStation}>
                                    <div className={styles.routeStationFirstLine}>
                                        <Typo variant={"subheadM"}>1. Начало</Typo>
                                        <Typo
                                            variant={"subheadM"}
                                            style={{
                                                color: "var(--color-components-text-neutral)",
                                            }}
                                        >
                                            {formatTime(request.info.tripDate)}
                                        </Typo>
                                    </div>
                                    <div
                                        className={clsx(styles.routeStationSecondLine, {
                                            [styles.accent]: true,
                                        })}
                                    >
                                        {getLineIcon(request.info.departureStationId)}
                                        <Typo variant={"bodyXL"}>
                                            {getStationById(request.info.departureStationId).name}
                                        </Typo>
                                    </div>
                                </div>
                                {request.route.length > 2 && (
                                    <>
                                        <div className={styles.transferIcon}>
                                            <IconTransfer />
                                        </div>
                                        <div className={styles.routeStation}>
                                            <div className={styles.routeStationFirstLine}>
                                                <Typo variant={"subheadM"}>2. Пересадка</Typo>
                                                <Typo
                                                    variant={"subheadM"}
                                                    style={{
                                                        color: "var(--color-components-text-neutral)",
                                                    }}
                                                >
                                                    {request.routeTransferTime[0] || 1} мин.
                                                </Typo>
                                            </div>
                                            <div
                                                className={clsx(styles.routeStationSecondLine, {
                                                    [styles.accent]: false,
                                                })}
                                            >
                                                {getLineIcon(request.route[1])}
                                                <Typo variant={"bodyXL"}>
                                                    {getStationById(request.route[1]).name}
                                                </Typo>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {request.route.length > 3 && (
                                    <>
                                        <div className={styles.transferIcon}>
                                            <IconTransfer />
                                        </div>
                                        <div className={styles.routeStation}>
                                            <div className={styles.routeStationFirstLine}>
                                                <Typo variant={"subheadM"}>3. Пересадка</Typo>
                                                <Typo
                                                    variant={"subheadM"}
                                                    style={{
                                                        color: "var(--color-components-text-neutral)",
                                                    }}
                                                >
                                                    {request.routeTransferTime[1] || 1} мин.
                                                </Typo>
                                            </div>
                                            <div
                                                className={clsx(styles.routeStationSecondLine, {
                                                    [styles.accent]: false,
                                                })}
                                            >
                                                {getLineIcon(request.route[2])}
                                                <Typo variant={"bodyXL"}>
                                                    {getStationById(request.route[2]).name}
                                                </Typo>
                                            </div>
                                        </div>
                                        <div className={styles.transferIcon}>
                                            <IconTransferWrap />
                                        </div>
                                    </>
                                )}
                                {request.route.length === 2 && (
                                    <>
                                        <div className={styles.transferIcon}>
                                            <IconTransferEnd />
                                        </div>
                                        <div className={styles.routeStation}>
                                            <div className={styles.routeStationFirstLine}>
                                                <Typo variant={"subheadM"}>2. Завершение</Typo>
                                                <Typo
                                                    variant={"subheadM"}
                                                    style={{
                                                        color: "var(--color-components-text-neutral)",
                                                    }}
                                                >
                                                    {formatTime(request.info.tripDateEnd)}
                                                </Typo>
                                            </div>
                                            <div
                                                className={clsx(styles.routeStationSecondLine, {
                                                    [styles.accent]: true,
                                                })}
                                            >
                                                {getLineIcon(request.info.arrivalStationId)}
                                                <Typo variant={"bodyXL"}>
                                                    {
                                                        getStationById(
                                                            request.info.arrivalStationId,
                                                        ).name
                                                    }
                                                </Typo>
                                            </div>
                                        </div>
                                    </>
                                )}
                                {request.route.length === 3 && (
                                    <>
                                        <div className={styles.transferIcon}>
                                            <IconTransferEnd />
                                        </div>
                                        <div className={styles.routeStation}>
                                            <div className={styles.routeStationFirstLine}>
                                                <Typo variant={"subheadM"}>3. Завершение</Typo>
                                                <Typo
                                                    variant={"subheadM"}
                                                    style={{
                                                        color: "var(--color-components-text-neutral)",
                                                    }}
                                                >
                                                    {formatTime(request.info.tripDateEnd)}
                                                </Typo>
                                            </div>
                                            <div
                                                className={clsx(styles.routeStationSecondLine, {
                                                    [styles.accent]: true,
                                                })}
                                            >
                                                {getLineIcon(request.info.arrivalStationId)}
                                                <Typo variant={"bodyXL"}>
                                                    {
                                                        getStationById(
                                                            request.info.arrivalStationId,
                                                        ).name
                                                    }
                                                </Typo>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            {request.route.length > 3 && (
                                <>
                                    <div className={styles.dividerHorizontal} />
                                    <div className={styles.routeRow}>
                                        {request.route.length > 4 && (
                                            <>
                                                <div className={styles.transferIcon}>
                                                    <IconTransferWrapContinue />
                                                </div>
                                                <div className={styles.routeStation}>
                                                    <div className={styles.routeStationFirstLine}>
                                                        <Typo variant={"subheadM"}>
                                                            4. Пересадка
                                                        </Typo>
                                                        <Typo
                                                            variant={"subheadM"}
                                                            style={{
                                                                color: "var(--color-components-text-neutral)",
                                                            }}
                                                        >
                                                            {request.routeTransferTime[2] || 1} мин.
                                                        </Typo>
                                                    </div>
                                                    <div
                                                        className={clsx(
                                                            styles.routeStationSecondLine,
                                                            {
                                                                [styles.accent]: false,
                                                            },
                                                        )}
                                                    >
                                                        {getLineIcon(request.route[3])}
                                                        <Typo variant={"bodyXL"}>
                                                            {getStationById(request.route[3]).name}
                                                        </Typo>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {request.route.length > 5 && (
                                            <>
                                                <div className={styles.transferIcon}>
                                                    <IconTransfer />
                                                </div>
                                                <div className={styles.routeStation}>
                                                    <div className={styles.routeStationFirstLine}>
                                                        <Typo variant={"subheadM"}>
                                                            5. Пересадка
                                                        </Typo>
                                                        <Typo
                                                            variant={"subheadM"}
                                                            style={{
                                                                color: "var(--color-components-text-neutral)",
                                                            }}
                                                        >
                                                            {request.routeTransferTime[3] || 1} мин.
                                                        </Typo>
                                                    </div>
                                                    <div
                                                        className={clsx(
                                                            styles.routeStationSecondLine,
                                                            {
                                                                [styles.accent]: false,
                                                            },
                                                        )}
                                                    >
                                                        {getLineIcon(request.route[4])}
                                                        <Typo variant={"bodyXL"}>
                                                            {getStationById(request.route[4]).name}
                                                        </Typo>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        <div className={styles.transferIcon}>
                                            <IconTransferEnd />
                                        </div>
                                        <div className={styles.routeStation}>
                                            <div className={styles.routeStationFirstLine}>
                                                <Typo variant={"subheadM"}>
                                                    {request.route.length}. Завершение
                                                </Typo>
                                                <Typo
                                                    variant={"subheadM"}
                                                    style={{
                                                        color: "var(--color-components-text-neutral)",
                                                    }}
                                                >
                                                    {formatTime(request.info.tripDateEnd)}
                                                </Typo>
                                            </div>
                                            <div
                                                className={clsx(styles.routeStationSecondLine, {
                                                    [styles.accent]: true,
                                                })}
                                            >
                                                {getLineIcon(request.info.arrivalStationId)}
                                                <Typo variant={"bodyXL"}>
                                                    {
                                                        getStationById(
                                                            request.info.arrivalStationId,
                                                        ).name
                                                    }
                                                </Typo>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {renderGroup("Детали поездки", (request) => (
                <div className={styles.subgroups}>
                    <div className={styles.infoRow}>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Место встречи с инспектором
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.meetingPoint}
                            </Typo>
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Предоставление кресло-коляски
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.wheelchairRequired ? "Требуется" : "Не требуется"}
                            </Typo>
                        </div>
                    </div>
                    <div style={{ width: 704 }}>
                        <TextArea
                            formName={"Дополнительные сведения"}
                            size={"large"}
                            value={request.info.comment}
                            height={160}
                            readonly
                            placeholder={"Сведения отсутствуют"}
                        />
                    </div>
                </div>
            ))}
            {renderGroup("Багаж", (request) => (
                <div className={styles.subgroups}>
                    <div className={styles.infoRow}>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Наличие
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.hasBaggage ? "Имеется" : "Отсутствует"}
                            </Typo>
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Требуется помощь
                            </Typo>
                            <Typo variant={"bodyXL"} className={styles.infoValue}>
                                {request.info.baggageHelpRequired ? "Да" : "Нет"}
                            </Typo>
                        </div>
                    </div>
                    {request.info.hasBaggage && (
                        <div className={styles.infoRow}>
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Тип груза
                                </Typo>
                                <Typo variant={"bodyXL"} className={styles.infoValue}>
                                    {getBaggageType(request)}
                                </Typo>
                                <div style={{ width: 396, marginTop: 12 }}>
                                    <TextArea
                                        size={"large"}
                                        value={request.info.baggageDescription}
                                        readonly
                                        height={52}
                                        placeholder={"Описание отсутствует"}
                                    />
                                </div>
                            </div>
                            {request.info.hasBaggage && request.info.baggageWeight && (
                                <div className={styles.divider} />
                            )}
                            {request.info.hasBaggage && request.info.baggageWeight && (
                                <div>
                                    <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                        Объём багажа
                                    </Typo>
                                    <Typo variant={"bodyXL"}>Вес указан приблизительно</Typo>
                                    <div style={{ width: 300, marginTop: 12 }}>
                                        <TextArea
                                            size={"large"}
                                            value={request.info.baggageWeight}
                                            height={52}
                                            readonly
                                            placeholder={"Объём не указан"}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
            {renderGroup("Инспекторы", (request) => (
                <div className={styles.staffList}>
                    {request.assignedEmployees?.length ? (
                        request.assignedEmployees?.map((e) => (
                            <div className={styles.staffListItem} key={e.employeeId}>
                                <Typo variant={"actionL"}>
                                    {store.employee.findById(e.employeeId)?.area}
                                </Typo>
                                <Person
                                    fullName={getFullName(store.employee.findById(e.employeeId))}
                                    onClick={() => navigate(`/admin/employees/${e.employeeId}`)}
                                />
                            </div>
                        ))
                    ) : (
                        <>
                            {intRange(0, request.inspectorMaleCount ?? 0).map((i) => (
                                <Person key={i} fullName={"Мужчина"} icon={<IconMan />} />
                            ))}
                            {intRange(0, request.inspectorFemaleCount ?? 0).map((i) => (
                                <Person key={i} fullName={"Женщина"} icon={<IconWoman />} />
                            ))}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
});
