export default [
    "strapi::errors",
    {
        name: "strapi::cors",
        config: {
            origin: [
                "http://localhost:5173",
                "http://localhost:4000",
                "http://surveryform.nnmc.kz",
                "https://surveryform.nnmc.kz",
                "http://form008.nnmc.kz",
                "https://form008.nnmc.kz",
                "http://192.168.101.25:1114",
                "https://formtest.nnmc.kz",
            ],
            headers: "*",
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        },
    },
    "strapi::security",
    "strapi::poweredBy",
    "strapi::logger",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
];
