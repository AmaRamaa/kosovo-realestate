import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { validate } from '../middleware/validate.middleware';
import { sendEmail } from '../utils/email';
import { prisma } from '../utils/prisma';
import { logger } from '../utils/logger';

const router = Router();

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartment', HOUSE: 'House', VILLA: 'Villa', LAND: 'Land',
  COMMERCIAL: 'Commercial', OFFICE: 'Office', WAREHOUSE: 'Warehouse',
  STUDIO: 'Studio', DUPLEX: 'Duplex', LOCAL: 'Storefront',
};

const LISTING_TYPE_LABELS: Record<string, string> = { SALE: 'For Sale', RENT: 'For Rent' };

const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' },
});

// Best-effort, fire-and-forget email — a submission is always persisted and
// responded to first, so neither a broken SMTP config nor a slow/hanging
// connection attempt (e.g. a real SMTP user with no password yet) ever
// delays or loses the submission itself. Callers do NOT await this.
function notifyOwnerInBackground(submissionId: string, options: { subject: string; html: string; replyTo: string }) {
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) {
    logger.error('OWNER_EMAIL is not configured — skipping submission email notification');
    return;
  }
  sendEmail({ to: ownerEmail, subject: options.subject, html: options.html, replyTo: options.replyTo })
    .then(() => prisma.submission.update({ where: { id: submissionId }, data: { emailSent: true } }))
    .catch((err) => logger.error('Failed to email submission notification:', err));
}

router.post(
  '/listing',
  submissionLimiter,
  [
    body('submitterName').trim().notEmpty().withMessage('Name is required'),
    body('submitterEmail').isEmail().withMessage('A valid email is required'),
    body('submitterPhone').optional({ checkFalsy: true }).trim(),
    body('listingType').isIn(['SALE', 'RENT']),
    body('propertyType').isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE', 'WAREHOUSE', 'STUDIO', 'DUPLEX', 'LOCAL']),
    body('price').isFloat({ min: 0 }),
    body('city').trim().notEmpty(),
    body('address').trim().notEmpty(),
    body('area').isFloat({ min: 0 }),
    body('bedrooms').optional({ checkFalsy: true }).isInt({ min: 0 }),
    body('bathrooms').optional({ checkFalsy: true }).isInt({ min: 0 }),
    body('notes').optional({ checkFalsy: true }).trim(),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        submitterName, submitterEmail, submitterPhone,
        listingType, propertyType, price, currency = 'EUR',
        city, neighborhood, address, area, bedrooms, bathrooms, notes,
      } = req.body;

      const submission = await prisma.submission.create({
        data: {
          type: 'LISTING',
          name: submitterName,
          email: submitterEmail,
          phone: submitterPhone || null,
          message: notes || null,
          data: {
            listingType, propertyType, price, currency,
            city, neighborhood: neighborhood || null, address, area, bedrooms: bedrooms || null, bathrooms: bathrooms || null,
          },
        },
      });

      const rows = [
        ['Submitted by', `${submitterName} <${submitterEmail}>${submitterPhone ? ` — ${submitterPhone}` : ''}`],
        ['Listing type', LISTING_TYPE_LABELS[listingType] || listingType],
        ['Property type', PROPERTY_TYPE_LABELS[propertyType] || propertyType],
        ['Price', `${price} ${currency}`],
        ['Location', `${address}, ${neighborhood ? `${neighborhood}, ` : ''}${city}`],
        ['Area', `${area} m²`],
        ['Bedrooms', bedrooms || '—'],
        ['Bathrooms', bathrooms || '—'],
        ['Notes', notes || '—'],
      ];

      const html = `
        <h2>New "List Your Property" submission</h2>
        <table cellpadding="6" style="border-collapse:collapse">
          ${rows.map(([label, value]) => `
            <tr>
              <td style="font-weight:bold;vertical-align:top;color:#555">${label}</td>
              <td>${String(value).replace(/\n/g, '<br/>')}</td>
            </tr>
          `).join('')}
        </table>
        <p>Reply directly to this email to reach the submitter, or review it in the admin dashboard.</p>
      `;

      notifyOwnerInBackground(submission.id, {
        subject: `New property submission: ${address}, ${city}`,
        html,
        replyTo: submitterEmail,
      });

      res.status(201).json({ message: 'Submission received' });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  '/contact',
  submissionLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('A valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required'),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, message } = req.body;

      const submission = await prisma.submission.create({
        data: { type: 'CONTACT', name, email, message, data: { name, email, message } },
      });

      const html = `
        <h2>New contact form message</h2>
        <p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
        <p>${String(message).replace(/\n/g, '<br/>')}</p>
        <p>Reply directly to this email to reach them, or review it in the admin dashboard.</p>
      `;

      notifyOwnerInBackground(submission.id, {
        subject: `New contact message from ${name}`,
        html,
        replyTo: email,
      });

      res.status(201).json({ message: 'Message received' });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
