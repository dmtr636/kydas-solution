import { Status } from "src/ui/components/info/Status/Status.tsx";
import { IEmployee } from "src/features/admin/employees/types/IEmployee.ts";
import { employeeStatuses } from "src/features/admin/employees/constants/employeeStatuses.ts";

export const isTodayBetweenDates = (startDateStr: string, endDateStr: string, date: Date) => {
    function normalizeDate(date: Date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    const [startDay, startMonth, startYear] = startDateStr.split(".").map(Number);
    const [endDay, endMonth, endYear] = endDateStr.split(".").map(Number);

    const startDate = normalizeDate(new Date(startYear, startMonth - 1, startDay));
    const endDate = normalizeDate(new Date(endYear, endMonth - 1, endDay));
    const today = normalizeDate(date);

    return today >= startDate && today <= endDate;
};

export const getEmployeeStatus = (
    employee: IEmployee,
    date: Date = new Date(),
): keyof typeof employeeStatuses => {
    if (
        employee.schedule.some(
            (item) =>
                isTodayBetweenDates(item.dateStart, item.dateEnd, date) && item.event === "DAY_OFF",
        )
    ) {
        return "DAY_OFF";
    }
    if (
        employee.schedule.some(
            (item) =>
                isTodayBetweenDates(item.dateStart, item.dateEnd, date) &&
                item.event === "VACATION",
        )
    ) {
        return "VACATION";
    }
    if (
        employee.schedule.some(
            (item) =>
                isTodayBetweenDates(item.dateStart, item.dateEnd, date) &&
                item.event === "SICK_LEAVE",
        )
    ) {
        return "SICK_LEAVE";
    }
    if (
        employee.schedule.some(
            (item) =>
                isTodayBetweenDates(item.dateStart, item.dateEnd, date) && item.event === "STUDY",
        )
    ) {
        return "STUDY";
    }

    const currentDay = date.getDay();
    const currentTime = date.toTimeString().slice(0, 5);

    const timeWorkStarts = [
        employee.timeWorkStart1,
        employee.timeWorkStart2,
        employee.timeWorkStart3,
        employee.timeWorkStart4,
        employee.timeWorkStart5,
        employee.timeWorkStart6,
        employee.timeWorkStart7,
    ];

    const timeWorkEnds = [
        employee.timeWorkEnd1,
        employee.timeWorkEnd2,
        employee.timeWorkEnd3,
        employee.timeWorkEnd4,
        employee.timeWorkEnd5,
        employee.timeWorkEnd6,
        employee.timeWorkEnd7,
    ];

    const startTimeYesterday = timeWorkStarts.slice(currentDay - 2)[0];
    const endTimeYesterday = timeWorkEnds.slice(currentDay - 2)[0];

    const startTime = timeWorkStarts.slice(currentDay - 1)[0];
    const endTime = timeWorkEnds.slice(currentDay - 1)[0];

    if (
        (!startTime || !endTime) &&
        (!startTimeYesterday || !endTimeYesterday || startTimeYesterday < endTimeYesterday)
    ) {
        return "DAY_OFF";
    }

    if (startTime && endTime && currentTime >= startTime && currentTime <= endTime) {
        return "WORKING";
    }

    if (startTime && endTime && endTime < startTime && currentTime >= startTime) {
        return "WORKING";
    }

    if (
        startTimeYesterday &&
        endTimeYesterday &&
        startTimeYesterday > endTimeYesterday &&
        currentTime < endTimeYesterday
    ) {
        return "WORKING";
    }

    if (!startTime || !endTime) {
        return "DAY_OFF";
    }

    const shiftStart = new Date(date.getTime());
    const [startHour, startMinute] = startTime.split(":").map(Number);
    shiftStart.setHours(startHour, startMinute, 0, 0);

    const shiftEnd = new Date(date.getTime());
    const [endHour, endMinute] = endTime.split(":").map(Number);
    shiftEnd.setHours(endHour, endMinute, 0, 0);

    const now = new Date(date.getTime());

    if (now < shiftStart) {
        return "SHIFT_SOON";
    }

    if (now > shiftEnd) {
        return "SHIFT_END";
    }

    return "DAY_OFF";
};

export const EmployeeStatus = (props: { employee: IEmployee; date?: Date }) => {
    const getStatusMode = (status: keyof typeof employeeStatuses) => {
        if (status === "SHIFT_SOON") {
            return "warning";
        }
        if (status === "WORKING") {
            return "accent";
        }
        return "negative";
    };

    return (
        <Status mode={getStatusMode(getEmployeeStatus(props.employee, props.date))} size={"small"}>
            {employeeStatuses[getEmployeeStatus(props.employee, props.date)]}
        </Status>
    );
};
