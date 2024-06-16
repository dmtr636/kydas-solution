import { makeAutoObservable } from "mobx";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { LoaderStore } from "src/shared/stores/LoaderStore.ts";
import { EMPLOYEES_ENDPOINT } from "src/shared/api/endpoints.ts";
import { FilterStore } from "src/shared/stores/FilterStore.ts";
import { IEmployee } from "src/features/admin/employees/types/IEmployee.ts";
import { store } from "src/app/AppStore.ts";
import { getFullName } from "src/shared/utils/getFullName.ts";
import { getEmployeeStatus } from "src/features/admin/employees/components/EmployeeStatus/EmployeeStatus.tsx";
import { snackbarStore } from "src/ui/stores/SnackbarStore.ts";
import { IRequest } from "src/features/admin/requests/types/IRequest.ts";

export class EmployeeStore {
    employees: IEmployee[] = [];
    employee: IEmployee | null = null;
    employeeForm: IEmployee | null = null;
    apiClient = new ApiClient();
    loader = new LoaderStore();
    filter = new FilterStore({ defaultSort: "fullName-asc" });
    requestFilter = new FilterStore({ defaultSort: "tripDate-asc" });
    notificationFilter = new FilterStore({ defaultSort: "createDate-desc" });
    tab = "main";
    editingEmployee: IEmployee | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isFormValid() {
        const form = this.employeeForm;
        return (
            form?.lastName &&
            form?.firstName &&
            form?.sex &&
            form?.phone &&
            form?.phonePersonal &&
            form?.email &&
            form.position &&
            form.area
        );
    }

    async createEmployee(newRequest: IEmployee) {
        this.loader.start();
        const result = await this.apiClient.post<IEmployee>(EMPLOYEES_ENDPOINT, newRequest);
        if (result.status) {
            this.setEmployee(result.data);
            snackbarStore.showPositiveSnackbar("Инспектор добавлен");
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось добавить инспектора");
        }
        this.loader.finish();
        return result;
    }

    async fetchById(id: string | number) {
        this.loader.start();
        const result = await this.apiClient.get<IEmployee>(`${EMPLOYEES_ENDPOINT}/${id}`);
        if (result.status) {
            this.setEmployee(result.data);
        }
        this.loader.finish();
    }

    async fetchAllEmployees() {
        this.loader.start();
        const result = await this.apiClient.get<IEmployee[]>(EMPLOYEES_ENDPOINT);
        if (result.status) {
            this.employees = result.data;
        }
        this.loader.finish();
    }

    async updateEmployee(employee: IEmployee) {
        this.loader.start();
        const result = await this.apiClient.put<IEmployee>(EMPLOYEES_ENDPOINT, employee);
        if (result.status) {
            this.employees = this.employees.map((n) => (n.id === result.data.id ? result.data : n));
            this.setEmployee(result.data);
            snackbarStore.showPositiveSnackbar("Изменения сохранены");
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось сохранить изменения");
        }
        this.loader.finish();
        return result;
    }

    async updateEmployeeWithoutLoader(newRequest: IEmployee, showSnackbar = true) {
        const result = await this.apiClient.put<IEmployee>(EMPLOYEES_ENDPOINT, newRequest);
        if (result.status) {
            this.setEmployee(result.data);
            if (showSnackbar) {
                snackbarStore.showPositiveSnackbar("Изменения сохранены");
            }
        } else {
            if (showSnackbar) {
                snackbarStore.showNegativeSnackbar("Не удалось сохранить изменения");
            }
        }
        return result;
    }

    async deleteEmployee(request: IEmployee, onDelete: () => void) {
        this.loader.start();
        const result = await this.apiClient.delete(EMPLOYEES_ENDPOINT, request.id);
        if (result.status) {
            snackbarStore.showPositiveSnackbar("Инспектор удалён");
            this.employee = null;
            onDelete();
        } else {
            snackbarStore.showNegativeSnackbar("Не удалось удалить инспектора");
        }
        this.loader.finish();
    }

    get filteredEmployees() {
        let employees = this.filterEmployees(this.filter.filterValues);
        employees = this.sortEmployees(employees);
        return employees;
    }

    filterEmployees(filter: Record<string, any>) {
        let employees = this.employees.slice();

        if (this.filter.search) {
            employees = employees.filter(
                (e) => this.filter.ilikeSearch(getFullName(e)) || this.filter.ilikeSearch(e.number),
            );
        }

        if (filter["status"]?.length) {
            employees = employees.filter((e) => {
                const values = filter["status"];
                return values.includes(
                    getEmployeeStatus(e, filter["date"] ? new Date(filter["date"]) : undefined),
                );
            });
        }
        if (filter["hasActiveRequest"]?.length) {
            employees = employees.filter((e) => {
                const r = this.getEmployeeActiveRequest(e);
                const values = filter["hasActiveRequest"];
                return values.includes(!!r);
            });
        }
        if (filter["location"]) {
            employees = employees.filter((e) => {
                return this.getEmployeeActiveRequest(e)
                    ? this.getStation(this.getEmployeeActiveRequest(e)!) === filter["location"]
                    : false;
            });
        }
        if (filter["area"]?.length) {
            employees = employees.filter((e) => {
                const values = filter["area"];
                return values.includes(e.area);
            });
        }
        if (filter["tags"]?.length) {
            employees = employees.filter((e) => {
                const values = filter["tags"];
                return values.some((v: string) => e.tags.includes(v));
            });
        }

        return employees;
    }

    sortEmployees(employees: IEmployee[]) {
        switch (this.filter.sort) {
            case "fullName-asc":
                return employees.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
            case "fullName-desc":
                return employees.sort((a, b) => getFullName(b).localeCompare(getFullName(a)));
            case "status-asc":
                return employees.sort((a, b) =>
                    getEmployeeStatus(a).localeCompare(getEmployeeStatus(b)),
                );
            case "status-desc":
                return employees.sort((a, b) =>
                    getEmployeeStatus(b).localeCompare(getEmployeeStatus(a)),
                );
        }
        return employees;
    }

    findById(id: number) {
        return this.employees.find((e) => e.id === id);
    }

    setEmployee(employee: IEmployee | null) {
        this.employee = employee;
    }

    findByUserId(userId: number) {
        return this.employees.find((e) => e.userId === userId);
    }

    getCurrentAuthenticatedEmployee() {
        if (store.account.currentUser?.id) {
            return this.findByUserId(store.account.currentUser?.id);
        }
    }

    clearEmployee() {
        this.loader.finish();
        this.setEmployee(null);
    }

    getEmployeeActiveRequest = (employee: IEmployee) => {
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
    };

    getStation = (request: IRequest) => {
        if (request.convoyStatus === "COMPLETE_CONVOY") {
            return request.info.arrivalStationId;
        }
        if (request.position) {
            return request.position;
        }
        return request.info.departureStationId;
    };
}
