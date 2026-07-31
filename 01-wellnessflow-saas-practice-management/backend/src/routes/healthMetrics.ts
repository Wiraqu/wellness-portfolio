import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

const metricSchema = z.object({
  clientId: z.string().uuid(),
  type: z.enum(['WEIGHT', 'BLOOD_PRESSURE', 'HEART_RATE', 'SLEEP', 'MOOD', 'STEPS', 'BODY_FAT', 'BLOOD_GLUCOSE']),
  value: z.number(),
  unit: z.string(),
  notes: z.string().optional(),
  recordedAt: z.string().datetime().optional(),
});

router.get('/:clientId', async (req: AuthRequest, res, next) => {
  try {
    const client = await prisma.client.findFirst({
      where: { id: req.params.clientId, practitionerId: req.user!.id },
    });
    if (!client) throw new AppError('Client not found', 404);

    const metrics = await prisma.healthMetric.findMany({
      where: { clientId: req.params.clientId },
      orderBy: { recordedAt: 'desc' },
      take: 100,
    });
    res.json({ success: true, data: metrics });
  } catch (error) { next(error); }
});

router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = metricSchema.parse(req.body);
    const client = await prisma.client.findFirst({
      where: { id: data.clientId, practitionerId: req.user!.id },
    });
    if (!client) throw new AppError('Client not found', 404);

    const metric = await prisma.healthMetric.create({
      data: { ...data, userId: req.user!.id, recordedAt: data.recordedAt ? new Date(data.recordedAt) : new Date() },
    });
    res.status(201).json({ success: true, data: metric });
  } catch (error) { next(error); }
});

export { router as healthMetricRouter };
