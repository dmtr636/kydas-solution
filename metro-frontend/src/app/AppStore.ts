import { AccountStore } from "src/features/admin/account/stores/AccountStore.ts";
import { UserStore } from "src/features/admin/users/stores/UserStore.ts";
import { RequestStore } from "src/features/admin/requests/stores/RequestStore.ts";
import { WebsocketStore } from "src/features/admin/websocket/stores/WebsocketStore.ts";
import { NotificationStore } from "src/features/admin/notifications/stores/NotificationStore.ts";
import { StaffAppStore } from "src/features/staff-app/stores/StaffAppStore.ts";
import { EmployeeStore } from "src/features/admin/employees/stores/EmployeeStore.ts";
import { PassengerStore } from "src/features/admin/passengers/stores/passengerStore.ts";
import { StationsStore } from "src/features/admin/refs/stations/stores/StationsStore.ts";
import { AdminLayoutStore } from "src/features/admin/layout/store/AdminLayoutStore.ts";
import { EventStore } from "src/features/admin/events/stores/EventStore.ts";
import { DistributionStore } from "src/features/admin/distribution/stores/DistributionStore.ts";

export const store = {
    user: new UserStore(),
    account: new AccountStore(),
    request: new RequestStore(),
    staffApp: new StaffAppStore(),
    websocket: new WebsocketStore(),
    notification: new NotificationStore(),
    employee: new EmployeeStore(),
    passengers: new PassengerStore(),
    stations: new StationsStore(),
    adminLayout: new AdminLayoutStore(),
    event: new EventStore(),
    distribution: new DistributionStore(),
};
