import axios from "axios";

// Dev: /api (через vite proxy на localhost:1339)
// Prod: /server/api (Strapi под /server)
const baseURL = import.meta.env.PROD ? "/server/api" : "/api";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
