/**
 * disability-card router
 */

export default {
  routes: [
    {
      method: 'GET',
      path: '/disability-cards/me',
      handler: 'disability-card.me',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'GET',
      path: '/disability-cards',
      handler: 'disability-card.find',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'GET',
      path: '/disability-cards/:id',
      handler: 'disability-card.findOne',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'POST',
      path: '/disability-cards',
      handler: 'disability-card.create',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'PUT',
      path: '/disability-cards/:id',
      handler: 'disability-card.update',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        auth: {
          scope: ['authenticated']
        }
      }
    },
    {
      method: 'DELETE',
      path: '/disability-cards/:id',
      handler: 'disability-card.delete',
      config: {
        policies: [
          { name: 'global::is-role', config: { role: 'Disabled Person' } }
        ],
        auth: {
          scope: ['authenticated']
        }
      }
    }
  ]
};
