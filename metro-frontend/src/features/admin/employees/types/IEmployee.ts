export interface IEmployee {
    id: number;
    userId: number;
    lastName: string;
    firstName: string;
    patronymic: string;
    sex: string;
    phone: string;
    phonePersonal: string;
    area: string;
    shift: string;
    position: string;
    tags: string[];
    schedule: IEmployeeSchedule[];
    number: string;
    supervisor: string;
    lockedEdit: boolean | null;
    email: string | null;

    timeWorkStart1: string | null;
    timeWorkEnd1: string | null;
    timeWorkStart2: string | null;
    timeWorkEnd2: string | null;
    timeWorkStart3: string | null;
    timeWorkEnd3: string | null;
    timeWorkStart4: string | null;
    timeWorkEnd4: string | null;
    timeWorkStart5: string | null;
    timeWorkEnd5: string | null;
    timeWorkStart6: string | null;
    timeWorkEnd6: string | null;
    timeWorkStart7: string | null;
    timeWorkEnd7: string | null;
    timeLunch1: string | null;
    timeLunch2: string | null;
    timeLunch3: string | null;
    timeLunch4: string | null;
    timeLunch5: string | null;
    timeLunch6: string | null;
    timeLunch7: string | null;
}

export interface IEmployeeSchedule {
    dateStart: string;
    dateEnd: string;
    event: string;
}
