export default {
    routes: [
        {
            method: "POST",
            path: "/access-codes/verify",
            handler: "access-code.verify",
            config: {
                auth: false,
            },
        },
    ],
};
