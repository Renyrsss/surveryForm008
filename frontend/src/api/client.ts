import axios from "axios";

// Dev: /api (через vite proxy на localhost:1339)
// Prod: https://form008.nnmc.kz/api (Strapi на отдельном домене)
const baseURL = import.meta.env.PROD
    ? "https://form008.nnmc.kz/api"
    : "/api";

// Публичный API клиент (без токена) - для отправки формы и проверки PIN
export const publicApi = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Приватный API клиент (с токеном) - для админ-панели
const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Автоматически добавляем JWT токен из localStorage в каждый запрос
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
