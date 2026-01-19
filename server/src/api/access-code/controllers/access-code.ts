/**
 * access-code controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
    "api::access-code.access-code",
    ({ strapi }) => ({
        async verify(ctx) {
            const { code } = ctx.request.body ?? {};

            if (!code || typeof code !== "string") {
                return ctx.badRequest("Invalid code");
            }

            const entry = await strapi.db
                .query("api::access-code.access-code")
                .findOne({
                    where: { code, isActive: true },
                });

            if (!entry) {
                return ctx.unauthorized("Invalid or inactive code");
            }

            const now = new Date();
            if (entry.expiresAt && new Date(entry.expiresAt) < now) {
                return ctx.unauthorized("Expired code");
            }

            if (
                typeof entry.maxUses === "number" &&
                entry.usesCount >= entry.maxUses
            ) {
                return ctx.unauthorized("Code usage limit reached");
            }

            const nextUses = (entry.usesCount ?? 0) + 1;
            const shouldDeactivate =
                typeof entry.maxUses === "number" &&
                nextUses >= entry.maxUses;

            await strapi.db.query("api::access-code.access-code").update({
                where: { id: entry.id },
                data: {
                    usesCount: nextUses,
                    lastUsedAt: now,
                    isActive: shouldDeactivate ? false : entry.isActive,
                },
            });

            return { ok: true };
        },
    })
);
