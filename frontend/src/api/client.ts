import axios from "axios";

// В dev: /api (проксируется через vite)
// В prod: /server/api (Strapi под /server)
const baseURL = import.meta.env.PROD ? "/server/api" : "/api";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;
