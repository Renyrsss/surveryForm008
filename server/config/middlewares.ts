module.exports = ({ env }) => [
    "strapi::errors",
    "strapi::security",
    {
        name: "strapi::cors",
        config: {
            origin: ["https://localhost:4000"], // фронт, который будет обращаться
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            credentials: true,
        },
    },
    "strapi::poweredBy",
    "strapi::logger",
    "strapi::query",
    "strapi::body",
    "strapi::session",
    "strapi::favicon",
    "strapi::public",
];
