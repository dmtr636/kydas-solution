import styles from "./styles.module.scss";
import { useState } from "react";
import FormFirstStep from "src/features/request/RequestForm/FormFirstStep/FormFirstStep.tsx";
import Stepper from "src/ui/components/solutions/Stepper/Stepper.tsx";
import FormSecondStep from "src/features/request/RequestForm/FormSecondStep/FormSecondStep.tsx";
import FormLastStep from "src/features/request/RequestForm/FormLastStep/FormLastStep.tsx";
import FormSuccesfull from "src/features/request/RequestForm/FormSuccesfull/FormSuccesfull.tsx";
/*import {
    IconAppGaleryMetro,
    IconAppStoreMetro,
    IconGPMetro,
    IconPhoneMetro,
} from "src/ui/assets/icons";*/
import { Link } from "react-router-dom";
import InfoBlock from "src/features/request/RequestForm/InfoBlock/InfoBlock.tsx";
import axios from "axios";
import { REQUEST_POST_ENDPOINT } from "src/shared/api/endpoints.ts";
import FormGroupSuccesfull from "src/features/request/RequestForm/FormGroupSuccesfull/FormGroupSuccesfull.tsx";
/*import { Simulate } from "react-dom/test-utils";
import error = Simulate.error;*/

const RequestForm = () => {
    const [step, setStep] = useState(0);

    const [userName, setUserName] = useState("");
    const [year, setYear] = useState<any>(null);
    const [phone, setPhone] = useState("");

    const [startStation, setStartStation] = useState<number | null>(null);
    const [endStation, setEndStation] = useState<number | null>(null);
    const [radioMeetValue, setRadioMeetValue] = useState<string>("У входных дверей");
    const [date, setDate] = useState<string>("");

    const [haveBaggage, setHaveBaggage] = useState<string>("false");
    const [haveSmallBaggage, setHaveSmallBaggage] = useState(false);
    const [haveBigBaggage, setHaveBigBaggage] = useState(false);
    const [otherInfo, setOtherInfo] = useState("");
    const [haveOtherBaggage, setHaveOtherBaggage] = useState(false);
    const [otherBaggage, setOtherBaggage] = useState("");
    const [aboutBaggage, setAboutBaggage] = useState("");

    const [health, setHealth] = useState<string | null>("");
    const [needWheelchair, setNeedWheelchair] = useState(false);
    const [number, setNumber] = useState<any>();
    const [link, setLink] = useState<string>("");
    const [isLoading, setIsloading] = useState<boolean>(false);
    const selectedDate: Date = new Date(date);
    const currentDate: Date = new Date();
    const difference: number = selectedDate.getTime() - currentDate.getTime();
    const hour = selectedDate.getHours();
    const minutes = selectedDate.getMinutes();
    const [sex, setSex] = useState<any>();
    const [peopleCount, setPeopleCount] = useState<any>("");
    const [kardio, setKardio] = useState<string>("false");
    const [needHelpWithBaggage, setNeedHelpWithBaggage] = useState("false");
    const isBetweenNightHours =
        date !== null &&
        ((hour === 1 && minutes >= 0) || (hour > 1 && hour < 5) || (hour === 5 && minutes <= 30));
    const validate1 = Boolean(userName) && phone.length === 12 && Boolean(year) && sex;
    const validate2 =
        validate1 &&
        Boolean(startStation) &&
        Boolean(endStation) &&
        startStation !== endStation &&
        Boolean(date) &&
        !isBetweenNightHours &&
        difference > 30 * 60 * 1000;
    const steps = [
        {
            title: "Контакты",
            onClick: () => setStep(0),
            valid: true,
        },
        {
            title: "Маршрут",
            onClick: () => setStep(1),
            valid: validate1,
        },
        {
            title: "Дополнительная информация",
            onClick: () => setStep(2),
            valid: validate2,
        },
    ];

    const data = {
        info: {
            fullName: userName,
            phone: phone,
            age: year,
            tripDate: date,
            departureStationId: startStation,
            arrivalStationId: endStation,
            meetingPoint: radioMeetValue,
            groupId: health,
            wheelchairRequired: needWheelchair,
            hasBaggage: haveBaggage,
            lightBaggage: haveSmallBaggage,
            mediumBaggage: haveBigBaggage,
            baggageDescription: otherBaggage,
            baggageWeight: aboutBaggage,
            comment: otherInfo,
            sex: sex,
            pacemaker: kardio,
            baggageHelpRequired: needHelpWithBaggage,
        },
    };
    const sendData = () => {
        setIsloading(true);
        axios
            .post(REQUEST_POST_ENDPOINT, data, { withCredentials: false })
            .then((response) => {
                setNumber(response.data.number);
                setLink(response.data.id);
                setIsloading(false);
                setStep(3);
            })

            .catch((error) => {
                setIsloading(false);
                console.log(error);
            });
    };
    const OnCreateNewRequest = () => {
        setUserName("");
        setYear("");
        setPhone("");
        setStartStation(null);
        setEndStation(null);
        setRadioMeetValue("У входных дверей");
        setDate("");
        setHaveBaggage("false");
        setHaveSmallBaggage(false);
        setHaveBigBaggage(false);
        setOtherInfo("");
        setHaveOtherBaggage(false);
        setOtherBaggage("");
        setAboutBaggage("");
        setHealth("");
        setNeedWheelchair(false);
        setStep(0);
        setSex("");
        setPeopleCount("");
        setKardio("false");
        setNeedHelpWithBaggage("false");
    };
    return (
        <>
            {" "}
            {step > 2 ? (
                <h1 onClick={() => OnCreateNewRequest()} className={styles.headerText}>
                    <a className={styles.active}>Заполнить еще одну заявку</a>
                </h1>
            ) : (
                <h1 className={styles.headerText}>
                    <a
                        onClick={() => {
                            /*document.getElementById("input")?.focus()*/
                        }}
                        href={"#user"}
                        className={styles.active}
                    >
                        Заполнить заявку
                    </a>{" "}
                    самостоятельно или{" "}
                    <Link to={"tel:+7(495)6227341"} className={styles.active}>
                        позвонить нам
                    </Link>
                </h1>
            )}
            <div className={styles.formContainer}>
                <div className={styles.container}>
                    <div className={styles.stepper}>
                        {step >= 3 ? (
                            <div className={styles.stepHeader}>
                                Заявка составлена! Номер заявки —{" "}
                                {number ? (
                                    <Link to={`/request/${link}`} className={styles.active}>
                                        M-{number}
                                    </Link>
                                ) : (
                                    <a
                                        target="_blank"
                                        href={
                                            "https://mosmetro.ru/passengers/services/accessibility-center"
                                        }
                                        className={styles.active}
                                        rel="noreferrer"
                                    >
                                        M-{4445}
                                    </a>
                                )}
                            </div>
                        ) : (
                            <Stepper StepsArray={steps} currentStep={step} />
                        )}
                    </div>
                    <div className={styles.formRequestContainer} id={"Форма"}>
                        {step === 0 && (
                            <FormFirstStep
                                userName={userName}
                                setStep={setStep}
                                setUserName={setUserName}
                                setYear={setYear}
                                setPhone={setPhone}
                                phone={phone}
                                year={year}
                                sex={sex}
                                setSex={setSex}
                                peopleCount={peopleCount}
                                setPeopleCount={setPeopleCount}
                            />
                        )}
                        {step === 1 && (
                            <FormSecondStep
                                startStation={startStation}
                                setStartStation={setStartStation}
                                endStation={endStation}
                                setEndStation={setEndStation}
                                radioMeetValue={radioMeetValue}
                                setRadioMeetValue={setRadioMeetValue}
                                setStep={setStep}
                                date={date}
                                setDate={setDate}
                            />
                        )}
                        {step === 2 && (
                            <FormLastStep
                                setStep={setStep}
                                haveBaggage={haveBaggage}
                                setHaveBaggage={setHaveBaggage}
                                haveSmallBaggage={haveSmallBaggage}
                                setHaveSmallBaggage={setHaveSmallBaggage}
                                haveBigBaggage={haveBigBaggage}
                                setHaveBigBaggage={setHaveBigBaggage}
                                otherInfo={otherInfo}
                                setOtherInfo={setOtherInfo}
                                haveOtherBaggage={haveOtherBaggage}
                                setHaveOtherBaggage={setHaveOtherBaggage}
                                otherBaggage={otherBaggage}
                                setOtherBaggage={setOtherBaggage}
                                aboutBaggage={aboutBaggage}
                                setAboutBaggage={setAboutBaggage}
                                health={health}
                                setHealth={setHealth}
                                needWheelchair={needWheelchair}
                                setNeedWheelchair={setNeedWheelchair}
                                sendData={sendData}
                                isLoading={isLoading}
                                kardio={kardio}
                                setKardio={setKardio}
                                needHelpWithBaggage={needHelpWithBaggage}
                                setNeedHelpWithBaggage={setNeedHelpWithBaggage}
                            />
                        )}
                        {step === 3 && (
                            <FormSuccesfull
                                stationStart={startStation}
                                stationEnd={endStation}
                                date={date}
                                name={userName}
                                link={link}
                                number={number}
                            />
                        )}
                        {step === 4 && (
                            <FormGroupSuccesfull
                                name={userName}
                                phone={phone}
                                peopleCount={peopleCount}
                            />
                        )}
                    </div>
                </div>
                <InfoBlock />
            </div>
        </>
    );
};

export default RequestForm;
