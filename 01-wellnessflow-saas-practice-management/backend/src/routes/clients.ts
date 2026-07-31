import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest, requireSubscription } from '../middleware/auth';

const router = Router();

const clientSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  healthGoals: z.array(z.string()).default([]),
  notes: z.string().optional(),
});

router.use(authenticate);

// GET /api/clients
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const clients = await prisma.client.findMany({
      where: { practitionerId: req.user!.id },
      include: {
        appointments: { orderBy: { date: 'desc' }, take: 1 },
        healthMetrics: { orderBy: { recordedAt: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: clients });
  } catch (error) {
    next(error);
  }
});

// POST /api/clients
router.post('/', requireSubscription('STARTER', 'PROFESSIONAL', 'ENTERPRISE'), async (req: AuthRequest, res, next) => {
  try {
    const { name, email, healthGoals, notes } = clientSchema.parse(req.body);

    // Check client limit for starter tier
    if (req.user!.subscriptionTier === 'STARTER') {
      const count = await prisma.client.count({ where: { practitionerId: req.user!.id } });
      if (count >= 10) throw new AppError('Starter plan limited to 10 clients', 403);
    }

    // Create user for client
    const tempPassword = Math.random().toString(36).slice(-12);
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'CLIENT',
      },
    });

    const client = await prisma.client.create({
      data: {
        userId: user.id,
        practitionerId: req.user!.id,
        healthGoals,
        notes,
        status: 'ONBOARDING',
      },
    });

    res.status(201).json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// GET /api/clients/:id
router.get('/:id', async (req: AuthRequest, res, next) => {
  try {
    const client = await prisma.client.findFirst({
      where: { id: req.params.id, practitionerId: req.user!.id },
      include: {
        appointments: { orderBy: { date: 'desc' } },
        invoices: { orderBy: { createdAt: 'desc' } },
        healthMetrics: { orderBy: { recordedAt: 'desc' } },
      },
    });
    if (!client) throw new AppError('Client not found', 404);
    res.json({ success: true, data: client });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/clients/:id
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const client = await prisma.client.updateMany({
      where: { id: req.params.id, practitionerId: req.user!.id },
      data: req.body,
    });
    if (client.count === 0) throw new AppError('Client not found', 404);
    res.json({ success: true, message: 'Client updated' });
  } catch (error) {
    next(error);
  }
});

export { router as clientRouter };
