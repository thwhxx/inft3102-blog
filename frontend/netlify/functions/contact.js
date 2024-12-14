const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Add console.log for debugging
  console.log('Received request:', event.body);

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      }
    };
  }

  try {
    // Log environment variables (remove in production)
    console.log('API Key exists:', !!process.env.SENDGRID_API_KEY);
    console.log('From email:', process.env.SENDGRID_FROM_EMAIL);
    
    // Set SendGrid API key
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { data } = JSON.parse(event.body);

    // Log parsed data
    console.log('Parsed data:', data);

    const msg = {
      to: data.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Thank you for your message',
      text: `Thank you for contacting us, ${data.name}. We'll get back to you soon.`,
      html: `<p>Thank you for contacting us, ${data.name}. We'll get back to you soon.</p>`
    };

    // Log message before sending
    console.log('Attempting to send email:', msg);

    await sgMail.send(msg);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ message: 'Message sent successfully' })
    };
  } catch (error) {
    // Log detailed error
    console.error('Function error details:', error);

    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: 'There was an error sending your message. Please try again.',
        error: error.message
      })
    };
  }
};