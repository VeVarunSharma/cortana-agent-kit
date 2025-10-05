import nodemailer from 'nodemailer';
import { config } from '../config/global.config';

class EmailService {
  private createTransporter() {
    if (!config.emailHost || !config.emailUser || !config.emailPass) {
      console.warn('Email service is not configured. Emails will not be sent.');
      return null;
    }
    return nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });
  }

  async sendEmail(subject: string, htmlContent: string): Promise<void> {
    const transporter = this.createTransporter();
    if (!transporter) {
      const warning = 'Email not sent because email service is not configured.';
      console.warn(warning);
      throw new Error(warning);
    }

    if (!config.emailFrom || !config.emailTo) {
      const errorMsg = 'Email "from" or "to" address is not configured.';
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    const mailOptions = {
      from: config.emailFrom,
      to: config.emailTo,
      subject: subject,
      html: htmlContent,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');
      console.log('Message ID:', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    } finally {
      transporter.close(); // Close the connection
    }
  }
}

export const emailService = new EmailService();
