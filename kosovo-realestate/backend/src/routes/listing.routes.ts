import { Router } from 'express';
import { body, query } from 'express-validator';
import {
  getListings,
  getListingBySlug,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  deleteListingImage,
  reorderListingImages,
  getFeaturedListings,
  getRecentListings,
  incrementView,
  getUserListings,
  approveListing,
  getSimilarListings,
} from '../controllers/listing.controller';
import { authenticate, optionalAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// Public routes
router.get('/', optionalAuth, getListings);
router.get('/featured', getFeaturedListings);
router.get('/recent', getRecentListings);
router.get('/:slug', optionalAuth, getListingBySlug);
router.get('/:slug/similar', getSimilarListings);
router.post('/:id/view', incrementView);

// Protected routes
router.get('/user/my-listings', authenticate, getUserListings);
router.get('/id/:id', authenticate, requireRole(['SELLER', 'AGENT', 'ADMIN']), getListingById);

router.post(
  '/',
  authenticate,
  requireRole(['SELLER', 'AGENT', 'ADMIN']),
  [
    body('title').trim().notEmpty().isLength({ max: 200 }),
    body('description').trim().notEmpty(),
    body('listingType').isIn(['SALE', 'RENT']),
    body('propertyType').isIn(['APARTMENT', 'HOUSE', 'VILLA', 'LAND', 'COMMERCIAL', 'OFFICE', 'WAREHOUSE', 'STUDIO', 'DUPLEX', 'LOCAL']),
    body('price').isFloat({ min: 0 }),
    body('area').isFloat({ min: 0 }),
    body('cityId').notEmpty(),
    body('address').trim().notEmpty(),
  ],
  validate,
  createListing
);

router.put('/:id', authenticate, requireRole(['SELLER', 'AGENT', 'ADMIN']), updateListing);
router.delete('/:id', authenticate, requireRole(['SELLER', 'AGENT', 'ADMIN']), deleteListing);
router.delete('/:id/images/:imageId', authenticate, requireRole(['SELLER', 'AGENT', 'ADMIN']), deleteListingImage);
router.put('/:id/images/order', authenticate, requireRole(['SELLER', 'AGENT', 'ADMIN']), reorderListingImages);

// Admin only
router.patch('/:id/approve', authenticate, requireRole(['ADMIN']), approveListing);

export default router;
