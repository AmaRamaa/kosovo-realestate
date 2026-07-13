import { Router } from 'express';
import { prisma } from '../utils/prisma';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      include: { _count: { select: { listings: true, neighborhoods: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ cities });
  } catch (err) { next(err); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const city = await prisma.city.findUnique({
      where: { slug: req.params.slug },
      include: {
        neighborhoods: { orderBy: { name: 'asc' } },
        _count: { select: { listings: true } },
      },
    });
    if (!city) return res.status(404).json({ error: 'City not found' });
    res.json({ city });
  } catch (err) { next(err); }
});

export default router;
