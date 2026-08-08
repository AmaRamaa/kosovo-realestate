import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { validate } from '../middleware/validate.middleware';
import { sendEmail } from '../utils/email';

const router = Router();

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartment', HOUSE: 'House', VILLA: 'Villa', LAND: 'Land',
  COMMERCIAL: 'Commercial', OFFICE: 'Office', WAREHOUSE: 'Warehouse',
  STUDIO: 'Studio', DUPLEX: 'Duplex',
};

const LISTING_TYPE_LABELS: Record<string, string> = { SALE: 'For Sale', RENT: 'For Rent' };

const submissionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many submissions, please try again later.' },
});

router.post(
  '/listing',
  submissionLimiter,
  [
    body('submitterName').trim().notEmpty().withMessage('Name is required'),
    body('submitterEmail').isEmail().withMessage('A valid email is required'),
    body('submitterPhone').optional({ checkFalsy: true }).trim(),
    body('listingType').isIn(['SALE', 'RENT']),
    body('propertyType').isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE', 'WAREHOUSE', 'STUDIO', 'DUPLEX']),
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

      const ownerEmail = process.env.OWNER_EMAIL;
      if (!ownerEmail) {
        throw new Error('OWNER_EMAIL is not configured');
      }

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
        <p>Reply directly to this email to reach the submitter.</p>
      `;

      await sendEmail({
        to: ownerEmail,
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

export default router;
