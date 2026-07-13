import { Router } from 'express';
import { prisma } from '../utils/prisma';
import { authenticate, requireRole } from '../middleware/auth.middleware';

// MESSAGE ROUTES
export const messageRouter = Router();
messageRouter.use(authenticate);

messageRouter.get('/', async (req, res, next) => {
  try {
    const messages = await prisma.message.findMany({
      where: { OR: [{ senderId: req.user!.id }, { receiverId: req.user!.id }], parentId: null },
      include: {
        sender: { select: { firstName: true, lastName: true, avatar: true } },
        receiver: { select: { firstName: true, lastName: true, avatar: true } },
        replies: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ messages });
  } catch (err) { next(err); }
});

messageRouter.post('/', async (req, res, next) => {
  try {
    const { receiverId, subject, content, listingId, parentId } = req.body;
    const message = await prisma.message.create({
      data: { senderId: req.user!.id, receiverId, subject, content, listingId, parentId },
      include: {
        sender: { select: { firstName: true, lastName: true, avatar: true } },
      },
    });
    res.status(201).json({ message });
  } catch (err) { next(err); }
});

messageRouter.patch('/:id/read', async (req, res, next) => {
  try {
    await prisma.message.update({ where: { id: req.params.id }, data: { status: 'READ' } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// APPOINTMENT ROUTES
export const appointmentRouter = Router();
appointmentRouter.use(authenticate);

appointmentRouter.post('/', async (req, res, next) => {
  try {
    const { listingId, agentId, scheduledAt, notes } = req.body;
    const appt = await prisma.appointment.create({
      data: { listingId, agentId, buyerId: req.user!.id, scheduledAt: new Date(scheduledAt), notes },
    });
    res.status(201).json({ appointment: appt });
  } catch (err) { next(err); }
});

appointmentRouter.get('/', async (req, res, next) => {
  try {
    const appts = await prisma.appointment.findMany({
      where: { OR: [{ buyerId: req.user!.id }, { agent: { userId: req.user!.id } }] },
      include: {
        listing: { select: { title: true, slug: true, images: { where: { isCover: true }, take: 1 } } },
        buyer: { select: { firstName: true, lastName: true, avatar: true, phone: true } },
        agent: { include: { user: { select: { firstName: true, lastName: true, avatar: true } } } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
    res.json({ appointments: appts });
  } catch (err) { next(err); }
});

// REVIEW ROUTES
export const reviewRouter = Router();

reviewRouter.get('/agent/:agentId', async (req, res, next) => {
  try {
    const reviews = await prisma.review.findMany({
      where: { agentId: req.params.agentId },
      include: { user: { select: { firstName: true, lastName: true, avatar: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ reviews });
  } catch (err) { next(err); }
});

reviewRouter.post('/', authenticate, async (req, res, next) => {
  try {
    const { agentId, agencyId, listingId, rating, comment } = req.body;
    const review = await prisma.review.create({
      data: { userId: req.user!.id, agentId, agencyId, listingId, rating, comment },
    });
    if (agentId) {
      const stats = await prisma.review.aggregate({ where: { agentId }, _avg: { rating: true }, _count: true });
      await prisma.agent.update({
        where: { id: agentId },
        data: { rating: stats._avg.rating || 0, reviewCount: stats._count },
      });
    }
    res.status(201).json({ review });
  } catch (err) { next(err); }
});

// BLOG ROUTES
export const blogRouter = Router();

blogRouter.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 9, category } = req.query;
    const where: any = { isPublished: true };
    if (category) where.category = category;
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, category: true, authorName: true, publishedAt: true, viewCount: true, tags: true },
        orderBy: { publishedAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ]);
    res.json({ posts, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total/Number(limit)) } });
  } catch (err) { next(err); }
});

blogRouter.get('/:slug', async (req, res, next) => {
  try {
    const post = await prisma.blogPost.findUnique({ where: { slug: req.params.slug } });
    if (!post || !post.isPublished) return res.status(404).json({ error: 'Post not found' });
    await prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });
    res.json({ post });
  } catch (err) { next(err); }
});

// ADMIN ROUTES
export const adminRouter = Router();
adminRouter.use(authenticate, requireRole(['ADMIN']));

adminRouter.get('/stats', async (req, res, next) => {
  try {
    const [users, listings, pendingListings, agents, agencies] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' } }),
      prisma.listing.count({ where: { status: 'PENDING' } }),
      prisma.agent.count(),
      prisma.agency.count(),
    ]);
    const listingsByType = await prisma.listing.groupBy({ by: ['listingType'], _count: true, where: { status: 'ACTIVE' } });
    const listingsByCity = await prisma.listing.groupBy({ by: ['cityId'], _count: true, where: { status: 'ACTIVE' }, orderBy: { _count: { cityId: 'desc' } }, take: 10 });
    res.json({ stats: { users, listings, pendingListings, agents, agencies, listingsByType, listingsByCity } });
  } catch (err) { next(err); }
});

adminRouter.get('/listings/pending', async (req, res, next) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        city: { select: { name: true } },
        images: { where: { isCover: true }, take: 1 },
      },
      orderBy: { createdAt: 'asc' },
    });
    res.json({ listings });
  } catch (err) { next(err); }
});

adminRouter.get('/users', async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip: (Number(page)-1)*Number(limit), take: Number(limit),
        select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, isVerified: true, createdAt: true, _count: { select: { listings: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);
    res.json({ users, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total/Number(limit)) } });
  } catch (err) { next(err); }
});

adminRouter.patch('/users/:id/toggle', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const updated = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: !user.isActive } });
    res.json({ user: updated });
  } catch (err) { next(err); }
});

// UPLOAD ROUTES
export const uploadRouter = Router();
uploadRouter.use(authenticate);

import cloudinary from 'cloudinary';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

uploadRouter.post('/images', upload.array('images', 20), async (req, res, next) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) return res.status(400).json({ error: 'No files uploaded' });

    const uploaded = await Promise.all(files.map(file =>
      new Promise<any>((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { folder: 'kosovo-realestate', resource_type: 'image', transformation: [{ width: 1200, quality: 'auto', fetch_format: 'auto' }] },
          (err, result) => err ? reject(err) : resolve(result)
        ).end(file.buffer);
      })
    ));

    res.json({ images: uploaded.map(r => ({ url: r.secure_url, publicId: r.public_id })) });
  } catch (err) { next(err); }
});

uploadRouter.delete('/images/:publicId', async (req, res, next) => {
  try {
    await cloudinary.v2.uploader.destroy(req.params.publicId);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export const userRouter = Router();
userRouter.use(authenticate);

userRouter.get('/me/notifications', async (req, res, next) => {
  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    res.json({ notifications });
  } catch (err) { next(err); }
});

userRouter.patch('/me/notifications/read', async (req, res, next) => {
  try {
    await prisma.notification.updateMany({ where: { userId: req.user!.id }, data: { isRead: true } });
    res.json({ success: true });
  } catch (err) { next(err); }
});

userRouter.get('/me/recent-views', async (req, res, next) => {
  try {
    const views = await prisma.recentView.findMany({
      where: { userId: req.user!.id },
      include: { listing: { include: { images: { where: { isCover: true }, take: 1 }, city: { select: { name: true } } } } },
      orderBy: { viewedAt: 'desc' },
      take: 10,
    });
    res.json({ views });
  } catch (err) { next(err); }
});

userRouter.put('/me', async (req, res, next) => {
  try {
    const { firstName, lastName, phone, avatar } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { firstName, lastName, phone, avatar },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true, role: true },
    });
    res.json({ user });
  } catch (err) { next(err); }
});
