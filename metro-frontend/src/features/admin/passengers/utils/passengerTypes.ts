export interface IPassengerTypes {
    id: number;
    fullName: string;
    phone: string;
    phoneDescription: string;
    phoneSecondary: string;
    phoneSecondaryDescription: string;
    sex: "male" | "female" | null;
    groupId: number | null;
    pacemaker: boolean;
    comment: string;
    createDate: string;
    updateDate: string;
    lockedEdit: boolean | null;
    age: number;
}
