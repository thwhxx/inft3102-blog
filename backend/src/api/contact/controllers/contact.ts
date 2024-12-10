/**
 * contact controller
 */
import { factories } from "@strapi/strapi";
const mailchimp = require("@mailchimp/mailchimp_marketing");
const crypto = require("crypto");

export default factories.createCoreController(
  "api::contact.contact",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        // Create entry in Strapi first
        const response = await super.create(ctx);

        // Get the created entry data - notice the change here
        const contactData = response.data; // Removed .attributes

        // Configure Mailchimp
        mailchimp.setConfig({
          apiKey: process.env.MAILCHIMP_API_KEY,
          server: process.env.MAILCHIMP_SERVER_PREFIX,
        });

        try {
          // Generate MD5 hash of lowercase email address
          const subscriberHash = crypto
            .createHash("md5")
            .update(contactData.email.toLowerCase())
            .digest("hex");

          // Update or create Mailchimp subscriber
          const mailchimpResponse = await mailchimp.lists.setListMember(
            process.env.MAILCHIMP_LIST_ID,
            subscriberHash,
            {
              email_address: contactData.email,
              status_if_new: "subscribed",
              merge_fields: {
                FNAME: contactData.name,
                PHONE: contactData.phone,
              },
            }
          );

          console.log("Mailchimp response:", mailchimpResponse);

          return {
            data: contactData,
            meta: {
              message:
                "Contact form submitted and newsletter subscription updated",
            },
          };
        } catch (mailchimpError) {
          console.error(
            "Mailchimp Error:",
            mailchimpError.response?.text || mailchimpError
          );

          return {
            data: contactData,
            meta: {
              message:
                "Contact form submitted but newsletter subscription failed",
            },
          };
        }
      } catch (error) {
        console.error("Error details:", error);
        return ctx.badRequest(error);
      }
    },
  })
);
