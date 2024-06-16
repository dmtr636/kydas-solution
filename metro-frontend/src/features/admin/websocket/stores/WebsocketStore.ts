import { makeAutoObservable } from "mobx";
import { Client } from "@stomp/stompjs";
import { DEBUG, domain } from "src/shared/config/domain.ts";
import { store } from "src/app/AppStore.ts";
import { throttle } from "src/shared/utils/throttle.ts";

export interface IWebsocketEvent {
    type: "CREATE" | "UPDATE" | "DELETE";
    objectName: string;
    data: any;
}

export class WebsocketStore {
    stompClient: Client | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    connectToSocket() {
        const host = domain.split("://")[1];
        this.stompClient = new Client({
            brokerURL: `ws${DEBUG ? "" : "s"}://${host}/api/events/ws`,
        });

        this.stompClient.onConnect = () => {
            this.stompClient?.subscribe("/topic/events", (message) => {
                const event = JSON.parse(message.body) as IWebsocketEvent;
                if (event.objectName === "request") {
                    if (event.type === "CREATE") {
                        store.request.requests.push(event.data);
                    }
                    if (event.type === "UPDATE") {
                        store.request.requests = store.request.requests.map((r) =>
                            r.id === event.data.id ? event.data : r,
                        );
                        if (store.request.request && store.request.request.id === event.data.id) {
                            store.request.request = {
                                ...store.request.request,
                                ...event.data,
                            };
                        }
                    }
                    if (event.type === "DELETE") {
                        store.request.requests = store.request.requests.filter(
                            (r) => r.id !== event.data.id,
                        );
                    }
                }
                if (event.objectName === "employee") {
                    if (event.type === "CREATE") {
                        store.employee.employees.push(event.data);
                    }
                    if (event.type === "UPDATE") {
                        store.employee.employees = store.employee.employees.map((r) =>
                            r.id === event.data.id ? event.data : r,
                        );
                        if (
                            store.employee.employee &&
                            store.employee.employee.id === event.data.id
                        ) {
                            store.employee.employee = {
                                ...store.employee.employee,
                                ...event.data,
                            };
                        }
                    }
                    if (event.type === "DELETE") {
                        store.employee.employees = store.employee.employees.filter(
                            (r) => r.id !== event.data.id,
                        );
                    }
                }
                if (event.objectName === "passenger") {
                    if (event.type === "CREATE") {
                        store.passengers.requests.push(event.data);
                    }
                    if (event.type === "UPDATE") {
                        store.passengers.requests = store.passengers.requests.map((r) =>
                            r.id === event.data.id ? event.data : r,
                        );
                        if (
                            store.passengers.request &&
                            store.passengers.request.id === event.data.id
                        ) {
                            store.passengers.request = {
                                ...store.passengers.request,
                                ...event.data,
                            };
                        }
                    }
                    if (event.type === "DELETE") {
                        store.passengers.requests = store.passengers.requests.filter(
                            (r) => r.id !== event.data.id,
                        );
                    }
                }
                if (event.objectName === "notification") {
                    if (event.type === "CREATE") {
                        store.notification.notifications.push(event.data);
                    }
                }
                if (event.objectName === "event") {
                    if (event.type === "CREATE") {
                        store.event.events.push(event.data);
                    }
                }
            });
        };

        this.stompClient.onWebSocketError = (error) => {
            console.error("Error with websocket", error);
        };

        this.stompClient.onStompError = (frame) => {
            console.error("Broker reported error: " + frame.headers["message"]);
            console.error("Additional details: " + frame.body);
        };

        this.stompClient.activate();
    }

    updateNotifications = throttle(() => {
        store.notification.fetchAllNotifications();
    }, 3000);

    closeSocket() {
        this.stompClient?.deactivate();
    }
}
