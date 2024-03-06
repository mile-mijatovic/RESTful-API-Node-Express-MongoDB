import nodemailer from "nodemailer";
import config from "../config/env";

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(config.email.smtp);
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      from: config.email.from,
      to,
      subject,
      html,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = "Reset password";
    const resetPasswordUrl = `${config.clientUrl}/api/auth/reset-password?token=${token}`;

    const html = `<div style="padding:10px;">
    <p>Dear user,</p>
    <p>We have received a request to reset the password for your account. To proceed with the password reset, please click on the following link: <a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>
    <p>If you did not initiate this password reset request, please disregard this email and take appropriate security measures to ensure the safety of your account.</p>
    <p>Thanks,</p>
    <p><strong>Address Book Support Team</strong></p>
    </div>`;

    this.sendEmail(to, subject, html);
  }
}

export default new EmailService();
