import React, { ChangeEvent, useState } from "react";
import styles from "./style.module.scss";
import { Select } from "src/ui/components/inputs/Select/Select.tsx";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { RadioGroup } from "src/ui/components/controls/RadioGroup/RadioGroup.tsx";
import { RadioButton } from "src/ui/components/controls/RadioButton/RadioButton.tsx";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import healthArray from "src/features/request/healthArray.ts";

interface Props {
    haveBaggage: string;
    setHaveBaggage: React.Dispatch<React.SetStateAction<string>>;
    haveSmallBaggage: boolean;
    setHaveSmallBaggage: React.Dispatch<React.SetStateAction<boolean>>;
    haveBigBaggage: boolean;
    setHaveBigBaggage: React.Dispatch<React.SetStateAction<boolean>>;
    otherInfo: string;
    setOtherInfo: React.Dispatch<React.SetStateAction<string>>;
    haveOtherBaggage: boolean;
    setHaveOtherBaggage: React.Dispatch<React.SetStateAction<boolean>>;
    otherBaggage: string;
    setOtherBaggage: React.Dispatch<React.SetStateAction<string>>;
    aboutBaggage: string;
    setAboutBaggage: React.Dispatch<React.SetStateAction<string>>;
    health: string | null;
    setHealth: React.Dispatch<React.SetStateAction<string | null>>;
    needWheelchair: boolean;
    setNeedWheelchair: React.Dispatch<React.SetStateAction<boolean>>;
    setStep: (step: number) => void;
    sendData: () => void;
    isLoading: boolean;
    kardio: string;
    setKardio: (value: string) => void;
    needHelpWithBaggage: string;
    setNeedHelpWithBaggage: (value: string) => void;
}

const FormLastStep: React.FC<Props> = ({
    haveBaggage,
    setHaveBaggage,
    setHaveSmallBaggage,
    setHaveBigBaggage,
    otherInfo,
    setOtherInfo,
    haveOtherBaggage,
    setHaveOtherBaggage,
    otherBaggage,
    setOtherBaggage,
    aboutBaggage,
    setAboutBaggage,
    health,
    setHealth,
    setNeedWheelchair,
    sendData,
    kardio,
    setKardio,
    isLoading,
    needHelpWithBaggage,
    setNeedHelpWithBaggage,
}) => {
    const onChangeOtherBaggage = (e: ChangeEvent<HTMLInputElement>) => {
        setOtherBaggage(e.target.value);
    };
    const onChangeAboutBaggage = (e: ChangeEvent<HTMLInputElement>) => {
        setAboutBaggage(e.target.value);
    };
    const onChangeOtherInfo = (e: ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.length <= 500) {
            setOtherInfo(e.target.value);
            setCount(500 - e.target.value.length);
        }
    };
    const [count, setCount] = useState(500);
    const [agree, setAgree] = useState(false);

    return (
        <>
            <div className={styles.aboutHealth}>
                <Select<any>
                    formName={"К какой категории вы относитесь"}
                    placeholder={"Выберите из списка"}
                    options={healthArray}
                    value={health}
                    brand={true}
                    onValueChange={setHealth}
                    size={"large"}
                    required={true}
                    multiple={false}
                    formNotification={
                        <>
                            Информация поможет нам в правильном <br /> подборе сопровождающего
                        </>
                    }
                ></Select>
                <Checkbox
                    color={"brand"}
                    onChange={setNeedWheelchair}
                    title={"Необходимо предоставить кресло-коляску"}
                />
                <div>
                    <div style={{ marginTop: "4px" }} className={styles.baggageHeader}>
                        Наличие ЭКС (Электрокардиостимулятор сердца)
                    </div>
                    <div style={{ marginBottom: "0px" }} className={styles.needBaggage}>
                        <RadioGroup value={kardio} onChange={setKardio}>
                            <RadioButton color={"brand"} value={"false"} title={"Отcутствует"} />
                            <RadioButton color={"brand"} value={"true"} title={"Имеется"} />
                        </RadioGroup>
                    </div>
                </div>
            </div>
            <div className={styles.baggage}>
                <div className={styles.baggageArray}>
                    <div>
                        <div className={styles.baggageHeader}>Наличие багажа</div>
                        <div className={styles.needBaggage}>
                            <RadioGroup value={haveBaggage} onChange={setHaveBaggage}>
                                <RadioButton
                                    color={"brand"}
                                    value={"false"}
                                    title={"Отcутствует"}
                                />
                                <RadioButton color={"brand"} value={"true"} title={"Имеется"} />
                            </RadioGroup>
                        </div>
                    </div>
                    {haveBaggage === "true" && (
                        <div className={styles.needHelpWithBaggage}>
                            <div className={styles.baggageHeader}>Требуется помощь с багажом?</div>
                            <div className={styles.needBaggage}>
                                <RadioGroup
                                    value={needHelpWithBaggage}
                                    onChange={setNeedHelpWithBaggage}
                                >
                                    <RadioButton color={"brand"} value={"false"} title={"Да"} />
                                    <RadioButton color={"brand"} value={"true"} title={"Нет"} />
                                </RadioGroup>
                            </div>
                        </div>
                    )}
                </div>

                {haveBaggage === "true" && (
                    <>
                        <div className={styles.baggageHeader}>Багаж</div>
                        <div className={styles.baggageCheckboxGroup}>
                            <Checkbox
                                color={"brand"}
                                onChange={setHaveSmallBaggage}
                                title={"Лёгкий груз (рюкзак, пакет и т. д.)"}
                            />
                            <Checkbox
                                color={"brand"}
                                onChange={setHaveBigBaggage}
                                title={"Средний груз (чемодан, сумка и т. д.)"}
                            />
                            <Checkbox
                                color={"brand"}
                                onChange={setHaveOtherBaggage}
                                title={"Другое"}
                            />
                        </div>
                        {haveOtherBaggage && (
                            <div className={styles.otherInput}>
                                <Input
                                    brand={true}
                                    size={"large"}
                                    placeholder={"Опишите ваш груз"}
                                    onChange={onChangeOtherBaggage}
                                    value={otherBaggage}
                                />
                            </div>
                        )}
                        <div className={styles.aboutBaggage}>
                            <Input
                                size={"large"}
                                brand={true}
                                formName={"Объём багажа"}
                                onChange={onChangeAboutBaggage}
                                value={aboutBaggage}
                                placeholder={"Приблизительный вес груза"}
                            />
                        </div>
                    </>
                )}
            </div>
            <div className={styles.commentBlock}>
                <TextArea
                    onChange={onChangeOtherInfo}
                    value={otherInfo}
                    brand={true}
                    placeholder={
                        "Для правильного подбора сопровождающего персонала укажите сведения о себе, которые Вы считаете необходимыми"
                    }
                    formName={"Свободный комментарий"}
                    height={230}
                    formText={`Осталось символов ${count}`}
                />
            </div>
            <div className={styles.buttonBlock}>
                <div className={styles.checkbox}>
                    <Checkbox color={"brand"} onChange={setAgree} />
                    <div className={styles.checkboxText}>
                        Я ознакомлен(а) с <a className={styles.active}> порядком предоставления</a>{" "}
                        услуг и согласен(а)
                        <a className={styles.active}> на обработку персональных данных</a>
                    </div>
                </div>

                <Button
                    onClick={sendData}
                    disabled={!agree || health == null}
                    mode={"brand"}
                    fullWidth={true}
                    loading={isLoading}
                >
                    Отправить заявку
                </Button>
            </div>
        </>
    );
};

export default FormLastStep;
