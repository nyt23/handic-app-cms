/**
 * event controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::event.event', ({ strapi }) => ({
  async findOne(ctx) {
    const { id } = ctx.params;
    const { locale } = ctx.query;
    
    try {
      const entity = await strapi.entityService.findOne('api::event.event', id, {
        populate: '*',
        locale: locale || 'en'
      });
      
      if (!entity) {
        return ctx.notFound('Event not found');
      }
      
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      return ctx.notFound('Event not found');
    }
  }
}));
