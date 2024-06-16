import { observer } from "mobx-react-lite";
import { AdminPageContentLayout } from "src/features/admin/layout/components/AdminPageContentLayout/AdminPageContentLayout.tsx";
import { useNavigate } from "react-router-dom";
import { store } from "src/app/AppStore.ts";
import { numDecl } from "src/shared/utils/numDecl.ts";
import { ExplorationWithStore } from "src/ui/components/segments/Exploration/ExplorationWithStore.tsx";
import { Table } from "src/ui/components/segments/Table/Table.tsx";
import { Person } from "src/ui/components/solutions/Person/Person.tsx";
import {
    EmployeeStatus,
    getEmployeeStatus,
} from "src/features/admin/employees/components/EmployeeStatus/EmployeeStatus.tsx";
import { IEmployee } from "src/features/admin/employees/types/IEmployee.ts";
import { TableColumn } from "src/ui/components/segments/Table/Table.types.ts";
import { EmployeeLocation } from "src/features/admin/employees/components/EmployeeLocation/EmployeeLocation.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { EmployeeFilter } from "src/features/admin/employees/components/EmployeeFilter/EmployeeFilter.tsx";
import { getEmployeeFilterChips } from "src/features/admin/employees/utils/getFilterChips.ts";
import { IconPlus } from "src/ui/assets/icons";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { Link } from "src/ui/components/controls/Link/Link.tsx";
import { useEffect } from "react";
import { Skeleton } from "src/ui/components/info/Skeleton/Skeleton.tsx";

export const EmployeesPage = observer(() => {
    const navigate = useNavigate();

    useEffect(() => {
        store.request.fetchAllByFilter({
            tripDate: store.employee.filter.filterForm["date"]
                ? new Date(store.employee.filter.filterForm["date"]).toLocaleDateString()
                : new Date().toLocaleDateString(),
        });
    }, [store.employee.filter.filterForm["date"]]);

    const getCountForFilterForm = () => {
        return store.employee.filterEmployees(store.employee.filter.filterForm).length;
    };

    const getFilterApplyButtonLabel = () => {
        const count = getCountForFilterForm();
        let label = "Применить";
        label += ` (${count} ${numDecl(count, ["инспектор", "инспектора", "инспекторов"])})`;
        return label;
    };

    const getEmployeeActiveRequest = (employee: IEmployee) => {
        const requests = store.request.requests.filter((r) =>
            r.assignedEmployees?.some((ae) => ae.employeeId === employee.id),
        );
        const sortedRequests = requests.sort((a, b) =>
            a.info.tripDate.localeCompare(b.info.tripDate),
        );
        const currentDate = new Date().toISOString();
        const nextRequestIndex = sortedRequests.findIndex(
            (r) => r.info.tripDate > currentDate && r.status === "CONFIRMED",
        );
        if (nextRequestIndex !== -1) {
            if (nextRequestIndex > 0 && requests[nextRequestIndex - 1].status === "CONFIRMED") {
                return requests[nextRequestIndex - 1];
            }
            return requests[nextRequestIndex];
        }
        return requests[requests.length - 1];
    };

    const getColumns = () => {
        const columns: TableColumn<IEmployee>[] = [
            {
                name: "ФИО инспектора",
                width: 376,
                render: (employee) => <Person fullName={getFullName(employee)} />,
                sortField: "fullName",
            },
            {
                name: "Статус",
                width: 146,
                render: (employee) => (
                    <EmployeeStatus
                        employee={employee}
                        date={
                            store.employee.filter.filterForm["date"]
                                ? new Date(store.employee.filter.filterForm["date"])
                                : undefined
                        }
                    />
                ),
                sortField: "status",
            },
        ];
        columns.push(
            {
                name: "Активная заявка",
                width: 164,
                render: (employee) =>
                    store.request.loader.loading ? (
                        <Skeleton width={56} height={24} />
                    ) : getEmployeeStatus(employee) === "WORKING" &&
                      getEmployeeActiveRequest(employee) ? (
                        <Link
                            size={"large"}
                            href={`/admin/requests/${getEmployeeActiveRequest(employee)?.id}`}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                            firstLine={`M-${getEmployeeActiveRequest(employee)?.number}`}
                            disableVisited
                        />
                    ) : (
                        "—"
                    ),
            },
            {
                name: "Местоположение",
                width: 210,
                render: (employee) =>
                    store.request.loader.loading ? (
                        <Skeleton width={56} height={24} />
                    ) : getEmployeeStatus(employee) === "WORKING" &&
                      getEmployeeActiveRequest(employee) ? (
                        <EmployeeLocation activeRequest={getEmployeeActiveRequest(employee)!} />
                    ) : (
                        "—"
                    ),
            },
        );
        return columns;
    };

    const getActions = () => {
        const actions = [];
        if (["ROOT", "ADMIN", "SPECIALIST"].includes(store.account.currentUser?.role ?? "")) {
            actions.push(
                <Button
                    key={"add"}
                    iconBefore={<IconPlus />}
                    onClick={() => {
                        navigate("/admin/employees/add");
                    }}
                >
                    Добавить инспектора
                </Button>,
            );
        }
        return actions;
    };

    return (
        <AdminPageContentLayout title={"Инспекторы"} actions={getActions()}>
            <ExplorationWithStore
                inputPlaceholder={"Поиск по ФИО инспектора или табельному номеру"}
                filterStore={store.employee.filter}
                enableFilter={true}
                filterContent={<EmployeeFilter />}
                filters={getEmployeeFilterChips()}
                applyButtonLabel={getFilterApplyButtonLabel()}
            />
            <Table
                data={store.employee.filteredEmployees}
                onRowClick={(data) => {
                    navigate(`/admin/employees/${data.id}`);
                }}
                columns={getColumns()}
                loading={store.employee.loader.loading}
                filterStore={store.employee.filter}
                tableHeaderBorderRadius
            />
        </AdminPageContentLayout>
    );
});
