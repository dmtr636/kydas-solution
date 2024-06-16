import { observer } from "mobx-react-lite";
import { Accordion } from "src/ui/components/solutions/Accordion/Accordion.tsx";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { store } from "src/app/AppStore.ts";
import styles from "./EventFilter.module.scss";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { DatePicker } from "src/ui/components/inputs/DatePicker/DatePicker.tsx";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { eventsLocaleActions } from "src/features/admin/events/utils/eventsLocale.ts";

export const EventFilter = observer(() => {
    const statusLayout = Object.entries(requestStatuses).map(([key, value]) => ({
        title: value,
        value: key,
    }));

    const filter = store.event.filter;
    const form = filter.filterForm;

    return (
        <div className={styles.filterContent}>
            <Accordion
                title={"Дата"}
                defaultExpanded={form["createDate"]}
                counter={[form["createDate"]].filter(Boolean).length}
                content={
                    <div className={styles.grid1Col}>
                        <DatePicker
                            size={"large"}
                            formName={"Дата действий"}
                            placeholder={"Выберите дату"}
                            value={form["createDate"]}
                            onChange={(value) =>
                                filter.setFilterFormSingleValue("createDate", value)
                            }
                            startYear={2000}
                            endYear={2025}
                            disableTime={true}
                        />
                    </div>
                }
            />
            <Accordion
                title={"Действие"}
                defaultExpanded={form["action"]?.length}
                counter={form["action"]?.length}
                content={
                    <div className={styles.grid1Col}>
                        {Object.entries(eventsLocaleActions).map(([key, value]) => (
                            <Checkbox
                                key={key}
                                onChange={(checked) => {
                                    filter.setFilterFormMultipleValue("action", key, checked);
                                }}
                                checked={filter.getFilterFormMultipleValue("action", key)}
                                title={value}
                            />
                        ))}
                    </div>
                }
            />
            <Accordion
                title={"Автор"}
                content={
                    <div className={styles.grid1Col}>
                        <Autocomplete
                            size={"large"}
                            placeholder={"Введите ФИО автора"}
                            value={form["author"]}
                            onValueChange={(v) => filter.setFilterFormSingleValue("author", v)}
                            options={store.employee.employees
                                .map((e) => ({ name: getFullName(e), value: e.userId }))
                                .concat(
                                    store.user.users
                                        .filter((u) => u.role !== "EMPLOYEE")
                                        .filter((u) => !!u.name)
                                        .map((u) => ({ name: u.name ?? "", value: u.id })),
                                )}
                        />
                    </div>
                }
                defaultExpanded={form["author"]}
                counter={[form["author"]].filter(Boolean).length}
            />
        </div>
    );
});
