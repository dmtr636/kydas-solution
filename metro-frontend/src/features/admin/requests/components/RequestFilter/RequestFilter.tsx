import { observer } from "mobx-react-lite";
import { Accordion } from "src/ui/components/solutions/Accordion/Accordion.tsx";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { store } from "src/app/AppStore.ts";
import styles from "./RequestFilter.module.scss";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";
import { PhoneInput } from "src/ui/components/inputs/PhoneInput/PhoneInput.tsx";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import stationsWithIcons from "src/features/request/stationsWithIcons.tsx";
import healthArray from "src/features/request/healthArray.ts";
import { getFullName } from "src/shared/utils/getFullName.ts";

export const RequestFilter = observer(() => {
    const statusLayout = Object.entries(requestStatuses).map(([key, value]) => ({
        title: value,
        value: key,
    }));

    const filter = store.request.filter;
    const form = filter.filterForm;

    return (
        <div className={styles.filterContent}>
            <Accordion
                title={"Статус заявки"}
                defaultExpanded={form["status"]?.length}
                content={
                    <div className={styles.grid2Col}>
                        {statusLayout
                            .filter((item) => item.value !== "UNDER_CONSIDERATION")
                            .map((item) => (
                                <Checkbox
                                    key={item.title}
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "status",
                                            item.value,
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "status",
                                        item.value,
                                    )}
                                    title={item.title}
                                />
                            ))}
                    </div>
                }
                counter={form["status"]?.length}
            />
            <Accordion
                title={"Пассажир"}
                defaultExpanded={form["fullName"] || form["email"] || form["phone"]}
                counter={[form["fullName"], form["email"], form["phone"]].filter(Boolean).length}
                content={
                    <div className={styles.grid1Col}>
                        <Input
                            onChange={(event) => {
                                filter.setFilterFormSingleValue("fullName", event.target.value);
                            }}
                            value={form["fullName"] ?? ""}
                            placeholder={"ФИО"}
                            size={"large"}
                        />
                        <EmailInput
                            value={form["email"] ?? ""}
                            onChange={(email) => filter.setFilterFormSingleValue("email", email)}
                            formName={""}
                            size={"large"}
                            placeholder={"Почта пользователя"}
                        />
                        <PhoneInput
                            value={form["phone"] ?? ""}
                            onChange={(phone) => filter.setFilterFormSingleValue("phone", phone)}
                            size={"large"}
                        />
                    </div>
                }
            />
            <Accordion
                title={"Маршрут"}
                defaultExpanded={form["departureStation"] || form["arrivalStation"]}
                counter={[form["departureStation"], form["arrivalStation"]].filter(Boolean).length}
                content={
                    <div className={styles.grid1Col}>
                        <Autocomplete
                            size={"large"}
                            placeholder={"Введите название станции"}
                            multiple={false}
                            formName={"Станция отправления"}
                            options={stationsWithIcons}
                            value={form["departureStation"]}
                            onValueChange={(value) =>
                                filter.setFilterFormSingleValue("departureStation", value)
                            }
                        />
                        <Autocomplete
                            size={"large"}
                            placeholder={"Введите название станции"}
                            multiple={false}
                            formName={"Станция прибытия"}
                            options={stationsWithIcons}
                            value={form["arrivalStation"]}
                            onValueChange={(value) =>
                                filter.setFilterFormSingleValue("arrivalStation", value)
                            }
                        />
                    </div>
                }
            />
            <Accordion
                title={"Детали поездки"}
                defaultExpanded={form["meetingPoint"]?.length || form["wheelchairRequired"]?.length}
                counter={
                    [form["meetingPoint"], form["wheelchairRequired"]]
                        .flat()
                        .filter((v) => v !== null && v !== "" && v !== undefined).length
                }
                content={
                    <div className={styles.groups}>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.groupHeader}>
                                Место встречи с инспектором
                            </Typo>
                            <div className={styles.grid1Col}>
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "meetingPoint",
                                            "У входных дверей",
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "meetingPoint",
                                        "У входных дверей",
                                    )}
                                    title={"У входных дверей"}
                                />
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "meetingPoint",
                                            "У турникетов",
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "meetingPoint",
                                        "У турникетов",
                                    )}
                                    title={"У турникетов"}
                                />
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "meetingPoint",
                                            "В вестибюле",
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "meetingPoint",
                                        "В вестибюле",
                                    )}
                                    title={"В вестибюле"}
                                />
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "meetingPoint",
                                            "На платформе, в центре зала",
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "meetingPoint",
                                        "На платформе, в центре зала",
                                    )}
                                    title={"На платформе, в центре зала"}
                                />
                            </div>
                        </div>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.groupHeader}>
                                Предоставление кресло-коляски
                            </Typo>
                            <div className={styles.grid1Col}>
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "wheelchairRequired",
                                            false,
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "wheelchairRequired",
                                        false,
                                    )}
                                    title={"Не требуется"}
                                />
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "wheelchairRequired",
                                            true,
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "wheelchairRequired",
                                        true,
                                    )}
                                    title={"Требуется"}
                                />
                            </div>
                        </div>
                    </div>
                }
            />
            <Accordion
                title={"Категория и ЭКС"}
                content={
                    <div className={styles.groups}>
                        <div className={styles.grid1Col}>
                            {healthArray.map((item) => (
                                <Checkbox
                                    key={item.name}
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "group",
                                            item.value,
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue("group", item.value)}
                                    title={item.name}
                                />
                            ))}
                        </div>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.groupHeader}>
                                Наличие коляски
                            </Typo>
                            <div className={styles.grid2Col}>
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "hasCarriage",
                                            false,
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue(
                                        "hasCarriage",
                                        false,
                                    )}
                                    title={"Отсутствует"}
                                />
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "hasCarriage",
                                            true,
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue("hasCarriage", true)}
                                    title={"Имеется"}
                                />
                            </div>
                        </div>
                    </div>
                }
                defaultExpanded={form["group"]?.length || form["hasCarriage"]?.length}
                counter={
                    [form["group"], form["hasCarriage"]]
                        .flat()
                        .filter((v) => v !== null && v !== "" && v !== undefined).length
                }
            />
            <Accordion
                title={"Багаж"}
                content={
                    <div className={styles.groups}>
                        <div className={styles.grid2Col}>
                            <Checkbox
                                onChange={(checked) => {
                                    filter.setFilterFormMultipleValue("hasBaggage", false, checked);
                                }}
                                checked={filter.getFilterFormMultipleValue("hasBaggage", false)}
                                title={"Отсутствует"}
                            />
                            <Checkbox
                                onChange={(checked) => {
                                    filter.setFilterFormMultipleValue("hasBaggage", true, checked);
                                }}
                                checked={filter.getFilterFormMultipleValue("hasBaggage", true)}
                                title={"Имеется"}
                            />
                        </div>
                        <div>
                            <Typo variant={"subheadXL"} className={styles.groupHeader}>
                                Тип груза
                            </Typo>
                            <div className={styles.grid2Col}>
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormSingleValue("lightBaggage", checked);
                                    }}
                                    checked={form["lightBaggage"]}
                                    title={"Лёгкий груз"}
                                />
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormSingleValue("mediumBaggage", checked);
                                    }}
                                    checked={form["mediumBaggage"]}
                                    title={"Средний груз"}
                                />
                                <Checkbox
                                    onChange={(checked) => {
                                        filter.setFilterFormSingleValue(
                                            "hasBaggageDescription",
                                            checked,
                                        );
                                    }}
                                    checked={form["hasBaggageDescription"]}
                                    title={"Другое"}
                                />
                            </div>
                            <div className={styles.baggageDescription}>
                                <Input
                                    onChange={(event) => {
                                        filter.setFilterFormSingleValue(
                                            "baggageDescription",
                                            event.target.value,
                                        );
                                    }}
                                    value={form["baggageDescription"] ?? ""}
                                    placeholder={"Описание груза"}
                                    size={"large"}
                                />
                            </div>
                        </div>
                    </div>
                }
                defaultExpanded={
                    form["hasBaggage"]?.length ||
                    form["lightBaggage"] ||
                    form["mediumBaggage"] ||
                    form["hasBaggageDescription"] ||
                    form["baggageDescription"]
                }
                counter={
                    [form["hasBaggage"], form["baggageDescription"]]
                        .flat()
                        .filter((v) => v !== null && v !== "" && v !== undefined).length +
                    [
                        form["lightBaggage"],
                        form["mediumBaggage"],
                        form["hasBaggageDescription"],
                    ].filter(Boolean).length
                }
            />
            <Accordion
                title={"Назначенные инспекторы"}
                content={
                    <div>
                        <Autocomplete
                            size={"large"}
                            placeholder={"ФИО инспектора"}
                            multiple={false}
                            options={store.employee.employees.map((e) => ({
                                name: getFullName(e),
                                value: e.id,
                            }))}
                            value={form["assignedEmployee"]}
                            onValueChange={(value) =>
                                filter.setFilterFormSingleValue("assignedEmployee", value)
                            }
                        />
                    </div>
                }
                defaultExpanded={form["assignedEmployee"]}
                counter={
                    [form["assignedEmployee"]]
                        .flat()
                        .filter((v) => v !== null && v !== "" && v !== undefined).length
                }
            />
        </div>
    );
});
