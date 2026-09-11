import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { rateLimit } from 'express-rate-limit';
import { validate } from '../middleware/validate.middleware';
import { prisma } from '../utils/prisma';

const router = Router();

const trackLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/track',
  trackLimiter,
  [
    body('path').trim().notEmpty().isLength({ max: 500 }),
    body('visitorId').trim().notEmpty().isLength({ max: 100 }),
  ],
  validate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { path, visitorId } = req.body;
      await prisma.pageView.create({ data: { path, visitorId } });
      res.status(201).json({ success: true });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
