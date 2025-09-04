export default [
    "strapi::logger",
    "strapi::errors",
    "strapi::security",
    "strapi::cors",
    "strapi::poweredBy",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
    {
        name: "strapi::cors",
        config: {
            enabled: true,
            origin: ["https://192.168.101.25:4000"], // твой фронт
            headers: "*",
            methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        },
    },
];
