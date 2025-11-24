import sendEmail from "../config/sendEmail.js";
export const testSendEmail = async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await sendEmail({ to, subject, text, html });
    res.status(200).send("Email sent successfully!");
  } catch (err) {
    res.status(500).send(`Failed to send email: ${err}`);
  }
};
