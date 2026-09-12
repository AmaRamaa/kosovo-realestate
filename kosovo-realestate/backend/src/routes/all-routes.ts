import { Router } from 'express';
import bcrypt from 'bcryptjs';
import slugify from 'slugify';
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

adminRouter.get('/submissions', async (req, res, next) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const where: any = {};
    if (type) where.type = type;
    if (status) where.status = status;
    const [submissions, total, newCount] = await Promise.all([
      prisma.submission.findMany({
        where, skip: (Number(page)-1)*Number(limit), take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.submission.count({ where }),
      prisma.submission.count({ where: { status: 'NEW' } }),
    ]);
    res.json({ submissions, newCount, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total/Number(limit)) } });
  } catch (err) { next(err); }
});

adminRouter.patch('/submissions/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['NEW', 'READ', 'ARCHIVED'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const submission = await prisma.submission.update({ where: { id: req.params.id }, data: { status } });
    res.json({ submission });
  } catch (err) { next(err); }
});

adminRouter.delete('/submissions/:id', async (req, res, next) => {
  try {
    await prisma.submission.delete({ where: { id: req.params.id } });
    res.json({ message: 'Submission deleted' });
  } catch (err) { next(err); }
});

adminRouter.get('/analytics', async (req, res, next) => {
  try {
    const days = Math.min(90, Math.max(1, Number(req.query.days) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalViews, uniqueVisitorRows, viewsByDay, topPageRows] = await Promise.all([
      prisma.pageView.count({ where: { createdAt: { gte: since } } }),
      prisma.pageView.findMany({ where: { createdAt: { gte: since } }, select: { visitorId: true }, distinct: ['visitorId'] }),
      prisma.$queryRaw<{ date: string; count: bigint }[]>`
        SELECT to_char("createdAt", 'YYYY-MM-DD') AS date, COUNT(*) AS count
        FROM "page_views"
        WHERE "createdAt" >= ${since}
        GROUP BY date
        ORDER BY date ASC
      `,
      prisma.pageView.groupBy({
        by: ['path'],
        where: { createdAt: { gte: since } },
        _count: true,
        orderBy: { _count: { path: 'desc' } },
        take: 10,
      }),
    ]);

    res.json({
      totalViews,
      uniqueVisitors: uniqueVisitorRows.length,
      viewsByDay: viewsByDay.map(r => ({ date: r.date, count: Number(r.count) })),
      topPages: topPageRows.map(r => ({ path: r.path, count: r._count })),
    });
  } catch (err) { next(err); }
});

// CITIES & NEIGHBORHOODS (admin)
adminRouter.get('/cities', async (req, res, next) => {
  try {
    const cities = await prisma.city.findMany({
      include: {
        neighborhoods: { orderBy: { name: 'asc' } },
        _count: { select: { listings: true, neighborhoods: true } },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ cities });
  } catch (err) { next(err); }
});

adminRouter.post('/cities', async (req, res, next) => {
  try {
    const { name, nameAlbanian, nameSerbian, description, image, lat, lng, isActive } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    let slug = slugify(name, { lower: true, strict: true });
    if (await prisma.city.findUnique({ where: { slug } })) slug = `${slug}-${Date.now()}`;
    const city = await prisma.city.create({
      data: { name, nameAlbanian, nameSerbian, slug, description, image, lat, lng, isActive: isActive ?? true },
    });
    res.status(201).json({ city });
  } catch (err) { next(err); }
});

adminRouter.put('/cities/:id', async (req, res, next) => {
  try {
    const { name, nameAlbanian, nameSerbian, description, image, lat, lng, isActive } = req.body;
    const city = await prisma.city.update({
      where: { id: req.params.id },
      data: { name, nameAlbanian, nameSerbian, description, image, lat, lng, isActive },
    });
    res.json({ city });
  } catch (err) { next(err); }
});

adminRouter.delete('/cities/:id', async (req, res, next) => {
  try {
    await prisma.city.delete({ where: { id: req.params.id } });
    res.json({ message: 'City deleted' });
  } catch (err) { next(err); }
});

adminRouter.post('/neighborhoods', async (req, res, next) => {
  try {
    const { name, cityId, lat, lng } = req.body;
    if (!name || !cityId) return res.status(400).json({ error: 'Name and city are required' });
    const slug = slugify(name, { lower: true, strict: true });
    const neighborhood = await prisma.neighborhood.create({ data: { name, cityId, slug, lat, lng } });
    res.status(201).json({ neighborhood });
  } catch (err) { next(err); }
});

adminRouter.put('/neighborhoods/:id', async (req, res, next) => {
  try {
    const { name, lat, lng } = req.body;
    const neighborhood = await prisma.neighborhood.update({ where: { id: req.params.id }, data: { name, lat, lng } });
    res.json({ neighborhood });
  } catch (err) { next(err); }
});

adminRouter.delete('/neighborhoods/:id', async (req, res, next) => {
  try {
    await prisma.neighborhood.delete({ where: { id: req.params.id } });
    res.json({ message: 'Neighborhood deleted' });
  } catch (err) { next(err); }
});

// AGENCIES (admin)
adminRouter.get('/agencies', async (req, res, next) => {
  try {
    const agencies = await prisma.agency.findMany({
      include: { city: { select: { id: true, name: true } }, _count: { select: { agents: true, listings: true } } },
      orderBy: { name: 'asc' },
    });
    res.json({ agencies });
  } catch (err) { next(err); }
});

adminRouter.post('/agencies', async (req, res, next) => {
  try {
    const { name, description, logo, coverImage, website, email, phone, address, cityId, isVerified } = req.body;
    if (!name || !email || !phone || !cityId) return res.status(400).json({ error: 'Name, email, phone, and city are required' });
    let slug = slugify(name, { lower: true, strict: true });
    if (await prisma.agency.findUnique({ where: { slug } })) slug = `${slug}-${Date.now()}`;
    const agency = await prisma.agency.create({
      data: { name, slug, description, logo, coverImage, website, email, phone, address, cityId, isVerified: isVerified ?? true },
    });
    res.status(201).json({ agency });
  } catch (err) { next(err); }
});

adminRouter.put('/agencies/:id', async (req, res, next) => {
  try {
    const { name, description, logo, coverImage, website, email, phone, address, cityId, isVerified } = req.body;
    const agency = await prisma.agency.update({
      where: { id: req.params.id },
      data: { name, description, logo, coverImage, website, email, phone, address, cityId, isVerified },
    });
    res.json({ agency });
  } catch (err) { next(err); }
});

adminRouter.delete('/agencies/:id', async (req, res, next) => {
  try {
    await prisma.agency.delete({ where: { id: req.params.id } });
    res.json({ message: 'Agency deleted' });
  } catch (err) { next(err); }
});

// AGENTS (admin)
adminRouter.get('/agents', async (req, res, next) => {
  try {
    const agents = await prisma.agent.findMany({
      include: {
        user: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, avatar: true, isActive: true } },
        agency: { select: { id: true, name: true } },
        _count: { select: { listings: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ agents });
  } catch (err) { next(err); }
});

adminRouter.post('/agents', async (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, password, agencyId, bio, licenseNumber, yearsExperience, specializations, languages, isVerified } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'First name, last name, email, and password are required' });
    }
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, phone, password: hashed, role: 'AGENT', isVerified: true },
    });
    const agent = await prisma.agent.create({
      data: {
        userId: user.id,
        agencyId: agencyId || null,
        bio, licenseNumber,
        yearsExperience: yearsExperience ?? 0,
        specializations: specializations || [],
        languages: languages || [],
        isVerified: isVerified ?? true,
      },
      include: {
        user: { select: { firstName: true, lastName: true, email: true, avatar: true, phone: true } },
        agency: { select: { name: true } },
      },
    });
    res.status(201).json({ agent });
  } catch (err) { next(err); }
});

