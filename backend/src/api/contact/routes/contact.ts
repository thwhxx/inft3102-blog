/**
 * contact router
 */

// import { factories } from '@strapi/strapi';

// export default factories.createCoreRouter('api::contact.contact');

export default {
  routes: [
    {
      method: "POST",
      path: "/contact",
      handler: "api::contact.contact.create",
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
