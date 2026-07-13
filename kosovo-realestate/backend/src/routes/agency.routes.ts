import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AppError } from '../utils/appError';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const agencies = await prisma.agency.findMany({
      where: { isVerified: true },
      include: {
        city: { select: { name: true } },
        _count: { select: { agents: true, listings: true } },
      },
      orderBy: { rating: 'desc' },
    });
    res.json({ agencies });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const agency = await prisma.agency.findUnique({
      where: { slug: req.params.slug },
      include: {
        city: true,
        agents: {
          include: {
            user: { select: { firstName: true, lastName: true, avatar: true, phone: true, email: true } },
          },
        },
        listings: {
          where: { status: 'ACTIVE' },
          take: 8,
          include: { images: { where: { isCover: true }, take: 1 }, city: { select: { name: true } } },
        },
        reviews: {
          take: 10,
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
        },
      },
    });
    if (!agency) throw new AppError('Agency not found', 404);
    res.json({ agency });
  } catch (err) { next(err); }
});

export default router;
