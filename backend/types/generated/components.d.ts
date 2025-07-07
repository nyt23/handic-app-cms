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

export interface CustomComponentContactData extends Struct.ComponentSchema {
  collectionName: 'components_custom_component_contact_data';
  info: {
    displayName: 'Contact Data';
    icon: 'user';
  };
  attributes: {
    address: Schema.Attribute.Component<'custom-component.address', false>;
    email: Schema.Attribute.String;
    firstName: Schema.Attribute.String & Schema.Attribute.Required;
    lastName: Schema.Attribute.String & Schema.Attribute.Required;
    phone: Schema.Attribute.String;
  };
}

export interface CustomComponentOpeningHours extends Struct.ComponentSchema {
  collectionName: 'components_custom_component_opening_hours';
  info: {
    displayName: 'Opening Hours';
    icon: 'clock';
  };
  attributes: {
    close: Schema.Attribute.Time;
    day: Schema.Attribute.Enumeration<
      [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ]
    >;
    start: Schema.Attribute.Time;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'custom-component.address': CustomComponentAddress;
      'custom-component.contact-data': CustomComponentContactData;
      'custom-component.opening-hours': CustomComponentOpeningHours;
    }
  }
}
