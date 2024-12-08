// frontend/netlify/functions/contact.js
const postmark = require("postmark");

exports.handler = async function (event, context) {
  // Add CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  // Handle preflight requests
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);
    console.log("Received data:", data);

    const client = new postmark.ServerClient(
      "ef33bf76-6d49-473d-88bc-30979e6cdac5"
    );

    const emailResult = await client.sendEmail({
      From: "anhthu.huynh@dcmail.ca",
      To: "adam.kunz+inft@durhamcollege.ca",
      Cc: "anhthu.huynh@dcmail.ca",
      Subject: `[Contact Form] ${data.subject}`,
      HtmlBody: `
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Message:</strong> ${data.message}</p>
      `,
      MessageStream: "outbound",
    });

    console.log("Email sent successfully:", emailResult);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Email sent successfully",
      }),
    };
  } catch (error) {
    console.error("Error in contact function:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error sending message",
        error: error.message,
      }),
    };
  }
};
