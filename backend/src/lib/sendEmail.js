import { Resend } from 'resend';
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY); // Add this key to your .env

export const sendEmail = async (email, subject, otp) => {
  try {
    const data = await resend.emails.send({
      from: `"NIRT Library (No Reply)" <noreply@nirtlibrary.in>`, // Must match your verified domain
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
                    font-family: Arial, sans-serif;
                    background-color: #f6f6f6;
                    padding: 20px;
                    margin: 0;
                }
                .container {
                    max-width: 600px;
                    background-color: #fff;
                    padding: 30px;
                    margin: 0 auto;
                    border-radius: 8px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
                }
                .logo {
                    display: block;
                    margin: 0 auto 20px;
                    width: 120px;
                }
                .title {
                    font-size: 22px;
                    text-align: center;
                    color: #333;
                    margin-bottom: 10px;
                }
                .message {
                    font-size: 16px;
                    color: #555;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .otp-box {
                    font-size: 28px;
                    font-weight: bold;
                    text-align: center;
                    background-color: #e0f7fa;
                    padding: 15px;
                    border-radius: 6px;
                    margin-bottom: 20px;
                    letter-spacing: 4px;
                    color: #00796b;
                }
                .cta-button {
                    display: inline-block;
                    background-color: #1976d2;
                    color: #fbfcf7;
                    padding: 12px 20px;
                    text-decoration: none;
                    border-radius: 4px;
                    text-align: center;
                    margin: 0 auto;
                }
                .footer {
                    font-size: 12px;
                    color: #999;
                    margin-top: 30px;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <img class="logo" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuQ_m9SDnGfnOjET4Lb9qQJHytCTSAzWZW3Q&s" alt="Library Logo">
                <h2 class="title">🔐 Password Reset Request</h2>
                <p class="message">
                    Hello, <br> You have requested to reset your password. Use the OTP below to proceed.
                </p>
                <div class="otp-box">${otp}</div>
                <p class="message">
                    This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
                </p>
                <p class="note">If you did not request this, you can safely ignore this email.</p>
                <a href="https://yourlibrary.com/reset-password" class="cta-button">Reset Password</a>
                <div class="footer">
                    This is an automated email from NIRT Library — <strong>please do not reply</strong>.<br>
                    Need help? Contact our support team at <a href="mailto:support@yourlibrary.com">support@yourlibrary.com</a>
                </div>
            </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email sent via Resend:', data);
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
  }
};
