import { observer } from "mobx-react-lite";
import { Accordion } from "src/ui/components/solutions/Accordion/Accordion.tsx";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { store } from "src/app/AppStore.ts";
import styles from "./EmployeeFilter.module.scss";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import stationsWithIcons from "src/features/request/stationsWithIcons.tsx";
import { employeeStatuses } from "src/features/admin/employees/constants/employeeStatuses.ts";
import { tagOptions } from "src/features/admin/employees/components/EmployeeInfo/EmployeeInfo.tsx";

export const EmployeeFilter = observer(() => {
    const filter = store.employee.filter;
    const form = filter.filterForm;

    return (
        <div className={styles.filterContent}>
            <Accordion
                title={"Статус работы"}
                defaultExpanded={form["status"]?.length || form["date"]}
                content={
                    <div className={styles.groups}>
                        <div className={styles.grid2Col}>
                            {Object.entries(employeeStatuses).map(([key, value]) => (
                                <Checkbox
                                    key={key}
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue("status", key, checked);
                                    }}
                                    checked={filter.getFilterFormMultipleValue("status", key)}
                                    title={value}
                                />
                            ))}
                        </div>
                        <div className={styles.grid1Col}>
                            <DatePicker
                                size={"large"}
                                formName={"Дата"}
                                formText={
                                    "Будут отображаться статусы \nинспекторов на выбранную дату"
                                }
                                placeholder={"Выберите дату и время"}
                                value={form["date"]}
                                onChange={(value) => filter.setFilterFormSingleValue("date", value)}
                                startYear={2000}
                                endYear={2025}
                            />
                        </div>
                    </div>
                }
                counter={[form["status"], form["date"]].flat().filter(Boolean).length}
            />
            <Accordion
                title={"Активная заявка"}
                defaultExpanded={form["hasActiveRequest"]?.length}
                counter={form["hasActiveRequest"]?.length}
                content={
                    <div className={styles.grid2Col}>
                        <Checkbox
                            onChange={(checked) => {
                                filter.setFilterFormMultipleValue(
                                    "hasActiveRequest",
                                    false,
                                    checked,
                                );
                            }}
                            checked={filter.getFilterFormMultipleValue("hasActiveRequest", false)}
                            title={"Отсутствует"}
                        />
                        <Checkbox
                            onChange={(checked) => {
                                filter.setFilterFormMultipleValue(
                                    "hasActiveRequest",
                                    true,
                                    checked,
                                );
                            }}
                            checked={filter.getFilterFormMultipleValue("hasActiveRequest", true)}
                            title={"Имеется"}
                        />
                    </div>
                }
            />
            <Accordion
                title={"Местоположение"}
                defaultExpanded={form["location"]?.length}
                counter={form["location"]?.length}
                content={
                    <div>
                        <Autocomplete
                            size={"large"}
                            placeholder={"Выберите станции"}
                            multiple={false}
                            options={stationsWithIcons}
                            value={form["location"]}
                            onValueChange={(value) => (form["location"] = value)}
                        />
                    </div>
                }
            />
            <Accordion
                title={"Участок"}
                defaultExpanded={form["area"]?.length}
                content={
                    <div className={styles.groups}>
                        <div className={styles.grid2Col}>
                            {[
                                "ЦУ-1",
                                "ЦУ-2",
                                "ЦУ-3",
                                "ЦУ-3 (Н)",
                                "ЦУ-4",
                                "ЦУ-4 (Н)",
                                "ЦУ-5",
                                "ЦУ-8",
                            ].map((value) => (
                                <Checkbox
                                    key={value}
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue("area", value, checked);
                                    }}
                                    checked={filter.getFilterFormMultipleValue("area", value)}
                                    title={value}
                                />
                            ))}
                        </div>
                    </div>
                }
                counter={[form["status"]].flat().filter(Boolean).length}
            />
            <Accordion
                title={"Параметры"}
                defaultExpanded={form["tags"]?.length}
                content={
                    <div className={styles.groups}>
                        <div className={styles.grid2Col}>
                            {tagOptions.map((tag) => (
                                <Checkbox
                                    key={tag.value}
                                    onChange={(checked) => {
                                        filter.setFilterFormMultipleValue(
                                            "tags",
                                            tag.value,
                                            checked,
                                        );
                                    }}
                                    checked={filter.getFilterFormMultipleValue("tags", tag.value)}
                                    title={tag.name}
                                />
                            ))}
                        </div>
                    </div>
                }
                counter={[form["tags"]].flat().filter(Boolean).length}
            />
        </div>
    );
});
