import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  googleAuth,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  validate,
  login
);

router.post('/google', googleAuth);
router.post('/logout', authenticate, logout);
router.post('/refresh', refreshToken);
router.post('/forgot-password', [body('email').isEmail()], validate, forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify/:token', verifyEmail);
router.get('/me', authenticate, getMe);

export default router;
