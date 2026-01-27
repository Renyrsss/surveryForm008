/**
 * survey-config router
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::survey-config.survey-config", {
    config: {
        find: { auth: false },
        findOne: { auth: false },
    },
});
