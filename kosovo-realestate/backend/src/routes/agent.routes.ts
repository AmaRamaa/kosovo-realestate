import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';
import { AppError } from '../utils/appError';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 12, cityId, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const where: any = { isVerified: true };
    if (cityId) where.agency = { cityId };
    if (search) where.user = { OR: [
      { firstName: { contains: search, mode: 'insensitive' } },
      { lastName: { contains: search, mode: 'insensitive' } },
    ]};

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        skip,
        take: Number(limit),
        include: {
          user: { select: { firstName: true, lastName: true, avatar: true, email: true, phone: true } },
          agency: { select: { name: true, logo: true } },
          _count: { select: { listings: true } },
        },
        orderBy: { rating: 'desc' },
      }),
      prisma.agent.count({ where }),
    ]);

    res.json({ agents, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { firstName: true, lastName: true, avatar: true, email: true, phone: true, createdAt: true } },
        agency: { select: { name: true, logo: true, slug: true } },
        listings: {
          where: { status: 'ACTIVE' },
          take: 6,
          include: { images: { where: { isCover: true }, take: 1 }, city: { select: { name: true } } },
        },
        reviews: {
          take: 10,
          include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!agent) throw new AppError('Agent not found', 404);
    res.json({ agent });
  } catch (err) { next(err); }
});

export default router;
