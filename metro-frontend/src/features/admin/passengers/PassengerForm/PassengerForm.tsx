import styles from "./PassengerForm.module.scss";
import { observer } from "mobx-react-lite";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import { ReactNode, useState } from "react";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { Tab } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import { Select } from "src/ui/components/inputs/Select/Select.tsx";
import { IconPlus } from "src/ui/assets/icons";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { PhoneInput } from "src/ui/components/inputs/PhoneInput/PhoneInput.tsx";

import { RadioButton } from "src/ui/components/controls/RadioButton/RadioButton.tsx";
import { RadioGroup } from "src/ui/components/controls/RadioGroup/RadioGroup.tsx";

import { Button } from "src/ui/components/controls/Button/Button.tsx";
import healthArray from "src/features/request/healthArray.ts";
import { IPassengerTypes } from "src/features/admin/passengers/utils/passengerTypes.ts";

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
            name: "Маршрут и дата поездки",
            value: "trip",
        },
        {
            name: "Детали поездки",
            value: "tripDetail",
        },
        {
            name: "Группа",
            value: "group",
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

export const PassengerForm = observer((props: { type: "add" | "edit" }) => {
    const tabs = getTabs();
    const request = store.passengers.request;
    const form = store.passengers.requestForm;
    const [tab, setTab] = useState("all");
    const [addedSecondaryPhone, setAddedSecondaryPhone] = useState(false);

    const renderBlock = (
        block: (request: IPassengerTypes, form: IPassengerTypes) => ReactNode,
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
        groupContent: (request: IPassengerTypes, form: IPassengerTypes) => ReactNode,
    ) => {
        const groupTab = tabs.find((t) => t.name === groupTabName);
        if (groupTab?.value === tab || tab === "all") {
            return <div className={styles.section}>{renderBlock(groupContent, 51)}</div>;
        }
    };

    return (
        <div className={styles.card}>
            {renderGroup("Пассажир", (_request, form) => (
                <div className={styles.subgroups}>
                    <div className={styles.headGroup}>
                        <Typo variant={"h5"}>Личные данные</Typo>
                    </div>
                    <div className={styles.inputs}>
                        <div style={{ width: 633 }}>
                            <Input
                                formName={"ФИО"}
                                required={true}
                                size={"large"}
                                onChange={(event) => (form.fullName = event.target.value)}
                                value={form.fullName}
                                placeholder={"Введите имя пассажира"}
                            />
                        </div>
                        <div style={{ width: 243 }}>
                            <Select
                                formName={"Пол"}
                                required={true}
                                placeholder={"Выбрать"}
                                size={"large"}
                                value={form.sex}
                                onValueChange={(v: "male" | "female" | null) => (form.sex = v)}
                                options={[
                                    { name: "Мужской", value: "male" },
                                    { name: "Женский", value: "female" },
                                ]}
                                disableClear={true}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                        <div style={{ width: 633 }}>
                            <Select<number>
                                options={healthArray}
                                required={true}
                                formName={"Категория"}
                                placeholder={"Выберите категорию пассажира"}
                                size={"large"}
                                value={form.groupId}
                                onValueChange={(v) => (form.groupId = v)}
                                disableClear={true}
                            />
                        </div>
                        <div style={{ width: 243 }}>
                            <Input
                                formName={"Возраст"}
                                required={true}
                                placeholder={"Полные года"}
                                size={"large"}
                                value={form.age}
                                onChange={(event) => {
                                    if (
                                        !isNaN(Number(event.target.value)) ||
                                        event.target.value === " "
                                    ) {
                                        form.age = Number(event.target.value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <Typo variant={"subheadXL"} className={styles.infoLabel}>
                            Наличие ЭКС
                        </Typo>
                        <RadioGroup
                            value={form.pacemaker ? "true" : "false"}
                            onChange={(value) => (form.pacemaker = value === "true")}
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

                    {/*<div
                        className={styles.infoRow}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "248px 1fr",
                            gap: "16px"
                        }}
                    >
                        <PhoneInput
                            formName={"Телефон"}
                            required={true}
                            size={"large"}
                            onChange={(value) => (form.phone = value)}
                            value={form.phone}
                        />
                        <Input
                            formName={"Описание"}
                            size={"large"}
                            onChange={(event) => {
                                form.phoneDescription = event.target.value;
                            }}
                            value={form.phoneDescription ?? ""}
                            placeholder={"Добавить комментарий"}
                        />
                        {!addedSecondaryPhone && !form.phoneSecondary ? (
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
                                    onChange={(value) => (form.phoneSecondary = value)}
                                    value={form.phoneSecondary ?? ""}
                                />
                                <Input
                                    formName={"Описание"}
                                    size={"large"}
                                    onChange={(event) => {
                                        form.phoneSecondaryDescription = event.target.value;
                                    }}
                                    value={form.phoneSecondaryDescription ?? ""}
                                    placeholder={"Добавить комментарий"}
                                />
                            </>
                        )}
                    </div>*/}
                    {/*<div className={styles.infoRow}>
                        <div style={{ width: 214 }}>
                            <Select
                                formName={"Пол"}
                                required={true}
                                placeholder={"Выбрать"}
                                size={"large"}
                                value={form.sex}
                                onValueChange={(v: "male" | "female" | null) => (form.sex = v)}
                                options={[
                                    { name: "Мужской", value: "male" },
                                    { name: "Женский", value: "female" }
                                ]}
                                disableClear={true}
                            />
                        </div>

                    </div>*/}
                </div>
            ))}
            {renderGroup("Группа", (_request, form) => (
                <div className={styles.subgroups}>
                    <div className={styles.headGroup}>
                        <Typo variant={"h5"}>Контактные данные</Typo>
                    </div>
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
                            onChange={(value) => (form.phone = value)}
                            value={form.phone}
                        />
                        <Input
                            formName={"Описание"}
                            size={"large"}
                            onChange={(event) => {
                                form.phoneDescription = event.target.value;
                            }}
                            value={form.phoneDescription ?? ""}
                            placeholder={"Добавить комментарий"}
                        />
                        {!addedSecondaryPhone && !form.phoneSecondary ? (
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
                                    onChange={(value) => (form.phoneSecondary = value)}
                                    value={form.phoneSecondary ?? ""}
                                />
                                <Input
                                    formName={"Описание"}
                                    size={"large"}
                                    onChange={(event) => {
                                        form.phoneSecondaryDescription = event.target.value;
                                    }}
                                    value={form.phoneSecondaryDescription ?? ""}
                                    placeholder={"Добавить комментарий"}
                                />
                            </>
                        )}
                    </div>
                </div>
            ))}
            {renderGroup("Группа", (_request, form) => (
                <div className={styles.subgroups}>
                    <div className={styles.headGroup}>
                        <Typo variant={"h5"}>Дополнительные сведения</Typo>
                    </div>
                    <div style={{ width: 704 }}>
                        <TextArea
                            size={"large"}
                            value={form.comment}
                            onChange={(event) => (form.comment = event.target.value)}
                            height={160}
                            placeholder={
                                "Описание места встречи. Внешние идентификационные признаки, наличие трости, очков, одежда, предметы и т.д."
                            }
                        />
                    </div>
                </div>
            ))}
        </div>
    );
});
