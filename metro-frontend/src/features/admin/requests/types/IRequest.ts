import { requestStatuses } from "src/features/admin/requests/constants/requestStatuses.ts";

export interface IAssignedEmployee {
    employeeId: number;
    responsible: boolean;
    assignedManually: boolean;
}

export interface IRequest {
    position: number;
    route: number[];
    id: string;
    number: number;
    passengerId: number | null;
    info: {
        fullName: string;
        phone: string;
        phoneDescription: string | null;
        phoneSecondary: string | null;
        phoneSecondaryDescription: string | null;
        email: string | null;
        age: number | null;
        sex: string | null;
        tripDate: string;
        tripDateEnd: string;
        departureStationId: number;
        arrivalStationId: number;
        meetingPoint: string;
        groupId: number | null;
        wheelchairRequired: boolean;
        hasBaggage: boolean;
        lightBaggage: boolean | null;
        mediumBaggage: boolean | null;
        baggageDescription: string | null;
        baggageWeight: string | null;
        baggageHelpRequired: boolean | null;
        pacemaker: boolean;
        comment: string | null;
        strollerDescription: string | null;
    };
    createDate: string;
    updateDate: string;
    status: keyof typeof requestStatuses;
    convoyStatus:
        | "INSPECTOR_DISPATCHED"
        | "INSPECTOR_ON_SITE"
        | "TRIP"
        | "COMPLETE_CONVOY"
        | "ACCEPTED"
        | "PASSENGER_LATE"
        | "INSPECTOR_LATE"
        | null;
    cancelReason: string | null;
    lockedEdit: boolean | null;
    inspectorMaleCount: number | null;
    inspectorFemaleCount: number | null;
    assignedEmployees: IAssignedEmployee[] | null;
    fromSite: boolean | null;
    tripDuration: string | null;
    routeTransferTime: number[];
    needReschedule: boolean | null;
}
