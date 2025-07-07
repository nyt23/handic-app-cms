/**
 * disability-card controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::disability-card.disability-card', ({ strapi }) => ({
  async me(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Try to find existing disability card for the user
      const disabilityCard = await strapi.entityService.findMany('api::disability-card.disability-card', {
        filters: {
          users_permissions_user: user.id
        },
        populate: '*'
      });

      if (disabilityCard && disabilityCard.length > 0) {
        const sanitizedEntity = await this.sanitizeOutput(disabilityCard[0], ctx);
        return this.transformResponse(sanitizedEntity);
      }

      // Return null if no disability card exists
      return ctx.send({ data: null });
    } catch (error) {
      return ctx.internalServerError('Error fetching disability card');
    }
  },

  async create(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Check if user already has a disability card
      const existingCard = await strapi.entityService.findMany('api::disability-card.disability-card', {
        filters: {
          users_permissions_user: user.id
        }
      });

      if (existingCard && existingCard.length > 0) {
        return ctx.badRequest('User already has a disability card');
      }

      // Add the user relation to the request body
      const data = {
        ...ctx.request.body.data,
        users_permissions_user: user.id
      };

      const entity = await strapi.entityService.create('api::disability-card.disability-card', {
        data,
        populate: '*'
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      return ctx.internalServerError('Error creating disability card');
    }
  },

  async update(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Check if the disability card belongs to the user
      const existingCard = await strapi.entityService.findOne('api::disability-card.disability-card', id, {
        populate: ['users_permissions_user']
      });

      if (!existingCard) {
        return ctx.notFound('Disability card not found');
      }

      if ((existingCard as any).users_permissions_user?.id !== user.id) {
        return ctx.forbidden('You can only update your own disability card');
      }

      // Add the user relation to the request body
      const data = {
        ...ctx.request.body.data,
        users_permissions_user: user.id
      };

      const entity = await strapi.entityService.update('api::disability-card.disability-card', id, {
        data,
        populate: '*'
      });

      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      return ctx.internalServerError('Error updating disability card');
    }
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Check if the disability card belongs to the user
      const existingCard = await strapi.entityService.findOne('api::disability-card.disability-card', id, {
        populate: ['users_permissions_user']
      });

      if (!existingCard) {
        return ctx.notFound('Disability card not found');
      }

      if ((existingCard as any).users_permissions_user?.id !== user.id) {
        return ctx.forbidden('You can only access your own disability card');
      }

      const sanitizedEntity = await this.sanitizeOutput(existingCard, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      return ctx.internalServerError('Error fetching disability card');
    }
  },

  async find(ctx) {
    const user = ctx.state.user;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Only return disability cards belonging to the authenticated user
      const disabilityCards = await strapi.entityService.findMany('api::disability-card.disability-card', {
        filters: {
          users_permissions_user: user.id
        },
        populate: '*'
      });

      const sanitizedEntities = await this.sanitizeOutput(disabilityCards, ctx);
      return this.transformResponse(sanitizedEntities);
    } catch (error) {
      return ctx.internalServerError('Error fetching disability cards');
    }
  },

  async delete(ctx) {
    const user = ctx.state.user;
    const { id } = ctx.params;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    try {
      // Check if the disability card belongs to the user
      const existingCard = await strapi.entityService.findOne('api::disability-card.disability-card', id, {
        populate: ['users_permissions_user']
      });

      if (!existingCard) {
        return ctx.notFound('Disability card not found');
      }

      if ((existingCard as any).users_permissions_user?.id !== user.id) {
        return ctx.forbidden('You can only delete your own disability card');
      }

      const entity = await strapi.entityService.delete('api::disability-card.disability-card', id);
      const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitizedEntity);
    } catch (error) {
      return ctx.internalServerError('Error deleting disability card');
    }
  }
}));
