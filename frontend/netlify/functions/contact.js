const sgMail = require("@sendgrid/mail");

exports.handler = async (event, context) => {
  // Handle CORS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }

  try {
    // Set SendGrid API key from environment variable
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { data } = JSON.parse(event.body);

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Name, email, and message are required",
        }),
        headers: { "Access-Control-Allow-Origin": "*" },
      };
    }

    // Prepare email to admin
    const adminMail = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: `New Contact Form Submission: ${data.subject || "No Subject"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${data.subject || "Not provided"}</p>
        <p><strong>Message:</strong><br>${data.message}</p>
      `,
    };

    // Prepare auto-reply email
    const autoReply = {
      to: data.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Thank you for your message",
      html: `
        <p>Dear ${data.name},</p>
        <p>Thank you for contacting us. We have received your message and will get back to you soon.</p>
        <p>Best regards,<br>Anh Thu Huynh</p>
      `,
    };

    // Send both emails
    await Promise.all([sgMail.send(adminMail), sgMail.send(autoReply)]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Your message has been sent successfully!",
      }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There was an error sending your message. Please try again.",
      }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }
};
