const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAlertEmail = async ({ to, itemName, batchNumber, thresholdAge }) => {
  const mailOptions = {
    from: `"SmartStock Alerts" <${process.env.EMAIL_USER}>`,
    to,
    subject: `⚠️ Alert: ${itemName} threshold age exceeded`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px;">
          <h2 style="color: #d9534f;">⚠️ Stock Alert: Threshold Age Exceeded</h2>
          <p>Dear User,</p>
          <p>The following stock item has exceeded its threshold age:</p>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Item Name:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${itemName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Batch Number:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${batchNumber}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;"><strong>Threshold Age:</strong></td>
              <td style="padding: 8px; border: 1px solid #ddd;">${thresholdAge} days</td>
            </tr>
          </table>

          <p style="color: #555;">Please take the necessary actions to handle this stock.</p>

          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #888;">SmartStock Alert System • ${new Date().toLocaleDateString()}</p>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📬 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
};

module.exports = sendAlertEmail;
