/**
 * blog-post controller
 */

import { factories } from "@strapi/strapi";
import { Context } from "koa";

export default factories.createCoreController(
  "api::blog-post.blog-post",
  ({ strapi }) => ({
    async find(ctx: Context) {
      try {
        // Call the default find method
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      } catch (error) {
        ctx.throw(500, error);
      }
    },

    async findOne(ctx: Context) {
      try {
        const { id } = ctx.params;

        // Add populate to include all fields
        const entity = await strapi.db
          .query("api::blog-post.blog-post")
          .findOne({
            where: { id },
            populate: ["tags", "slug"],
          });

        if (!entity) {
          return ctx.notFound("Post not found");
        }

        const sanitizedEntity = await this.sanitizeOutput(entity, ctx);
        return this.transformResponse(sanitizedEntity);
      } catch (error) {
        ctx.throw(500, error);
      }
    },
  })
);
