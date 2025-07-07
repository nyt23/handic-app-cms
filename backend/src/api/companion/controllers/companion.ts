/**
 * companion controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::companion.companion', ({ strapi }) => ({
  async find(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    // Only return companions belonging to the authenticated user
    const companions = await strapi.entityService.findMany('api::companion.companion', {
      filters: {
        users_permissions_user: user.id
      },
      populate: '*',
      sort: { createdAt: 'desc' }
    });

    return { data: companions };
  },

  async findOne(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    // Check if the companion belongs to the current user
    const existingCompanion = await strapi.entityService.findOne('api::companion.companion', id, {
      populate: ['users_permissions_user']
    }) as any;

    if (!existingCompanion || existingCompanion.users_permissions_user?.id !== user.id) {
      return ctx.forbidden('You can only access your own companions');
    }

    return { data: existingCompanion };
  },

  async findMyCompanions(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    const companions = await strapi.entityService.findMany('api::companion.companion', {
      filters: {
        users_permissions_user: user.id
      },
      populate: '*',
      sort: { createdAt: 'desc' }
    });

    return { data: companions };
  },

  async create(ctx) {
    const { user } = ctx.state;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    // Add the current user to the companion data
    ctx.request.body.data.users_permissions_user = user.id;

    const result = await strapi.entityService.create('api::companion.companion', {
      data: ctx.request.body.data,
      populate: '*'
    });

    return { data: result };
  },

  async update(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    // Check if the companion belongs to the current user
    const existingCompanion = await strapi.entityService.findOne('api::companion.companion', id, {
      populate: ['users_permissions_user']
    }) as any;

    if (!existingCompanion || existingCompanion.users_permissions_user?.id !== user.id) {
      return ctx.forbidden('You can only update your own companions');
    }

    const result = await strapi.entityService.update('api::companion.companion', id, {
      data: ctx.request.body.data,
      populate: '*'
    });

    return { data: result };
  },

  async delete(ctx) {
    const { user } = ctx.state;
    const { id } = ctx.params;
    
    if (!user) {
      return ctx.unauthorized('User not authenticated');
    }

    // Check if the companion belongs to the current user
    const existingCompanion = await strapi.entityService.findOne('api::companion.companion', id, {
      populate: ['users_permissions_user']
    }) as any;

    if (!existingCompanion || existingCompanion.users_permissions_user?.id !== user.id) {
      return ctx.forbidden('You can only delete your own companions');
    }

    const result = await strapi.entityService.delete('api::companion.companion', id);
    return { data: result };
  }
}));
