import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    await configureAuthenticatedUserPermissions(strapi);
  },
};

async function configureAuthenticatedUserPermissions(strapi: Core.Strapi) {
  try {
    // Find the 'Disabled Person' role
    const disabledPersonRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({
        where: { name: 'Disabled Person' },
        populate: ['permissions'],
      });

    if (!disabledPersonRole) {
      console.log("'Disabled Person' role not found. Please create it in the Strapi admin panel.");
      return;
    }

    // Configure permissions for the 'Disabled Person' role to access disability card and companion endpoints
    const permissionsToEnable = [
      'api::disability-card.disability-card.find',
      'api::disability-card.disability-card.findOne',
      'api::disability-card.disability-card.me',
      'api::disability-card.disability-card.create',
      'api::disability-card.disability-card.update',
      'api::disability-card.disability-card.delete',
      'api::companion.companion.find',
      'api::companion.companion.findOne',
      'api::companion.companion.create',
      'api::companion.companion.update',
      'api::companion.companion.delete',
    ];

    for (const permissionAction of permissionsToEnable) {
      const permission = disabledPersonRole.permissions.find(
        (p: any) => p.action === permissionAction
      );
      if (permission && !permission.enabled) {
        await strapi.query('plugin::users-permissions.permission').update({
          where: { id: permission.id },
          data: { enabled: true },
        });
        console.log(`Enabled permission: ${permissionAction}`);
      }
    }
    console.log("'Disabled Person' user permissions for disability cards configured successfully");
  } catch (error) {
    console.error('Error configuring Authenticated user permissions:', error);
  }
}
