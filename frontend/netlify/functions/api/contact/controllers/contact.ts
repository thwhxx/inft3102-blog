import { factories } from "@strapi/strapi";
const sgMail = require("@sendgrid/mail");

export default factories.createCoreController(
  "api::contact.contact",
  ({ strapi }) => ({
    async create(ctx) {
      try {
        // Create entry in Strapi first
        const response = await super.create(ctx);
        const contactData = response.data;

        // Configure SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        try {
          // Prepare admin notification email
          const adminMsg = {
            to: "dalthiennhanontop@gmail.com",
            from: "dalthiennhanontop@gmail.com",
            subject: `New Contact Form Submission: ${contactData.subject}`,
            html: `
              <h2>New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Phone:</strong> ${contactData.phone || "Not provided"}</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${contactData.message}</p>
            `,
          };

          // Prepare user confirmation email
          const userMsg = {
            to: contactData.email,
            from: "dalthiennhanontop@gmail.com",
            subject: "Thank you for contacting us",
            html: `
              <h2>Thank you for contacting us</h2>
              <p>Dear ${contactData.name},</p>
              <p>We have received your message and will get back to you as soon as possible.</p>
              <p>Here's a copy of your message:</p>
              <p><strong>Subject:</strong> ${contactData.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${contactData.message}</p>
              <p>Best regards,<br>Your Team</p>
            `,
          };

          console.log("Attempting to send emails...");

          // Send both emails
          await Promise.all([sgMail.send(adminMsg), sgMail.send(userMsg)]);

          console.log("Emails sent successfully");

          return {
            data: contactData,
            meta: {
              message: "Contact form submitted and emails sent successfully",
            },
          };
        } catch (emailError) {
          console.error("Failed to send emails:", emailError);
          if (emailError.response) {
            console.error(emailError.response.body);
          }
          return {
            data: contactData,
            meta: {
              message: "Contact form submitted but email sending failed",
              error: emailError.message,
            },
          };
        }
      } catch (error) {
        console.error("Error creating contact entry:", error);
        return ctx.badRequest(error);
      }
    },
  })
);
