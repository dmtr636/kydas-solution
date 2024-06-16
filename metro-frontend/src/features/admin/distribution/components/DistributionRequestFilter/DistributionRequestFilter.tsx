import { observer } from "mobx-react-lite";
import { Accordion } from "src/ui/components/solutions/Accordion/Accordion.tsx";
import { store } from "src/app/AppStore.ts";
import styles from "./DistributionRequestFilter.module.scss";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import stationsWithIcons from "src/features/request/stationsWithIcons.tsx";
import { getFullName } from "src/shared/utils/getFullName.ts";

export const DistributionRequestFilter = observer(() => {
    const filter = store.distribution.filter;
    const form = filter.filterForm;

    return (
        <div className={styles.filterContent}>
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
