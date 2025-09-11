export default [
    "strapi::errors",
    {
        name: "strapi::cors",
        config: {
            enabled: true,
            origin: [
                "http://kdu.projects.nnmc.kz",
                "https://kdu.projects.nnmc.kz",
                "http://192.168.101.25:4000",
                "http://localhost:4000",
                "http://form008.projects.nnmc.kz",
                "https://form008.projects.nnmc.kz",
                "http://192.168.101.25:1113",
                "http://192.168.101.25:1114",
                "http://localhost:1113",
                "http://localhost:1114",
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
//asdfa;slkfjsa;dlf
