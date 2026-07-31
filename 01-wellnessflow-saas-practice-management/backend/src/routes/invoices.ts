import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const invoiceSchema = z.object({
  clientId: z.string().uuid(),
  amount: z.number().positive(),
  service: z.string().min(1),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional(),
});

router.use(authenticate);

// GET /api/invoices
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { status } = req.query;
    const where: any = { practitionerId: req.user!.id };
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: { client: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: invoices });
  } catch (error) {
    next(error);
  }
});

// POST /api/invoices
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = invoiceSchema.parse(req.body);

    const client = await prisma.client.findFirst({
      where: { id: data.clientId, practitionerId: req.user!.id },
    });
    if (!client) throw new AppError('Client not found', 404);

    const invoice = await prisma.invoice.create({
      data: {
        ...data,
        practitionerId: req.user!.id,
        currency: 'USD',
        status: 'PENDING',
        dueDate: data.dueDate ? new Date(data.dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      include: { client: true },
    });

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/invoices/:id/status
router.patch('/:id/status', async (req: AuthRequest, res, next) => {
  try {
    const { status } = z.object({ status: z.enum(['PENDING', 'PAID', 'OVERDUE', 'REFUNDED']) }).parse(req.body);

    const invoice = await prisma.invoice.updateMany({
      where: { id: req.params.id, practitionerId: req.user!.id },
      data: { status, paidAt: status === 'PAID' ? new Date() : undefined },
    });
    if (invoice.count === 0) throw new AppError('Invoice not found', 404);
    res.json({ success: true, message: 'Invoice updated' });
  } catch (error) {
    next(error);
  }
});

export { router as invoiceRouter };
