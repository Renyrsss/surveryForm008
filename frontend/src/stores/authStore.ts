import { makeAutoObservable } from "mobx";
import api from "../api/client";

class AuthStore {
    token: string | null = null;
    user: { username: string; email: string } | null = null;
    isLoading = false;
    error: string | null = null;

    constructor() {
        makeAutoObservable(this);
        this.loadFromStorage();
    }

    private loadFromStorage() {
        const token = localStorage.getItem("adminToken");
        const user = localStorage.getItem("adminUser");
        if (token && user) {
            this.token = token;
            this.user = JSON.parse(user);
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
    }

    get isAuthenticated() {
        return !!this.token;
    }

    async login(identifier: string, password: string) {
        this.isLoading = true;
        this.error = null;

        try {
            const res = await api.post("/auth/local", { identifier, password });
            const { jwt, user } = res.data;

            this.token = jwt;
            this.user = { username: user.username, email: user.email };

            localStorage.setItem("adminToken", jwt);
            localStorage.setItem("adminUser", JSON.stringify(this.user));
            api.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;

            return true;
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: { message?: string } } } };
            this.error = error.response?.data?.error?.message || "Ошибка авторизации";
            return false;
        } finally {
            this.isLoading = false;
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        delete api.defaults.headers.common["Authorization"];
    }
}

export default new AuthStore();
