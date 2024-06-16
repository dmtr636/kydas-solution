import { makeAutoObservable } from "mobx";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { LAYOUT_DATA_ENDPOINT } from "src/shared/api/endpoints.ts";

export interface LayoutData {
    videoLink: string | null;
    docsLink: string | null;
    contactLink: string | null;
}

export class AdminLayoutStore {
    layoutData: LayoutData | null = null;
    apiClient = new ApiClient();

    constructor() {
        makeAutoObservable(this);
    }

    async fetchLayoutData() {
        const response = await this.apiClient.get<LayoutData>(LAYOUT_DATA_ENDPOINT);
        if (response.status) {
            this.setLayoutData(response.data);
        }
    }

    setLayoutData(data: LayoutData) {
        this.layoutData = data;
    }
}
