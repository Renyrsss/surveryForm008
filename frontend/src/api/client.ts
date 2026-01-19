import axios from "axios";

// Dev: /api (через vite proxy на localhost:1339)
// Prod: https://form008.nnmc.kz/api (Strapi на отдельном домене)
const baseURL = import.meta.env.PROD
    ? "https://form008.nnmc.kz/api"
    : "/api";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
