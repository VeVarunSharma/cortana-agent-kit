import nodemailer from 'nodemailer';
import { config } from '../config';

class EmailService {
  private transporter;

  constructor() {
    if (!config.emailHost || !config.emailUser || !config.emailPass) {
      console.warn('Email service is not configured. Emails will not be sent.');
      this.transporter = null;
      return;
    }
    this.transporter = nodemailer.createTransport({
      host: config.emailHost,
      port: config.emailPort,
      //   secure: config.emailPort === 465, // true for 465, false for other ports
      auth: {
        user: config.emailUser,
        pass: config.emailPass,
      },
    });
  }

  async sendEmail(subject: string, htmlContent: string): Promise<void> {
    if (!this.transporter) {
      console.warn('Email not sent because email service is not configured.');
      return;
    }

    if (!config.emailFrom || !config.emailTo) {
      console.error('Email "from" or "to" address is not configured.');
      return;
    }

    const mailOptions = {
      from: config.emailFrom,
      to: config.emailTo,
      subject: subject,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');
      console.log('Subject:', subject);
      console.log('Content:', htmlContent);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}

export const emailService = new EmailService();
