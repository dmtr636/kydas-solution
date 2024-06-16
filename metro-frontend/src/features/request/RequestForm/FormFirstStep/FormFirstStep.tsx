import styles from "./styles.module.scss";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { ChangeEvent, useEffect, useState } from "react";
import { PhoneInput } from "src/ui/components/inputs/PhoneInput/PhoneInput.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { Select } from "src/ui/components/inputs/Select/Select.tsx";
import { Tabs } from "src/ui/components/solutions/Tabs/Tabs.tsx";
import { IconRomb } from "src/ui/assets/icons";

const FormFirstStep = ({
    setStep,
    setUserName,
    userName,
    setYear,
    setPhone,
    phone,
    year,
    sex,
    setSex,
    setPeopleCount,
    peopleCount,
}: {
    setStep: (step: number) => void;
    setUserName: (name: string) => void;
    setSex: (sex: "Мужской" | "Женский" | null) => void;
    sex: "Мужской" | "Женский";
    userName: string;
    setYear: (year: number | string) => void;
    setPhone: (phone: string) => void;
    phone: string;
    year: number | null;
    peopleCount: any;
    setPeopleCount: (count: string) => void;
}) => {
    const onChangeName = (event: ChangeEvent<HTMLInputElement>) => {
        setUserName(event.target.value);
    };

    const [maskValue, setMaskValue] = useState("");
    useEffect(() => {
        if (maskValue) {
            setMaskValue(maskValue);
        }
    }, []);

    const OnChangeYear = (event: ChangeEvent<HTMLInputElement>) => {
        if (
            (!isNaN(Number(event.target.value)) &&
                isFinite(Number(event.target.value)) &&
                Number(event.target.value) <= 120 &&
                event.target.value.length < 4) ||
            event.target.value === ""
        ) {
            setYear(event.target.value);
        }
    };
    const onChangeCount = (event: ChangeEvent<HTMLInputElement>) => {
        if (Number(event.target.value) || event.target.value === "") {
            setPeopleCount(event.target.value);
        }
    };
    const sexArray: any[] = [
        { name: "Мужской", value: "Мужской" },
        { name: "Женский", value: "Женский" },
    ];
    const tabsArray = [
        { name: "Один пассажир", value: "solo" },
        { name: "Группа детей", value: "group" },
    ];
    const [tab, setTab] = useState<any>("solo");
    return (
        <>
            <div style={{ marginBottom: "28px" }}>
                <Tabs
                    size={"large"}
                    type={"secondary"}
                    tabs={tabsArray}
                    value={tab}
                    onChange={setTab}
                    mode={"brand"}
                />
            </div>
            {tab === "solo" ? (
                <>
                    <div className={styles.headInputs}>
                        <div style={{ width: "412px" }}>
                            <Input
                                id={"user"}
                                onChange={onChangeName}
                                value={userName}
                                size={"large"}
                                placeholder={"Отчество впишите при наличии"}
                                formName={"ФИО"}
                                brand={true}
                                required={true}
                            />
                        </div>
                        <div style={{ width: "207px" }}>
                            <Select
                                size={"large"}
                                formName={"Ваш пол"}
                                placeholder={"Выберите пол"}
                                options={sexArray}
                                value={sex}
                                onValueChange={setSex}
                                required={true}
                                brand={true}
                            />
                        </div>
                    </div>
                    <div className={styles.formBlock}>
                        <div style={{ width: "360px" }}>
                            <PhoneInput
                                formName={"Телефон"}
                                value={phone}
                                onChange={setPhone}
                                brand={true}
                                required={true}
                                formText={
                                    <>
                                        Позвоним на этот номер телефона для <br /> подтверждения
                                        заявки
                                    </>
                                }
                            />
                        </div>
                        <div style={{ width: "256px" }}>
                            <Input
                                size={"large"}
                                formName={"Сколько вам полных лет?"}
                                brand={true}
                                placeholder={"Ваш возраст"}
                                required={true}
                                formText={
                                    <>
                                        Поможет нам в правильном <br /> подборе сопровождающего
                                    </>
                                }
                                onChange={OnChangeYear}
                                value={year}
                            />
                        </div>
                    </div>
                    <div className={styles.button}>
                        <Button
                            disabled={!(year && sex && userName && phone?.length === 12)}
                            mode={"brand"}
                            size={"large"}
                            onClick={() => {
                                setStep(1);
                            }}
                        >
                            Далее
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <Input
                        onChange={onChangeName}
                        value={userName}
                        size={"large"}
                        placeholder={"Отчество впишите при наличии"}
                        formName={"ФИО ответственного"}
                        brand={true}
                        required={true}
                    />
                    <div className={styles.groupInput}>
                        <div style={{ width: "360px" }}>
                            <PhoneInput
                                formName={"Телефон"}
                                value={phone}
                                onChange={setPhone}
                                brand={true}
                                required={true}
                                formText={
                                    <>
                                        Позвоним на этот номер телефона для <br /> подтверждения
                                        заявки
                                    </>
                                }
                            />
                        </div>
                        <div style={{ width: "256px" }}>
                            <Input
                                brand={true}
                                size={"large"}
                                formName={"Количество пассажиров"}
                                placeholder={"Впишите количество"}
                                value={peopleCount}
                                onChange={onChangeCount}
                            />
                        </div>
                    </div>
                    <div className={styles.groupInfo}>
                        <div className={styles.groupInfoHead}>
                            Подготовьтесь сообщить и предоставить следующую информацию
                        </div>
                        <div className={styles.groupInfoTextContainer}>
                            <div className={styles.groupInfoText}>
                                <IconRomb />
                                Наименование организации
                            </div>
                            <div className={styles.groupInfoText}>
                                <IconRomb />
                                Возраст детей
                            </div>
                            <div className={styles.groupInfoText}>
                                <IconRomb />
                                Локальный нормативный акт или иной организационно-распорядительный
                                документ
                            </div>
                            <div className={styles.groupInfoText}>
                                <IconRomb />
                                Контактные данные второго ответственного лица
                            </div>
                        </div>
                        <div style={{ marginTop: "32px" }}>
                            <Button onClick={() => setStep(4)} size={"large"} mode={"brand"}>
                                Оставить заявку
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default FormFirstStep;
