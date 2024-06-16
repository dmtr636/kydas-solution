import styles from "./style.module.scss";
import stationsWithIcons from "src/features/request/stationsWithIcons.tsx";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import { RadioGroup } from "src/ui/components/controls/RadioGroup/RadioGroup.tsx";
import { RadioButton } from "src/ui/components/controls/RadioButton/RadioButton.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { Tooltip } from "src/ui/components/info/Tooltip/Tooltip.tsx";
import { IconAttention } from "src/ui/assets/icons";

const FormSecondStep = ({
    startStation,
    setStartStation,
    endStation,
    setEndStation,
    radioMeetValue,
    setRadioMeetValue,
    setStep,
    date,
    setDate,
}: {
    startStation: number | null;
    setStartStation: (station: number | null) => void;
    endStation: number | null;
    setEndStation: (station: number | null) => void;
    radioMeetValue: string;
    setRadioMeetValue: (string: string) => void;
    setStep: (number: number) => void;
    date: string;
    setDate: (string: string) => void;
}) => {
    const notification =
        startStation === endStation && startStation !== null ? (
            <span style={{ color: "#DA2031" }}>Начальная и конечная станции должны отличаться</span>
        ) : (
            ""
        );

    const selectedDate: Date = new Date(date);
    const currentDate: Date = new Date();
    const difference: number = selectedDate.getTime() - currentDate.getTime();
    const hour = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();

    return (
        <>
            <div className={styles.datePicker}>
                <div style={{ width: "313px" }}>
                    <DatePicker
                        required={true}
                        brand={true}
                        mode={"brand"}
                        size={"large"}
                        formName={"Дата и время поездки"}
                        placeholder={"Выберите дату поездки"}
                        value={date}
                        formText={
                            date !== null && difference < 30 * 60 * 1000 ? (
                                <span style={{ color: "#c2180f" }}>
                                    Дата поездки должна быть минимум на 30 минут больше текущей даты
                                </span>
                            ) : (
                                ""
                            )
                        }
                        onChange={setDate as any}
                        disablePast={true}
                        startYear={2024}
                        endYear={2025}
                    />
                </div>
                {30 * 60 * 1000 < difference && difference < 1440 * 60 * 1000 && (
                    <div style={{ marginTop: "28px" }}>
                        <Tooltip
                            mode={"contrast"}
                            closeOnClick={true}
                            text={
                                "Заявки, поданные менее чем за 24 часа до времени начала поездки, выполняются только при наличии свободных работников ЦОМП, необходимого специального оборудования для организации предоставления Услуги"
                            }
                            tipPosition={"top-center"}
                            size={"large"}
                        >
                            <ButtonIcon size={"large"} mode={"negative"} type={"tertiary"}>
                                <IconAttention />
                            </ButtonIcon>
                        </Tooltip>
                    </div>
                )}
            </div>
            <div className={styles.stationsContainer}>
                <Autocomplete
                    required={true}
                    size={"large"}
                    placeholder={"Введите название станции"}
                    multiple={false}
                    formName={"Станция отправления"}
                    options={stationsWithIcons}
                    value={startStation}
                    onValueChange={setStartStation}
                    brand={true}
                />
                <Autocomplete
                    required={true}
                    size={"large"}
                    placeholder={"Введите название станции"}
                    brand={true}
                    multiple={false}
                    formName={"Станция прибытия"}
                    options={stationsWithIcons}
                    value={endStation}
                    onValueChange={setEndStation}
                    formNotification={notification}
                />
            </div>

            <div className={styles.radiogroupContainer}>
                <div className={styles.radioHead}>
                    Выберите место встречи с инспектором службы <br />
                    на станции отправления
                </div>
                <RadioGroup value={radioMeetValue} onChange={setRadioMeetValue}>
                    <div className={styles.radiogroup}>
                        <RadioButton
                            value={"У входных дверей"}
                            color={"brand"}
                            title={"У входных дверей"}
                        />
                        <span style={{ marginLeft: "24px", marginRight: "60px" }}>
                            <RadioButton
                                value={"В вестибюле"}
                                color={"brand"}
                                title={"В вестибюле"}
                            />
                        </span>
                        <RadioButton
                            value={"У турникетов"}
                            color={"brand"}
                            title={"У турникетов"}
                        />
                        <span style={{ marginLeft: "62px" }}>
                            <RadioButton
                                value={"На платформе, в центре зала"}
                                color={"brand"}
                                title={"На платформе, в центре зала"}
                            />
                        </span>
                    </div>
                </RadioGroup>
                <div className={styles.button}>
                    <Button
                        mode={"brand"}
                        size={"large"}
                        onClick={() => setStep(2)}
                        disabled={
                            !(
                                startStation &&
                                endStation &&
                                radioMeetValue &&
                                !notification &&
                                difference > 30 * 60 * 1000
                            )
                        }
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </>
    );
};

export default FormSecondStep;
