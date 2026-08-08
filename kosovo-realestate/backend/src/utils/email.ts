import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  try {
    await transporter.sendMail({
      from: `"Kosovo Real Estate" <${process.env.SMTP_FROM || 'noreply@kosovorealestate.com'}>`,
      ...options,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (err) {
    logger.error('Failed to send email:', err);
    throw err;
  }
};
