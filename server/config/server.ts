const fs = require("fs");

module.exports = ({ env }) => ({
    host: "0.0.0.0",
    port: 1339,
    url: "https://192.168.101.25:1339",
    app: {
        keys: env.array("APP_KEYS"),
    },
    ssl: {
        key: fs.readFileSync(
            "/home/hdadmin/nnmcsigndoc/client/localhost+2-key.pem"
        ),
        cert: fs.readFileSync(
            "/home/hdadmin/nnmcsigndoc/client/localhost+2.pem"
        ),
    },
});
