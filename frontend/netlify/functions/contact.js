// frontend/netlify/functions/contact.js
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

  // Only allow POST method
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }

  try {
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    // Parse the incoming request body
    const { data } = JSON.parse(event.body);

    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Please fill in all required fields",
        }),
        headers: { "Access-Control-Allow-Origin": "*" },
      };
    }

    // Email notification to admin
    const adminEmail = {
      to: process.env.ADMIN_EMAIL, // Add this to your Netlify environment variables
      from: process.env.SENDGRID_VERIFIED_SENDER, // Add this to your Netlify environment variables
      subject: `New Contact Form Submission: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${data.name}</li>
            <li><strong>Email:</strong> ${data.email}</li>
            <li><strong>Phone:</strong> ${data.phone || "Not provided"}</li>
            <li><strong>Subject:</strong> ${data.subject}</li>
          </ul>
          <div style="margin-top: 20px;">
            <strong>Message:</strong>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
      `,
    };

    // Auto-reply to user
    const userEmail = {
      to: data.email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
      subject: "Thank you for contacting us",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for reaching out!</h2>
          <p>Dear ${data.name},</p>
          <p>We have received your message and appreciate you contacting us. Here's a copy of your submission:</p>
          
          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${data.message}</p>
          </div>
          
          <p>We will review your message and get back to you as soon as possible.</p>
          <p>Best regards,<br>Your Team Name</p>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([sgMail.send(adminEmail), sgMail.send(userEmail)]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Your message has been sent successfully!",
      }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "There was an error sending your message. Please try again.",
      }),
      headers: { "Access-Control-Allow-Origin": "*" },
    };
  }
};
