// frontend/netlify/functions/contact.js
const postmark = require("postmark");

exports.handler = async function (event, context) {
  const client = new postmark.ServerClient(
    "ef33bf76-6d49-473d-88bc-30979e6cdac5"
  );

  try {
    const data = JSON.parse(event.body);

    await client.sendEmail({
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

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
