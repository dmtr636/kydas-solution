import { makeAutoObservable } from "mobx";
import axios from "axios";
import { AUTHENTICATE_ENDPOINT, LOGOUT_ENDPOINT } from "src/shared/api/endpoints.ts";
import { User } from "src/features/admin/users/types/User.ts";

export class AccountStore {
    currentUser: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async authenticate() {
        try {
            const response = await axios.get(AUTHENTICATE_ENDPOINT);
            this.setUser(response.data);
            return true;
        } catch (error) {
            return false;
        }
    }

    async logout() {
        await axios.post(LOGOUT_ENDPOINT);
        this.setUser(null);
    }

    setUser(user: User | null) {
        this.currentUser = user;
    }
}
