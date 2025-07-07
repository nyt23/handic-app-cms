/**
 * companion router
 */

export default {
  routes: [
    // Default CRUD routes
    {
      method: 'GET',
      path: '/companions',
      handler: 'companion.find',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'GET',
      path: '/companions/:id',
      handler: 'companion.findOne',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'POST',
      path: '/companions',
      handler: 'companion.create',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'PUT',
      path: '/companions/:id',
      handler: 'companion.update',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'DELETE',
      path: '/companions/:id',
      handler: 'companion.delete',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    // Custom route for getting user's companions
    {
      method: 'GET',
      path: '/companions/me',
      handler: 'companion.findMyCompanions',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        middlewares: [],
        auth: {
          scope: ['authenticated']
        }
      }
    }
  ]
};
