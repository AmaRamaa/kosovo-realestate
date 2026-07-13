import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { rateLimit } from 'express-rate-limit';
import dotenv from 'dotenv';

import authRouter from './routes/auth.routes';
import userRouter from './routes/user.routes';
import listingRouter from './routes/listing.routes';
import agentRouter from './routes/agent.routes';
import agencyRouter from './routes/agency.routes';
import cityRouter from './routes/city.routes';
import favoriteRouter from './routes/favorite.routes';
import messageRouter from './routes/message.routes';
import appointmentRouter from './routes/appointment.routes';
import reviewRouter from './routes/review.routes';
import blogRouter from './routes/blog.routes';
import adminRouter from './routes/admin.routes';
import uploadRouter from './routes/upload.routes';
import { errorHandler } from './middleware/error.middleware';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many auth attempts, please try again later.' },
});

app.use('/api/', limiter);
app.use('/api/auth/', authLimiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(compression());

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  }));
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API routes
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/listings', listingRouter);
app.use('/api/agents', agentRouter);
app.use('/api/agencies', agencyRouter);
app.use('/api/cities', cityRouter);
app.use('/api/favorites', favoriteRouter);
app.use('/api/messages', messageRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/blog', blogRouter);
app.use('/api/admin', adminRouter);
app.use('/api/upload', uploadRouter);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

export default app;
