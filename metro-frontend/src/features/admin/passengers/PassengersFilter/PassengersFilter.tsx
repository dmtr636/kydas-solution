import { observer } from "mobx-react-lite";
import { Accordion } from "src/ui/components/solutions/Accordion/Accordion.tsx";
import { Checkbox } from "src/ui/components/controls/Checkbox/Checkbox.tsx";
import { store } from "src/app/AppStore.ts";
import styles from "./PassengersFilter.module.scss";
import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { EmailInput } from "src/ui/components/inputs/EmailInput/EmailInput.tsx";
import { PhoneInput } from "src/ui/components/inputs/PhoneInput/PhoneInput.tsx";
import { Autocomplete } from "src/ui/components/inputs/Autocomplete/Autocomplete.tsx";
import { Typo } from "src/ui/components/atoms/Typo/Typo.tsx";
import stationsWithIcons from "src/features/request/stationsWithIcons.tsx";
import healthArray from "src/features/request/healthArray.ts";
import { PassengersPage } from "src/features/admin/passengers/pages/PassengersPage.tsx";

export const PassengersFilter = observer(() => {
    const statusLayout = Object.entries(requestStatuses).map(([key, value]) => ({
        title: value,
        value: key,
    }));

    const filter = store.passengers.filter;
    const form = filter.filterForm;

    return (
        <div className={styles.filterContent}>
            <Accordion
                title={"Категория"}
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
                        <div></div>
                    </div>
                }
                defaultExpanded={form["group"]?.length}
                counter={
                    [form["group"]].flat().filter((v) => v !== null && v !== "" && v !== undefined)
                        .length
                }
            />
            <Accordion
                title={"ЭКС"}
                content={
                    <div className={styles.groups}>
                        <div className={styles.grid2Col}>
                            <Checkbox
                                onChange={(checked) => {
                                    filter.setFilterFormMultipleValue("pacemaker", false, checked);
                                }}
                                checked={filter.getFilterFormMultipleValue("pacemaker", false)}
                                title={"Отсутствует"}
                            />
                            <Checkbox
                                onChange={(checked) => {
                                    filter.setFilterFormMultipleValue("pacemaker", true, checked);
                                }}
                                checked={filter.getFilterFormMultipleValue("pacemaker", true)}
                                title={"Имеется"}
                            />
                        </div>
                    </div>
                }
                defaultExpanded={form["pacemaker"]?.length}
                counter={
                    [form["pacemaker"]]
                        .flat()
                        .filter((v) => v !== null && v !== "" && v !== undefined).length
                }
            />
        </div>
    );
});
