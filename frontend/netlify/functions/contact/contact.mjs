const postmark = require("postmark");

exports.handler = async function (event, context) {
  console.log("🚀 Function started");
  console.log("📨 Request body:", event.body);

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const data = JSON.parse(event.body);
    console.log("📝 Parsed data:", data);

    const client = new postmark.ServerClient(
      "ef33bf76-6d49-473d-88bc-30979e6cdac5"
    );
    console.log("✨ Postmark client created");

    await client.sendEmail({
      From: "anhthu.huynh@dcmail.ca",
      To: "adam.kunz+inft@durhamcollege.ca",
      Cc: "anhthu.huynh@dcmail.ca",
      Subject: `[Contact Form] ${data.subject}`,
      TextBody: `
        Name: ${data.name}
        Email: ${data.email}
        Phone: ${data.phone}
        Message: ${data.message}
      `,
      MessageStream: "outbound",
    });

    console.log("✅ Email sent successfully");

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Thanks for reaching out. We'll get back to you soon!",
      }),
    };
  } catch (error) {
    console.error("❌ Error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Error sending message: " + error.message,
      }),
    };
  }
};
