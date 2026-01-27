import type { Core } from '@strapi/strapi';
import { surveyJsonRu } from './seed/surveyRu';

export default {
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const existing = await strapi.documents('api::survey-config.survey-config').findMany({
      limit: 1,
    });

    if (existing.length > 0) {
      return;
    }

    strapi.log.info('Seeding survey config...');

    await strapi.documents('api::survey-config.survey-config').create({
      data: {
        title: 'Опрос пациентов',
        locale: 'ru',
        schema: surveyJsonRu,
        isActive: true,
        version: '1.0',
      },
    });

    strapi.log.info('Survey config seeded successfully.');
  },
};
