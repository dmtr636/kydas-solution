import { ChangeEvent, useState } from "react";
import styles from "./styles.module.scss";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";
import { clsx } from "clsx";
import { IconAvatar, IconError, IconTelephone } from "src/ui/assets/icons";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { Overlay } from "src/ui/components/segments/overlays/Overlay/Overlay.tsx";
import TextArea from "src/ui/components/inputs/Textarea/TextArea.tsx";
import axios from "axios";
import { REQUEST_CANSEL_ENDPOINT } from "src/shared/api/endpoints.ts";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import healthArray from "src/features/request/healthArray.ts";
import { store } from "src/app/AppStore.ts";

const TaskInfo = ({ data }: { data: IRequest }) => {
    const [overlayOpen, setOverlayOpen] = useState(false);

    const health = healthArray.find((obj: any) => obj.value === data.info.groupId);
    const lightBaggage = data.info.lightBaggage ? "лёгкий груз, " : "";
    const mediumBaggage = data.info.mediumBaggage ? "средний груз, " : "";

    let baggage =
        lightBaggage +
        mediumBaggage +
        (data.info.baggageDescription && `${data.info.baggageDescription.toLowerCase()}`);
    baggage = baggage.charAt(0).toUpperCase() + baggage.slice(1);

    if (baggage.slice(-2) === ", ") {
        baggage = baggage.slice(0, -2);
    }
    const [text, setText] = useState("");
    const onChangeTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
    };
    const canselData = {
        id: data.id,
        reason: text,
    };
    const onClickCanselRequest = () => {
        axios.post(REQUEST_CANSEL_ENDPOINT, canselData).then(() => {
            snackbarStore.showPositiveSnackbar("Заявка отменена");
            data.status = "CANCELED";
            setOverlayOpen(false);
        });
    };
    const responsibleEmployeeID = data?.assignedEmployees?.find(
        (employee: any) => employee.responsible === true,
    );

    const responcibleEmployee = store.staffApp.employees.find(
        (employee) => employee.id === responsibleEmployeeID?.employeeId,
    );
    /* const otherEmployeeId = data?.assignedEmployees?.filter(
         (employee: any) => employee.responsible === false,
     );*/
    const otherEmployeeIds = data?.assignedEmployees
        ?.filter((employee) => !employee.responsible)
        .map((employee) => employee.employeeId);
    const otherEmployees = store.staffApp.employees.filter((employee) =>
        otherEmployeeIds?.includes(employee.id),
    );

    /*const otherEmployee = store.staffApp.employees.filter(
        (employee) => employee.id === otherEmployeeId?.employeeId
    );*/
    const otherEmlpoyeesArray = otherEmployees?.map((employee: any, index) => (
        <div key={index} className={styles.itemtext}>
            <IconAvatar />{" "}
            {responcibleEmployee ? (
                <>
                    {employee.lastName} {employee.firstName} {employee.patronymic}
                </>
            ) : (
                <>Иванов Иван</>
            )}
            <a style={{ marginLeft: "auto" }} href="tel:+79528291846">
                <IconTelephone />
            </a>
        </div>
    ));

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.block}>
                    <div className={styles.head}>Команда сопровождения</div>
                    <div className={clsx(styles.itemBlock, styles.column)}>
                        <div className={styles.itemHead}>Ответственный</div>
                        <div className={styles.itemtext}>
                            <IconAvatar />{" "}
                            {responcibleEmployee ? (
                                <>
                                    {responcibleEmployee?.lastName} {responcibleEmployee?.firstName}{" "}
                                    {responcibleEmployee?.patronymic}
                                </>
                            ) : (
                                <>Иванов Иван</>
                            )}
                            <a style={{ marginLeft: "auto" }} href="tel:+79528291846">
                                <IconTelephone />
                            </a>
                        </div>
                    </div>
                    {otherEmlpoyeesArray?.length !== 0 && (
                        <div className={clsx(styles.itemBlock, styles.column)}>
                            <div className={styles.itemHead}>Сопровождающие</div>
                            {otherEmlpoyeesArray}
                        </div>
                    )}
                </div>
                <div
                    className={clsx(styles.block, {
                        [styles.canceled]: data.status === "CANCELED",
                    })}
                >
                    <div className={styles.head}>Основная информация</div>
                    <div className={clsx(styles.itemBlock, styles.column)}>
                        <div className={styles.itemHead}>ФИО</div>
                        <div className={styles.itemtext}>{data.info.fullName}</div>
                    </div>
                    <div className={clsx(styles.itemBlock)}>
                        <div className={styles.itemHead}>Пол</div>
                        <div className={styles.itemtext}>
                            {" "}
                            {data.info.sex === "female" ? "Женский" : "Мужской"}
                        </div>
                    </div>
                    <div className={clsx(styles.itemBlock)}>
                        <div className={styles.itemHead}>Возраст пассажира</div>
                        <div className={styles.itemtext}>{data.info.age}</div>
                    </div>
                </div>
                <div
                    className={clsx(styles.block, {
                        [styles.canceled]: data.status === "CANCELED",
                    })}
                >
                    <div className={styles.head}>Детали</div>

                    <div className={clsx(styles.itemBlock, styles.column)}>
                        <div className={styles.itemHead}>Категория</div>
                        <div className={styles.itemtext}> {health?.name ? health.name : "-"}</div>
                    </div>
                    <div className={clsx(styles.itemBlock)}>
                        <div className={styles.itemHead}>Кресло-коляска</div>
                        <div className={styles.itemtext}>
                            {" "}
                            {data.info.wheelchairRequired ? "Требуется" : "Не требуется"}
                        </div>
                    </div>
                    <div className={clsx(styles.itemBlock)}>
                        <div className={styles.itemHead}>Наличие ЭКС</div>
                        <div className={styles.itemtext}>
                            {" "}
                            {data.info.pacemaker ? "Отсутствует" : "Есть"}
                        </div>
                    </div>
                    {data.info.comment && (
                        <div className={clsx(styles.itemBlock, styles.column)}>
                            <div className={styles.itemHead}>Дополнительные сведения</div>
                            <div className={styles.itemtext}>{data.info.comment}</div>
                        </div>
                    )}
                    {data.info.strollerDescription &&
                        data.info.groupId &&
                        [4, 6, 9].includes(data.info.groupId) && (
                            <div className={clsx(styles.itemBlock, styles.column)}>
                                <div className={styles.itemHead}>Описание коляски</div>
                                <div className={styles.itemtext}>
                                    {data.info.strollerDescription}
                                </div>
                            </div>
                        )}
                </div>
                {data.info.hasBaggage && (
                    <div
                        className={clsx(styles.block, {
                            [styles.canceled]: data.status === "CANCELED",
                        })}
                    >
                        <div className={styles.head}>Багаж</div>
                        <div className={clsx(styles.itemBlock, styles.column)}>
                            <div className={styles.itemHead}>Тип груза</div>
                            <div className={styles.itemtext}>{baggage}</div>
                        </div>
                        {data.info.baggageWeight && (
                            <div className={styles.itemBlock}>
                                <div className={styles.itemHead}>Объём багажа</div>
                                <div className={styles.itemtext}>{data.info.baggageWeight}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {data.status !== "CANCELED" && data.convoyStatus !== "COMPLETE_CONVOY" && (
                <div className={styles.button}>
                    <Button
                        onClick={() => setOverlayOpen(true)}
                        mode={"brand"}
                        type={"outlined"}
                        fullWidth={true}
                        iconBefore={<IconError />}
                    >
                        Отменить заявку
                    </Button>
                </div>
            )}
            <Overlay
                onClose={() => setOverlayOpen(false)}
                open={overlayOpen}
                title={"Причина отмены заявки"}
                actions={[
                    <Button
                        disabled={text.length === 0}
                        onClick={onClickCanselRequest}
                        style={{ marginTop: "-20px" }}
                        key={1}
                        mode={"brand"}
                    >
                        Отменить заявку
                    </Button>,
                ]}
            >
                <TextArea
                    height={230}
                    brand={true}
                    placeholder={"Опишите причину отмены заявки в свободной форме"}
                    onChange={onChangeTextArea}
                    value={text}
                />
            </Overlay>
        </div>
    );
};

export default TaskInfo;
