import styles from "./EmployeeForm.module.scss";
import { observer } from "mobx-react-lite";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import { store } from "src/app/AppStore.ts";
import { ReactNode } from "react";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";
import { Select } from "src/ui/components/inputs/Select/Select.tsx";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { PhoneInput } from "src/ui/components/inputs/PhoneInput/PhoneInput.tsx";
import { IEmployee } from "src/features/admin/employees/types/IEmployee.ts";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";

export const EmployeeForm = observer((props: { type: "add" | "edit" }) => {
    const employee = store.employee.employee;
    const form = store.employee.employeeForm;

    const renderBlock = (
        block: (employee: IEmployee, form: IEmployee) => ReactNode,
        height: number,
    ) => {
        if (props.type === "add" && form) {
            return block(form, form);
        }
        if (!employee || !form) {
            return <Skeleton height={height} width={"100%"} />;
        }
        return block(employee, form);
    };

    const renderGroup = (
        groupTabName: string,
        groupContent: (employee: IEmployee, form: IEmployee) => ReactNode,
    ) => {
        return (
            <div className={styles.section}>
                <Typo variant={"h5"} className={styles.sectionHeader}>
                    {groupTabName}
                </Typo>
                {renderBlock(groupContent, 51)}
            </div>
        );
    };

    return (
        <div className={styles.card}>
            {renderGroup("Личные данные", (_employee, form) => (
                <div className={styles.subgroups}>
                    <div
                        className={styles.infoRow}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "380px 240px 240px",
                            gap: "16px",
                        }}
                    >
                        <Input
                            formName={"Фамилия"}
                            size={"large"}
                            onChange={(event) => {
                                form.lastName = event.target.value;
                            }}
                            value={form.lastName ?? ""}
                            placeholder={"Введите фамилию"}
                            required={true}
                        />
                        <Input
                            formName={"Имя"}
                            size={"large"}
                            onChange={(event) => {
                                form.firstName = event.target.value;
                            }}
                            value={form.firstName ?? ""}
                            placeholder={"Введите имя"}
                            required={true}
                        />
                        <Input
                            formName={"Отчество"}
                            size={"large"}
                            onChange={(event) => {
                                form.patronymic = event.target.value;
                            }}
                            value={form.patronymic ?? ""}
                            placeholder={"При наличии"}
                        />
                    </div>
                    <div className={styles.infoRow}>
                        <div style={{ width: 214 }}>
                            <Select
                                formName={"Пол"}
                                required={true}
                                placeholder={"Выбрать"}
                                size={"large"}
                                value={form.sex}
                                onValueChange={(v) => (form.sex = v as string)}
                                options={[
                                    { name: "Мужской", value: "male" },
                                    { name: "Женский", value: "female" },
                                ]}
                                disableClear={true}
                            />
                        </div>
                        {props.type === "edit" && (
                            <div style={{ width: 209 }}>
                                <Input
                                    formName={"Табельный номер"}
                                    size={"large"}
                                    onChange={() => {}}
                                    value={
                                        form?.number?.slice(0, 4) + "-" + form?.number?.slice(4, 8)
                                    }
                                    disabled={true}
                                />
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {renderGroup("Контактные данные", (_employee, form) => (
                <div className={styles.subgroups}>
                    <div
                        className={styles.infoRow}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "206px 206px 1fr",
                            gap: "16px",
                        }}
                    >
                        <PhoneInput
                            formName={"Рабочий телефон"}
                            required={true}
                            size={"large"}
                            onChange={(value) => (form.phone = value)}
                            value={form.phone}
                            disableStartIcon={true}
                        />
                        <PhoneInput
                            formName={"Личный телефон"}
                            required={true}
                            size={"large"}
                            onChange={(value) => (form.phonePersonal = value)}
                            value={form.phonePersonal}
                            disableStartIcon={true}
                        />
                        <EmailInput
                            formName={"Почта"}
                            required={props.type === "add"}
                            size={"large"}
                            onChange={(value) => (form.email = value)}
                            value={form.email ?? ""}
                            showIcon={false}
                            placeholder={"example@email.com"}
                            formText={
                                "Используется инспектором для авторизации в приложении для сопровождения"
                            }
                            disabled={props.type === "edit"}
                        />
                    </div>
                </div>
            ))}
            {renderGroup("Рабочая информация", (_employee, form) => (
                <div className={styles.subgroups}>
                    <div
                        className={styles.infoRow}
                        style={{
                            display: "grid",
                            gridTemplateColumns: "264px 182px",
                            gap: "16px",
                        }}
                    >
                        <Select
                            formName={"Должность"}
                            options={[
                                {
                                    name: "Старший инспектор",
                                    value: "ЦСИ",
                                },
                                {
                                    name: "Инспектор",
                                    value: "ЦИ",
                                },
                            ]}
                            value={form.position}
                            onValueChange={(v) => (form.position = v as string)}
                            size={"large"}
                            placeholder={"Выбрать"}
                            required={true}
                            disableClear={true}
                        />
                        <Select
                            formName={"Участок"}
                            options={[
                                {
                                    name: "ЦУ-1",
                                    value: "ЦУ-1",
                                },
                                {
                                    name: "ЦУ-2",
                                    value: "ЦУ-2",
                                },
                                {
                                    name: "ЦУ-3",
                                    value: "ЦУ-3",
                                },
                                {
                                    name: "ЦУ-3 (Н)",
                                    value: "ЦУ-3 (Н)",
                                },
                                {
                                    name: "ЦУ-4",
                                    value: "ЦУ-4",
                                },
                                {
                                    name: "ЦУ-4 (Н)",
                                    value: "ЦУ-4 (Н)",
                                },
                                {
                                    name: "ЦУ-5",
                                    value: "ЦУ-5",
                                },
                                {
                                    name: "ЦУ-8",
                                    value: "ЦУ-8",
                                },
                            ]}
                            value={form.area}
                            onValueChange={(v) => (form.area = v as string)}
                            size={"large"}
                            placeholder={"Выбрать"}
                            required={true}
                            disableClear={true}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
});
