import fs from "fs";
export default ({ env }) => ({
    host: env("HOST", "0.0.0.0"),
    port: env.int("PORT", 1337),
    url: "https://localhost:1339",
    app: { keys: env.array("APP_KEYS") }, // 👈 сюда твой cloudflare-домен
    allowedHosts: [
        ".trycloudflare.com", // 👈 можно сразу разрешить все *.trycloudflare.com
    ],

    ssl: {
        key: fs.readFileSync(
            "/home/hdadmin/nnmcsigndoc/client/localhost+2-key.pem"
        ),
        cert: fs.readFileSync(
            "/home/hdadmin/nnmcsigndoc/client/localhost+2.pem"
        ),
    },
});
