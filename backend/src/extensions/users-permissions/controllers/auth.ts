export default {
  async callback(ctx) {
    console.log("Custom auth controller called");

    // Call the default callback logic and get the response
    const defaultAuthController = strapi.plugin('users-permissions').controllers.auth;
    await defaultAuthController.callback(ctx, undefined);

    // result is sent via ctx.body, so get the user and jwt from ctx.body
    const { user, jwt } = ctx.body || {};

    if (!user) {
      // If login failed, return the result as is
      return;
    }

    // Fetch the user with the role relation populated
    const userWithRole = await strapi.entityService.findOne(
      'plugin::users-permissions.user',
      user.id,
      { populate: ['role'] }
    );

    ctx.body = {
      jwt,
      user: userWithRole,
    };
  },

  async register(ctx) {
    console.log("Custom register controller called");

    // Call the default register logic
    const defaultAuthController = strapi.plugin('users-permissions').controllers.auth;
    await defaultAuthController.register(ctx, undefined);

    // Get the user from the response
    const { user, jwt } = ctx.body || {};

    if (!user) {
      // If registration failed, return the result as is
      return;
    }

    try {
      // Find the "Disabled Person" role
      const disabledPersonRole = await strapi.entityService.findMany('plugin::users-permissions.role', {
        filters: {
          name: 'Disabled Person'
        }
      });

      if (disabledPersonRole && disabledPersonRole.length > 0) {
        // Assign the "Disabled Person" role to the new user
        await strapi.entityService.update('plugin::users-permissions.user', user.id, {
          data: {
            role: disabledPersonRole[0].id
          }
        });

        console.log(`Assigned "Disabled Person" role to user ${user.username}`);
        console.log(`Role ID: ${disabledPersonRole[0].id}`);
        console.log(`Role Name: ${disabledPersonRole[0].name}`);
      } else {
        console.warn('Could not find "Disabled Person" role');
        console.log('Available roles:');
        const allRoles = await strapi.entityService.findMany('plugin::users-permissions.role');
        allRoles.forEach(role => {
          console.log(`   - ${role.name} (ID: ${role.id})`);
        });
      }

      // Fetch the updated user with the role relation populated
      const userWithRole = await strapi.entityService.findOne(
        'plugin::users-permissions.user',
        user.id,
        { populate: ['role'] }
      );

      ctx.body = {
        jwt,
        user: userWithRole,
      };
    } catch (error) {
      console.error('Error assigning role to user:', error);
      // Return the original response if role assignment fails
    }
  },
}; 