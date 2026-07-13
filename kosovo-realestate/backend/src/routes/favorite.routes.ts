import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user!.id },
      include: {
        listing: {
          include: {
            images: { where: { isCover: true }, take: 1 },
            city: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ favorites });
  } catch (err) { next(err); }
});

router.post('/:listingId', async (req, res, next) => {
  try {
    const favorite = await prisma.favorite.upsert({
      where: { userId_listingId: { userId: req.user!.id, listingId: req.params.listingId } },
      update: {},
      create: { userId: req.user!.id, listingId: req.params.listingId },
    });
    await prisma.listing.update({ where: { id: req.params.listingId }, data: { favoriteCount: { increment: 1 } } });
    res.json({ favorite, saved: true });
  } catch (err) { next(err); }
});

router.delete('/:listingId', async (req, res, next) => {
  try {
    await prisma.favorite.delete({
      where: { userId_listingId: { userId: req.user!.id, listingId: req.params.listingId } },
    });
    await prisma.listing.update({ where: { id: req.params.listingId }, data: { favoriteCount: { decrement: 1 } } });
    res.json({ saved: false });
  } catch (err) { next(err); }
});

export default router;
