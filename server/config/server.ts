export default ({ env }) => ({
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    app: {
        keys: env.array("APP_KEYS"),
    },
    url: "https://phone-marc-broadway-medium.trycloudflare.com/", // 👈 сюда твой cloudflare-домен
    allowedHosts: [
        ".trycloudflare.com", // 👈 можно сразу разрешить все *.trycloudflare.com
    ],
});
