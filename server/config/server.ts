const fs = require("fs");
const path = require("path");

module.exports = ({ env }) => ({
    host: "0.0.0.0",
    port: 1339,
    url: "https://192.168.101.25:1339",
    app: {
        keys: env.array("APP_KEYS"),
    },
    ssl: {
        key: fs.readFileSync(
            path.join("/home/hdadmin/certs/localhost+2-key.pem")
        ),
        cert: fs.readFileSync(path.join("/home/hdadmin/certs/localhost+2.pem")),
    },
});
