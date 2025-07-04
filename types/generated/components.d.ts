import type { Schema, Struct } from '@strapi/strapi';

export interface CustomComponentAddress extends Struct.ComponentSchema {
  collectionName: 'components_custom_component_addresses';
  info: {
    displayName: 'Address';
    icon: 'pinMap';
  };
  attributes: {
    city: Schema.Attribute.String & Schema.Attribute.Required;
    country: Schema.Attribute.String & Schema.Attribute.Required;
    state: Schema.Attribute.String & Schema.Attribute.Required;
    street: Schema.Attribute.String & Schema.Attribute.Required;
    zipCode: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'custom-component.address': CustomComponentAddress;
    }
  }
}
