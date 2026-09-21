import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

// Two delivery paths, chosen by which credentials exist:
//  1. Resend HTTP API (RESEND_API_KEY) — plain HTTPS, so it works on hosts that
//     block outbound SMTP ports (Railway's non-Pro plans do).
//  2. SMTP via nodemailer (SMTP_*) — the original path, kept as a fallback.

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // A misconfigured or half-configured SMTP account (e.g. user set, password
  // not yet) should fail within seconds, not hang the request that's waiting
  // on it — these bound every phase of the connection.
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 10_000,
});

async function sendViaResend(options: EmailOptions) {
  // Until a domain is verified in Resend, the only sender it accepts is
  // onboarding@resend.dev, so this is deliberately NOT derived from SMTP_FROM
  // (which is a Gmail address Resend would reject).
  const from = process.env.RESEND_FROM || 'onboarding@resend.dev';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `Molla Real Estate <${from}>`,
      to: [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      reply_to: options.replyTo,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Resend API responded ${res.status}: ${await res.text()}`);
}

export const sendEmail = async (options: EmailOptions) => {
  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(options);
    } else {
      await transporter.sendMail({
        from: `"Molla Real Estate" <${process.env.SMTP_FROM || 'noreply@molla-realestate.com'}>`,
        ...options,
      });
    }
    logger.info(`Email sent to ${options.to}`);
  } catch (err) {
    logger.error('Failed to send email:', err);
    throw err;
  }
};
