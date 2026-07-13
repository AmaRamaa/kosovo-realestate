import { Request, Response, NextFunction } from 'express';
import slugify from 'slugify';
import { prisma } from '../utils/prisma';
import { AppError } from '../utils/appError';
import { Prisma } from '@prisma/client';

const LISTING_SELECT = {
  id: true,
  title: true,
  slug: true,
  listingType: true,
  propertyType: true,
  status: true,
  price: true,
  currency: true,
  area: true,
  bedrooms: true,
  bathrooms: true,
  floor: true,
  hasGarden: true,
  hasPool: true,
  hasBalcony: true,
  garageSpaces: true,   // ❌ Remove this
  parkingSpaces: true,
  isFeatured: true,
  viewCount: true,
  favoriteCount: true,
  createdAt: true,
  address: true,
  lat: true,
  lng: true,
  city: { select: { id: true, name: true, slug: true } },
  neighborhood: { select: { id: true, name: true } },
  images: {
    where: { isCover: true },
    take: 1,
    select: { url: true, alt: true },
  },
  agent: {
    select: {
      id: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
          phone: true,
          email: true,
        },
      },
    },
  },
};

export const getListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1, limit = 12, listingType, propertyType, cityId, neighborhoodId,
      minPrice, maxPrice, minArea, maxArea, bedrooms, bathrooms,
      hasGarden, hasPool, hasBalcony, hasGarage, hasFurnished,
      sortBy = 'createdAt', sortOrder = 'desc', search, status = 'ACTIVE',
    } = req.query;

    const skip = (Number(page) - 1) * Number(limit);
    const where: Prisma.ListingWhereInput = {};

    // Status filter (admin sees all, public sees ACTIVE)
    const userRole = (req as any).user?.role;
    if (userRole === 'ADMIN') {
      if (status) where.status = status as any;
    } else {
      where.status = 'ACTIVE';
    }

    if (listingType) where.listingType = listingType as any;
    if (propertyType) where.propertyType = propertyType as any;
    if (cityId) where.cityId = cityId as string;
    if (neighborhoodId) where.neighborhoodId = neighborhoodId as string;

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (minArea || maxArea) {
      where.area = {};
      if (minArea) where.area.gte = Number(minArea);
      if (maxArea) where.area.lte = Number(maxArea);
    }

    if (bedrooms) where.bedrooms = { gte: Number(bedrooms) };
    if (bathrooms) where.bathrooms = { gte: Number(bathrooms) };
    if (hasGarden === 'true') where.hasGarden = true;
    if (hasPool === 'true') where.hasPool = true;
    if (hasBalcony === 'true') where.hasBalcony = true;
    if (hasFurnished === 'true') where.hasFurnished = true;

    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { address: { contains: search as string, mode: 'insensitive' } },
        { city: { name: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    const validSortFields = ['createdAt', 'price', 'area', 'viewCount', 'favoriteCount'];
    const orderField = validSortFields.includes(sortBy as string) ? sortBy as string : 'createdAt';
    const orderDir = sortOrder === 'asc' ? 'asc' : 'desc';

    // Featured listings always first
    const orderBy: Prisma.ListingOrderByWithRelationInput[] = [
      { isFeatured: 'desc' },
      { [orderField]: orderDir },
    ];

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
        select: LISTING_SELECT,
      }),
      prisma.listing.count({ where }),
    ]);

    res.json({
      listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getListingBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await prisma.listing.findUnique({
      where: { slug: req.params.slug },
      include: {
        city: true,
        neighborhood: true,
        images: { orderBy: [{ isCover: 'desc' }, { order: 'asc' }] },
        amenities: { include: { amenity: true } },
        agent: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, avatar: true, phone: true, email: true } },
            agency: { select: { id: true, name: true, logo: true } },
          },
        },
        agency: { select: { id: true, name: true, logo: true } },
        _count: { select: { favorites: true, reviews: true } },
      },
    });

    if (!listing) throw new AppError('Listing not found', 404);

    // Track recent view
    const userId = (req as any).user?.id;
    if (userId) {
      await prisma.recentView.upsert({
        where: { userId_listingId: { userId, listingId: listing.id } },
        update: { viewedAt: new Date() },
        create: { userId, listingId: listing.id },
      }).catch(() => {});
    }

    res.json({ listing });
  } catch (err) {
    next(err);
  }
};

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.id;
    const data = req.body;

    let slug = slugify(data.title, { lower: true, strict: true });
    const existing = await prisma.listing.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const listing = await prisma.listing.create({
      data: {
        ...data,
        slug,
        userId,
        status: req.user!.role === 'ADMIN' ? 'ACTIVE' : 'PENDING',
        publishedAt: req.user!.role === 'ADMIN' ? new Date() : null,
      },
    });

    res.status(201).json({ listing });
  } catch (err) {
    next(err);
  }
};

export const updateListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new AppError('Listing not found', 404);
    if (listing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError('Not authorized', 403);
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: req.body,
    });

    res.json({ listing: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) throw new AppError('Listing not found', 404);
    if (listing.userId !== req.user!.id && req.user!.role !== 'ADMIN') {
      throw new AppError('Not authorized', 403);
    }

    await prisma.listing.delete({ where: { id } });
    res.json({ message: 'Listing deleted' });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { status: 'ACTIVE', isFeatured: true },
      take: 8,
      orderBy: { featuredUntil: 'desc' },
      select: LISTING_SELECT,
    });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
};

export const getRecentListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { limit = 8, listingType } = req.query;
    const where: any = { status: 'ACTIVE' };
    if (listingType) where.listingType = listingType;

    const listings = await prisma.listing.findMany({
      where,
      take: Number(limit),
      orderBy: { publishedAt: 'desc' },
      select: LISTING_SELECT,
    });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
};

export const incrementView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await prisma.listing.update({
      where: { id: req.params.id },
      data: { viewCount: { increment: 1 } },
    });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

export const getUserListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        city: { select: { name: true } },
        images: { where: { isCover: true }, take: 1 },
        _count: { select: { favorites: true, appointments: true } },
      },
    });
    res.json({ listings });
  } catch (err) {
    next(err);
  }
};

export const approveListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.body;
    const listing = await prisma.listing.update({
      where: { id: req.params.id },
      data: {
        status,
        publishedAt: status === 'ACTIVE' ? new Date() : undefined,
      },
    });
    res.json({ listing });
  } catch (err) {
    next(err);
  }
};

export const getSimilarListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const listing = await prisma.listing.findUnique({ where: { slug: req.params.slug } });
    if (!listing) throw new AppError('Listing not found', 404);

    const similar = await prisma.listing.findMany({
      where: {
        status: 'ACTIVE',
        id: { not: listing.id },
        propertyType: listing.propertyType,
        listingType: listing.listingType,
        cityId: listing.cityId,
        price: { gte: listing.price * 0.7, lte: listing.price * 1.3 },
      },
      take: 4,
      select: LISTING_SELECT,
    });

    res.json({ listings: similar });
  } catch (err) {
    next(err);
  }
};
