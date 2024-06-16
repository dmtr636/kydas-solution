export interface IEvent {
    id: number;
    objectId: string | number | null;
    objectName: string;
    createDate: string;
    action: string;
    userId: number | null;
}