adminRouter.put('/agents/:id', async (req, res, next) => {
  try {
    const { firstName, lastName, phone, ...agentData } = req.body;
    const agent = await prisma.agent.findUnique({ where: { id: req.params.id } });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    if (firstName !== undefined || lastName !== undefined || phone !== undefined) {
      await prisma.user.update({
        where: { id: agent.userId },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(phone !== undefined && { phone }),
        },
      });
    }
    delete agentData.userId;
    const updated = await prisma.agent.update({
      where: { id: req.params.id },
      data: agentData,
      include: {
        user: { select: { firstName: true, lastName: true, email: true, avatar: true, phone: true } },
        agency: { select: { name: true } },
      },
    });
    res.json({ agent: updated });
  } catch (err) { next(err); }
});

adminRouter.delete('/agents/:id', async (req, res, next) => {
  try {
    const agent = await prisma.agent.findUnique({ where: { id: req.params.id } });
    if (!agent) return res.status(404).json({ error: 'Agent not found' });
    await prisma.agent.delete({ where: { id: req.params.id } });
    await prisma.user.update({ where: { id: agent.userId }, data: { role: 'BUYER' } }).catch(() => {});
    res.json({ message: 'Agent removed' });
  } catch (err) { next(err); }
});

// APPOINTMENTS / VIEWING REQUESTS (admin)
adminRouter.get('/appointments', async (req, res, next) => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status) where.status = status;
    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        listing: { select: { title: true, slug: true, images: { where: { isCover: true }, take: 1 } } },
        buyer: { select: { firstName: true, lastName: true, email: true, phone: true } },
        agent: { include: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { scheduledAt: 'desc' },
    });
    res.json({ appointments });
  } catch (err) { next(err); }
});

adminRouter.patch('/appointments/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const appointment = await prisma.appointment.update({ where: { id: req.params.id }, data: { status } });
    res.json({ appointment });
  } catch (err) { next(err); }
});

adminRouter.delete('/appointments/:id', async (req, res, next) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    res.json({ message: 'Appointment deleted' });
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
