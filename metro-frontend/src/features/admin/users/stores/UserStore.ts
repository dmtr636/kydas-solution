import { makeAutoObservable } from "mobx";
import { User } from "../types/User.ts";
import axios from "axios";
import { USERS_ENDPOINT } from "src/shared/api/endpoints.ts";
import { UserAddFormValues } from "../types/UserAddFormValues.ts";
import { userSortOptions } from "../constants/userSortOptions.ts";
import { ApiClient } from "src/shared/api/ApiClient.ts";
import { userExceptionCodeLocale } from "src/features/admin/users/constants/userErrorLocale.ts";

export class UserStore {
    users: User[] = [];
    search = "";
    sort = userSortOptions[0].value;
    loading = false;
    apiClient = new ApiClient({
        exceptionCodeLocalization: userExceptionCodeLocale,
    });
    tab = "all";

    constructor() {
        makeAutoObservable(this);
    }

    async fetchUsers() {
        this.setLoading(true);
        const response = await axios.get(USERS_ENDPOINT);
        this.setUsers(response.data);
        this.setLoading(false);
    }

    async createUser(userFormValues: UserAddFormValues) {
        this.setLoading(true);
        const response = await this.apiClient.post<User>(USERS_ENDPOINT, userFormValues);
        if (response.status) {
            this.addUser(response.data);
        }
        this.setLoading(false);
        return response;
    }

    async updateUser(user: User) {
        this.setLoading(true);
        const response = await this.apiClient.put<User>(USERS_ENDPOINT, user);
        if (response.status) {
            this.setUser(response.data);
        }
        this.setLoading(false);
        return response;
    }

    async deleteUser(user: User) {
        this.setLoading(true);
        const response = await this.apiClient.delete(USERS_ENDPOINT, user.id);
        if (response.status) {
            this.setUsers(this.users.filter((_user) => _user.id !== user.id));
        }
        this.setLoading(false);
        return response;
    }

    get filteredUsers() {
        let users = this.users.filter((u) => u.role !== "EMPLOYEE");
        if (this.search) {
            users = users.filter(
                (user) =>
                    user.email.toLowerCase().includes(this.search.toLowerCase().trim()) ||
                    user.name?.toLowerCase().includes(this.search.toLowerCase().trim()),
            );
        } else {
            if (this.tab === "administrator") {
                users = users.filter((u) => u.role === "ROOT" || u.role === "ADMIN");
            }
            if (this.tab === "specialist") {
                users = users.filter((u) => u.role === "SPECIALIST");
            }
            if (this.tab === "operator") {
                users = users.filter((u) => u.role === "OPERATOR");
            }
            if (this.tab === "employee") {
                users = users.filter((u) => u.role === "EMPLOYEE");
            }
        }
        users = users.slice().sort((a, b) => {
            if (this.sort === "asc") {
                return a.id - b.id;
            } else {
                return b.id - a.id;
            }
        });
        return users;
    }

    setLoading(loading: boolean) {
        this.loading = loading;
    }

    setUser(newUser: User) {
        const currentUserIndex = this.users.findIndex((user) => user.id === newUser.id);
        this.users[currentUserIndex] = newUser;
    }

    setUsers(users: User[]) {
        this.users = users;
    }

    addUser(user: User) {
        this.users.push(user);
    }

    setSearch(search: string) {
        this.search = search;
    }

    setSort(value: string) {
        this.sort = value;
    }

    getById(id: number) {
        return this.users.find((u) => u.id === id);
    }
}
