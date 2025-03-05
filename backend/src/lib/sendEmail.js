import nodemailer from "nodemailer";

export const sendEmail = async (email, subject, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Library Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
              body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f8f5f2;
                  margin: 0;
                  padding: 0;
                  text-align: center;
              }
              .container {
                  max-width: 600px;
                  margin: 30px auto;
                  background: #ffffff;
                  padding: 25px;
                  border-radius: 10px;
                  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
              }
              .logo {
                  width: 120px;
                  margin-bottom: 15px;
              }
              .title {
                  color: #e67e22;
                  font-size: 22px;
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .message {
                  font-size: 16px;
                  color: #4a4a4a;
                  line-height: 1.6;
                  margin: 20px 0;
              }
              .otp-box {
                  font-size: 30px;
                  font-weight: bold;
                  background: #d35400;
                  color: #ffffff;
                  display: inline-block;
                  padding: 15px 30px;
                  border-radius: 8px;
                  margin: 20px 0;
                  letter-spacing: 2px;
                  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
              }
              .note {
                  font-size: 14px;
                  color: #c0392b;
                  font-weight: bold;
                  margin-top: 10px;
              }
              .footer {
                  font-size: 14px;
                  color: #666;
                  margin-top: 25px;
                  padding-top: 15px;
                  border-top: 1px solid #ddd;
              }
              .footer a {
                  color: #e67e22;
                  text-decoration: none;
                  font-weight: bold;
              }
              .cta-button {
                  display: inline-block;
                  background-color: #e67e22;
                  color: #ffffff;
                  padding: 12px 25px;
                  font-size: 16px;
                  font-weight: bold;
                  border-radius: 5px;
                  text-decoration: none;
                  margin-top: 20px;
                  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
                  transition: background 0.3s ease-in-out;
              }
              .cta-button:hover {
                  background-color: #d35400;
              }
              /* Responsive Design */
              @media only screen and (max-width: 600px) {
                  .container {
                      padding: 20px;
                  }
                  .otp-box {
                      font-size: 24px;
                      padding: 12px 25px;
                  }
                  .message {
                      font-size: 15px;
                  }
                  .title {
                      font-size: 20px;
                  }
                  .cta-button {
                      font-size: 14px;
                      padding: 10px 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <img class="logo" src="https://yourdomain.com/logo.png" alt="Library Logo">
              <h2 class="title">🔐 Password Reset Request</h2>
              <p class="message">
                  Hello, <br> You have requested to reset your password. Use the OTP below to proceed.
              </p>
              <div class="otp-box">${otp}</div>
              <p class="message">
                  This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
              </p>
              <p class="note">If you did not request this, ignore this email or contact support.</p>
              <a href="https://yourlibrary.com/reset-password" class="cta-button">Reset Password</a>
              <div class="footer">
                  Need help? Contact our support team at <a href="mailto:support@yourlibrary.com">support@yourlibrary.com</a>
              </div>
          </div>
      </body>
      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};
