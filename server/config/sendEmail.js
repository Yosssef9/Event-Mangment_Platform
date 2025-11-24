import Brevo from "@getbrevo/brevo";

const brevoApi = new Brevo.TransactionalEmailsApi();
brevoApi.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const emailData = {
      sender: { email: process.env.EMAIL_SENDER }, // ex: no-reply@yourdomain.com or your gmail
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html,
    };

    const result = await brevoApi.sendTransacEmail(emailData);
    console.log("Email sent:", result);
    return result;
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
};

export default sendEmail;
