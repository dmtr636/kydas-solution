import styles from "./RequestForm.module.scss";
import { observer } from "mobx-react-lite";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import { ReactNode, useState } from "react";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { Tab, Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import { Person } from "src/ui/components/solutions/Person/Person.tsx";
import { Select } from "src/ui/components/inputs/Select/Select.tsx";
import {
    IconAttention,
    IconError,
    IconMan,
    IconPlay,
    IconPlus,
    IconSuccess,
    IconWoman,
} from "src/ui/assets/icons";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { PhoneInput } from "src/ui/components/inputs/PhoneInput/PhoneInput.tsx";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import stationsWithIcons from "src/features/request/stationsWithIcons.tsx";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { RadioButton } from "src/ui/components/controls/RadioButton/RadioButton.tsx";
import { RadioGroup } from "src/ui/components/controls/RadioGroup/RadioGroup.tsx";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import healthArray from "src/features/request/healthArray.ts";
import { intRange } from "src/ui/utils/intRange.ts";
import { IPassengerTypes } from "src/features/admin/passengers/utils/passengerTypes.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";

const getTabs = () => {
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
    ];
    tabs.push({
        name: "Инспекторы",
        value: "staff",
    });
    return tabs;
};

export const RequestForm = observer((props: { type: "add" | "edit" }) => {
    const tabs = getTabs();
    const request = store.request.request;
    const form = store.request.requestForm;
    const [tab, setTab] = useState(tabs[0].value);
    const [showCancelOverlay, setShowCancelOverlay] = useState(false);
    const navigate = useNavigate();
    const [addedSecondaryPhone, setAddedSecondaryPhone] = useState(false);
    const location = useLocation();

    const renderBlock = (
        block: (request: IRequest, form: IRequest) => ReactNode,
        height: number,
    ) => {
        if (props.type === "add" && form) {
            return block(form, form);
        }
        if (!request || !form) {
            return <Skeleton height={height} width={"100%"} />;
        }
        return block(request, form);
    };

    const renderGroup = (
        groupTabName: string,
        groupContent: (request: IRequest, form: IRequest) => ReactNode,
    ) => {
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

    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <div className={styles.titleRow}>
                    {renderBlock(
                        (request, form) => (
                            <>
                                {props.type === "add" && <Typo variant={"h4"}>Новая заявка</Typo>}
                                {props.type === "edit" && (
                                    <Typo variant={"h4"}>Заявка M-{request?.number}</Typo>
                                )}
                                {props.type === "edit" && (
                                    <div style={{ width: 260 }}>
                                        <Select
                                            options={[
                                                {
                                                    name: "Принята",
                                                    value: "CONFIRMED",
                                                    listItemIcon: <IconPlay />,
                                                },
                                                {
                                                    name: "Не подтверждена",
                                                    value: "NEW",
                                                    listItemIcon: <IconAttention />,
                                                },
                                                {
                                                    name: "Завершена",
                                                    value: "COMPLETED",
                                                    listItemIcon: <IconSuccess />,
                                                },
                                                {
                                                    name: "Отменена",
                                                    value: "CANCELED",
                                                    listItemIcon: <IconError />,
                                                },
                                            ]}
                                            value={form.status}
                                            onValueChange={(value) => {
                                                form.status = value as IRequest["status"];
                                                if (value === "CANCELED") {
                                                    setShowCancelOverlay(true);
                                                }
                                            }}
                                            disableClear
                                        />
                                    </div>
                                )}
                            </>
                        ),
                        36,
                    )}
                </div>
                <Tabs tabs={tabs} value={tab} onChange={setTab} />
            </div>
            {renderGroup("Пассажир", (_request, form) => (
                <div className={styles.subgroups}>
                    <Autocomplete
                        formName={"ФИО"}
                        required={true}
                        size={"large"}
                        disabled={new URLSearchParams(location.search).has("passengerId")}
                        onValueChange={(value) => {
                            form.passengerId = value;
                            const passenger = store.passengers.requests.find((p) => p.id === value);
                            if (passenger) {
                                form.info.fullName = passenger.fullName;
                                form.info.phone = passenger.phone;
                                form.info.phoneDescription = passenger.phoneDescription;
                                form.info.phoneSecondary = passenger.phoneSecondary;
                                form.info.phoneSecondaryDescription =
                                    passenger.phoneSecondaryDescription;
                                form.info.sex = passenger.sex;
                                form.info.groupId = passenger.groupId;
                                form.info.pacemaker = passenger.pacemaker;
                                form.info.comment = passenger.comment;
                                form.info.age = passenger.age;
                            } else {
                                form.info = {
                                    phone: "",
                                    hasBaggage: false,
                                    wheelchairRequired: false,
                                    meetingPoint: "У входных дверей",
                                } as IRequest["info"];
                            }
                        }}
                        options={store.passengers.requests.map((p) => ({
                            name: p.fullName,
                            value: p.id,
                        }))}
                        value={form.passengerId}
                        placeholder={"Введите имя пассажира"}
                        addButtonLabel={"Добавить пассажира"}
                        onAddButtonClick={async (inputValue) => {
                            const passengerResponse = await store.passengers.createRequest({
                                fullName: inputValue,
                                phone: "",
                            } as IPassengerTypes);
                            if (passengerResponse.status) {
                                form.passengerId = passengerResponse.data.id;
                                form.info.fullName = passengerResponse.data.fullName;
                            }
                        }}
                    />
                    <div
                        className={styles.infoRow}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "248px 1fr",
                            gap: "16px",
                        }}
                    >
                        <PhoneInput
                            formName={"Телефон"}
                            required={true}
                            size={"large"}
                            onChange={(value) => {
                                form.info.phone = value;
                                if (!form.passengerId && value.length === 12) {
                                    const passenger = store.passengers.requests.find(
                                        (p) => p.phone === value,
                                    );
                                    if (passenger) {
                                        form.passengerId = passenger.id;
                                        form.info.fullName = passenger.fullName;
                                        form.info.phone = passenger.phone;
                                        form.info.phoneDescription = passenger.phoneDescription;
                                        form.info.phoneSecondary = passenger.phoneSecondary;
                                        form.info.phoneSecondaryDescription =
                                            passenger.phoneSecondaryDescription;
                                        form.info.sex = passenger.sex;
                                        form.info.groupId = passenger.groupId;
                                        form.info.pacemaker = passenger.pacemaker;
                                        form.info.comment = passenger.comment;
                                        form.info.age = passenger.age;
                                        snackbarStore.showPositiveSnackbar(
                                            "Данные заполнены автоматически",
                                            {
                                                actionButtonLabel: "Отменить",
                                                onActionButtonClick: () => {
                                                    form.passengerId = null;
                                                    form.info = {
                                                        phone: "",
                                                        hasBaggage: false,
                                                        wheelchairRequired: false,
                                                        meetingPoint: "У входных дверей",
                                                    } as IRequest["info"];
                                                },
                                                showCloseButton: true,
                                            },
                                        );
                                    }
                                }
                            }}
                            value={form.info.phone}
                        />
                        <Input
                            formName={"Описание"}
                            size={"large"}
                            onChange={(event) => {
                                form.info.phoneDescription = event.target.value;
                            }}
                            value={form.info.phoneDescription ?? ""}
                            placeholder={"Добавить комментарий"}
                        />
                        {!addedSecondaryPhone && !form.info.phoneSecondary ? (
                            <Button
                                iconBefore={<IconPlus />}
                                type={"outlined"}
                                onClick={() => setAddedSecondaryPhone(true)}
                            >
                                Добавить ещё телефон
                            </Button>
                        ) : (
                            <>
                                <PhoneInput
                                    formName={"Дополнительный телефон"}
                                    size={"large"}
                                    onChange={(value) => (form.info.phoneSecondary = value)}
                                    value={form.info.phoneSecondary ?? ""}
                                />
                                <Input
                                    formName={"Описание"}
                                    size={"large"}
                                    onChange={(event) => {
                                        form.info.phoneSecondaryDescription = event.target.value;
                                    }}
                                    value={form.info.phoneSecondaryDescription ?? ""}
                                    placeholder={"Добавить комментарий"}
                                />
                            </>
                        )}
                    </div>
                    <div className={styles.infoRow}>
                        <div style={{ width: 214 }}>
                            <Select
                                formName={"Пол"}
                                required={true}
                                placeholder={"Выбрать"}
                                size={"large"}
                                value={form.info.sex}
                                onValueChange={(v) => (form.info.sex = v)}
                                options={[
                                    { name: "Мужской", value: "male" },
                                    { name: "Женский", value: "female" },
                                ]}
                                disableClear={true}
                            />
                        </div>
                        <Input
                            formName={"Возраст"}
                            size={"large"}
                            onChange={(event) => {
                                if (!event.target.value) {
                                    form.info.age = null;
                                } else if (!isNaN(Number(event.target.value))) {
                                    form.info.age = Number(event.target.value);
                                }
                            }}
                            value={form.info.age ?? ""}
                            required={true}
                            placeholder={"Полные года"}
                        />
                    </div>
                </div>
            ))}
            {renderGroup("Категория и ЭКС", (_request, form) => (
                <div className={styles.subgroups}>
                    <div style={{ width: 478 }}>
                        <Select<number>
                            formName={"Категория пассажира"}
                            options={healthArray}
                            required={true}
                            placeholder={"Выберите категорию пассажира"}
                            size={"large"}
                            value={form.info.groupId}
                            onValueChange={(v) => (form.info.groupId = v)}
                            disableClear={true}
                        />
                    </div>

                    {(form.info.groupId === 4 ||
                        form.info.groupId === 6 ||
                        form.info.groupId === 9) && (
                        <div style={{ width: 704 }}>
                            <TextArea
                                formName={"Описание коляски"}
                                size={"large"}
                                value={form.info.strollerDescription}
                                height={160}
                                placeholder={
                                    "Количество, тип, вес, цвет, габаритные размеры (длина, ширина, высота) коляски"
                                }
                                onChange={(event) =>
                                    (form.info.strollerDescription = event.target.value)
                                }
                            />
                        </div>
                    )}

                    <div>
                        <Typo variant={"subheadXL"} className={styles.infoLabel}>
                            Наличие ЭКС
                        </Typo>
                        <RadioGroup
                            value={form.info.pacemaker ? "true" : "false"}
                            onChange={(value) => (form.info.pacemaker = value === "true")}
                        >
                            <div style={{ display: "grid", rowGap: 16 }}>
                                <RadioButton
                                    color={"accent"}
                                    value={"false"}
                                    title={"Отсутствует"}
                                />
                                <RadioButton color={"accent"} value={"true"} title={"Имеется"} />
                            </div>
                        </RadioGroup>
                    </div>
                </div>
            ))}
            {renderGroup("Маршрут и дата поездки", (_request, form) => (
                <div className={styles.infoRow}>
                    <div className={styles.infoColumn} style={{ width: 564 }}>
                        <Autocomplete
                            required={true}
                            size={"large"}
                            placeholder={"Введите название станции"}
                            multiple={false}
                            formName={"Станция отправления"}
                            options={stationsWithIcons}
                            value={form.info.departureStationId}
                            onValueChange={(value) =>
                                (form.info.departureStationId = value as number)
                            }
                        />
                        <Autocomplete
                            required={true}
                            size={"large"}
                            placeholder={"Введите название станции"}
                            multiple={false}
                            formName={"Станция прибытия"}
                            options={stationsWithIcons}
                            value={form.info.arrivalStationId}
                            onValueChange={(value) =>
                                (form.info.arrivalStationId = value as number)
                            }
                        />
                    </div>
                    <DatePicker
                        required={true}
                        size={"large"}
                        formName={"Дата и время поездки"}
                        placeholder={"Выберите дату поездки"}
                        value={form.info.tripDate}
                        onChange={(value) => (form.info.tripDate = value as string)}
                        startYear={2000}
                        endYear={2030}
                        disableClear={true}
                    />
                </div>
            ))}
            {renderGroup("Детали поездки", (_request, form) => (
                <div className={styles.subgroups}>
                    <div className={styles.infoRow}>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Место встречи с инспектором
                            </Typo>
                            <div>
                                <RadioGroup
                                    value={form.info.meetingPoint}
                                    onChange={(value) => (form.info.meetingPoint = value)}
                                >
                                    <div
                                        style={{
                                            display: "grid",
                                            rowGap: 16,
                                            columnGap: 32,
                                            gridTemplateColumns: "auto auto",
                                        }}
                                    >
                                        <RadioButton
                                            color={"accent"}
                                            value={"У входных дверей"}
                                            title={"У входных дверей"}
                                        />
                                        <RadioButton
                                            color={"accent"}
                                            value={"В вестибюле"}
                                            title={"В вестибюле"}
                                        />
                                        <RadioButton
                                            color={"accent"}
                                            value={"У турникетов"}
                                            title={"У турникетов"}
                                        />
                                        <RadioButton
                                            color={"accent"}
                                            value={"На платформе, в центре зала"}
                                            title={"На платформе, в центре зала"}
                                        />
                                    </div>
                                </RadioGroup>
                            </div>
                        </div>
                        <div className={styles.divider} />
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Предоставление кресло-коляски
                            </Typo>
                            <RadioGroup
                                value={form.info.wheelchairRequired ? "true" : "false"}
                                onChange={(value) =>
                                    (form.info.wheelchairRequired = value === "true")
                                }
                            >
                                <div style={{ display: "grid", rowGap: 16 }}>
                                    <RadioButton
                                        color={"accent"}
                                        value={"false"}
                                        title={"Не требуется"}
                                    />
                                    <RadioButton
                                        color={"accent"}
                                        value={"true"}
                                        title={"Требуется"}
                                    />
                                </div>
                            </RadioGroup>
                        </div>
                    </div>
                    <div style={{ width: 704 }}>
                        <TextArea
                            formName={"Дополнительные сведения"}
                            size={"large"}
                            value={form.info.comment}
                            onChange={(event) => (form.info.comment = event.target.value)}
                            height={160}
                            placeholder={
                                "Описание места встречи. Внешние идентификационные признаки, наличие трости, очков, одежда, предметы и т.д."
                            }
                        />
                    </div>
                </div>
            ))}
            {renderGroup("Багаж", (_request, form) => (
                <div className={styles.subgroups}>
                    <div className={styles.infoRow}>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                Наличие
                            </Typo>
                            <RadioGroup
                                value={form.info.hasBaggage ? "true" : "false"}
                                onChange={(value) => (form.info.hasBaggage = value === "true")}
                            >
                                <div style={{ display: "grid", rowGap: 16 }}>
                                    <RadioButton
                                        color={"accent"}
                                        value={"false"}
                                        title={"Отсутствует"}
                                    />
                                    <RadioButton
                                        color={"accent"}
                                        value={"true"}
                                        title={"Имеется"}
                                    />
                                </div>
                            </RadioGroup>
                        </div>
                        {form.info.hasBaggage && (
                            <>
                                <div className={styles.divider} />
                                <div>
                                    <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                        Требуется помощь
                                    </Typo>
                                    <RadioGroup
                                        value={form.info.baggageHelpRequired ? "true" : "false"}
                                        onChange={(value) =>
                                            (form.info.baggageHelpRequired = value === "true")
                                        }
                                    >
                                        <div style={{ display: "grid", rowGap: 16 }}>
                                            <RadioButton
                                                color={"accent"}
                                                value={"false"}
                                                title={"Нет"}
                                            />
                                            <RadioButton
                                                color={"accent"}
                                                value={"true"}
                                                title={"Да"}
                                            />
                                        </div>
                                    </RadioGroup>
                                </div>
                            </>
                        )}
                    </div>

                    {form.info.hasBaggage && (
                        <div className={styles.subgroups}>
                            <div>
                                <Typo variant={"subheadXL"} className={styles.infoLabel}>
                                    Тип груза
                                </Typo>
                                <div style={{ display: "grid", gap: 16 }}>
                                    <Checkbox
                                        color={"accent"}
                                        onChange={(checked) => (form.info.lightBaggage = checked)}
                                        checked={form.info.lightBaggage ?? false}
                                        title={"Лёгкий груз (Лёгкий груз (рюкзак, пакет и т. д.)"}
                                    />
                                    <Checkbox
                                        color={"accent"}
                                        onChange={(checked) => (form.info.mediumBaggage = checked)}
                                        checked={form.info.mediumBaggage ?? false}
                                        title={"Средний груз (чемодан, сумка т. д.)"}
                                    />
                                    <Checkbox
                                        color={"accent"}
                                        onChange={() => {}}
                                        checked={!!form.info.baggageDescription}
                                        title={"Другое"}
                                    />
                                </div>
                                <div style={{ width: 396, marginTop: 12 }}>
                                    <Input
                                        onChange={(event) => {
                                            form.info.baggageDescription = event.target.value;
                                        }}
                                        value={form.info.baggageDescription}
                                        size={"large"}
                                        placeholder={"Описание груза"}
                                    />
                                </div>
                            </div>
                            <div style={{ width: 300 }}>
                                <TextArea
                                    formName={"Объём багажа"}
                                    size={"large"}
                                    value={form.info.baggageWeight}
                                    height={52}
                                    onChange={(event) =>
                                        (form.info.baggageWeight = event.target.value)
                                    }
                                    placeholder={"Приблизительный вес груза"}
                                />
                            </div>
                        </div>
                    )}
                </div>
            ))}
            {renderGroup("Инспекторы", (_request, form) => (
                <div className={styles.inspectorContainer}>
                    <Button
                        type={"outlined"}
                        onClick={() => {
                            form.inspectorMaleCount = 0;
                            form.inspectorFemaleCount = 0;
                            if (form.info.hasBaggage && form.info.baggageHelpRequired) {
                                if (form.info.mediumBaggage) {
                                    form.inspectorMaleCount = (form.inspectorMaleCount ?? 0) + 2;
                                } else if (form.info.lightBaggage) {
                                    form.inspectorMaleCount = (form.inspectorMaleCount ?? 0) + 1;
                                }
                            }
                            if (form.info.groupId) {
                                if ([1, 2, 3, 5, 7, 8, 9, 10, 12].includes(form.info.groupId)) {
                                    form.inspectorFemaleCount =
                                        (form.inspectorFemaleCount ?? 0) + 1;
                                } else {
                                    form.inspectorMaleCount = (form.inspectorMaleCount ?? 0) + 2;
                                }
                            }
                            if (!form.inspectorMaleCount && !form.inspectorFemaleCount) {
                                form.inspectorMaleCount = (form.inspectorMaleCount ?? 0) + 1;
                            }
                        }}
                    >
                        Заполнить автоматически
                    </Button>

                    <div className={styles.inspectorsCard}>
                        {!form.inspectorMaleCount && !form.inspectorFemaleCount && (
                            <Typo
                                variant={"actionL"}
                                style={{ color: "var(--color-components-text-neutral-secondary)" }}
                                className={styles.inspectorsListItem}
                            >
                                Выставите необходимое количество сотрудников или заполните
                                автоматически
                            </Typo>
                        )}

                        <div className={styles.inspectorsList}>
                            {intRange(0, form.inspectorMaleCount ?? 0).map((i) => (
                                <>
                                    <div className={styles.inspectorsListItem} key={i}>
                                        <Person
                                            fullName={"Мужчина"}
                                            icon={<IconMan />}
                                            onDelete={() => {
                                                form.inspectorMaleCount =
                                                    (form.inspectorMaleCount ?? 1) - 1;
                                            }}
                                        />
                                    </div>
                                    <div className={styles.dividerHorizontal} />
                                </>
                            ))}
                            {intRange(0, form.inspectorFemaleCount ?? 0).map((i) => (
                                <>
                                    <div className={styles.inspectorsListItem} key={i}>
                                        <Person
                                            fullName={"Женщина"}
                                            icon={<IconWoman />}
                                            onDelete={() => {
                                                form.inspectorFemaleCount =
                                                    (form.inspectorFemaleCount ?? 1) - 1;
                                            }}
                                        />
                                    </div>
                                    <div className={styles.dividerHorizontal} />
                                </>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <Button
                                type={"secondary"}
                                iconBefore={<IconPlus />}
                                onClick={() => {
                                    form.inspectorMaleCount = (form.inspectorMaleCount ?? 0) + 1;
                                }}
                            >
                                Добавить мужчину
                            </Button>
                            <Button
                                type={"secondary"}
                                iconBefore={<IconPlus />}
                                onClick={() => {
                                    form.inspectorFemaleCount =
                                        (form.inspectorFemaleCount ?? 0) + 1;
                                }}
                            >
                                Добавить женщину
                            </Button>
                        </div>
                    </div>
                </div>
            ))}

            <Overlay
                open={showCancelOverlay}
                onClose={() => {
                    setShowCancelOverlay(false);
                    if (form && request) {
                        form.status = request.status;
                        form.cancelReason = request.cancelReason;
                    }
                }}
                title={"Причина отмены заявки"}
                actions={[
                    <Button
                        key={"cancel"}
                        onClick={async () => {
                            if (form) {
                                const result = await store.request.cancelRequest(form);
                                if (result.status) {
                                    navigate(`/admin/requests/${result.data.id}`, {
                                        replace: true,
                                    });
                                    if (store.request.request) {
                                        store.request.updateRequest(
                                            {
                                                ...store.request.request,
                                                lockedEdit: null,
                                            },
                                            false,
                                        );
                                    }
                                }
                            }
                        }}
                        disabled={!form?.cancelReason}
                    >
                        Отменить заявку
                    </Button>,
                    <Button
                        key={"close"}
                        type={"secondary"}
                        onClick={() => {
                            setShowCancelOverlay(false);
                            if (form && request) {
                                form.status = request.status;
                                form.cancelReason = request.cancelReason;
                            }
                        }}
                    >
                        Закрыть
                    </Button>,
                ]}
            >
                <div style={{ width: 360 }}>
                    <TextArea
                        height={230}
                        value={form?.cancelReason}
                        onChange={(event) => {
                            form && (form.cancelReason = event.target.value);
                        }}
                        size={"large"}
                        placeholder={"Опишите причину отмены заявки в свободной форме"}
                    />
                </div>
            </Overlay>
        </div>
    );
});
