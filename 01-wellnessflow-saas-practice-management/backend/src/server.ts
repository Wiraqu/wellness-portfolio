import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

import { authRouter } from './routes/auth';
import { clientRouter } from './routes/clients';
import { appointmentRouter } from './routes/appointments';
import { invoiceRouter } from './routes/invoices';
import { analyticsRouter } from './routes/analytics';
import { subscriptionRouter } from './routes/subscriptions';
import { healthMetricRouter } from './routes/healthMetrics';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './services/logger';

dotenv.config();

const app = express();
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn'] : ['error'],
});

const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing & logging
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/clients', clientRouter);
app.use('/api/appointments', appointmentRouter);
app.use('/api/invoices', invoiceRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/health-metrics', healthMetricRouter);

// Stripe webhook (raw body needed)
app.use('/api/webhooks/stripe', express.raw({ type: 'application/json' }));

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  logger.info(`🚀 WellnessFlow API running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
