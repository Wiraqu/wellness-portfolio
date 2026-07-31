import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

const appointmentSchema = z.object({
  clientId: z.string().uuid(),
  title: z.string().min(1),
  date: z.string().datetime(),
  duration: z.number().min(15).max(240).default(60),
  type: z.enum(['INITIAL', 'FOLLOWUP', 'GROUP', 'TELEHEALTH']).default('FOLLOWUP'),
  notes: z.string().optional(),
});

router.use(authenticate);

// GET /api/appointments
router.get('/', async (req: AuthRequest, res, next) => {
  try {
    const { status, startDate, endDate } = req.query;
    const where: any = { practitionerId: req.user!.id };

    if (status) where.status = status;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: { client: true },
      orderBy: { date: 'asc' },
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
});

// POST /api/appointments
router.post('/', async (req: AuthRequest, res, next) => {
  try {
    const data = appointmentSchema.parse(req.body);

    // Verify client belongs to practitioner
    const client = await prisma.client.findFirst({
      where: { id: data.clientId, practitionerId: req.user!.id },
    });
    if (!client) throw new AppError('Client not found', 404);

    const appointment = await prisma.appointment.create({
      data: {
        ...data,
        date: new Date(data.date),
        practitionerId: req.user!.id,
      },
      include: { client: true },
    });

    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/appointments/:id
router.patch('/:id', async (req: AuthRequest, res, next) => {
  try {
    const appointment = await prisma.appointment.updateMany({
      where: { id: req.params.id, practitionerId: req.user!.id },
      data: req.body,
    });
    if (appointment.count === 0) throw new AppError('Appointment not found', 404);
    res.json({ success: true, message: 'Appointment updated' });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', async (req: AuthRequest, res, next) => {
  try {
    const appointment = await prisma.appointment.deleteMany({
      where: { id: req.params.id, practitionerId: req.user!.id },
    });
    if (appointment.count === 0) throw new AppError('Appointment not found', 404);
    res.json({ success: true, message: 'Appointment deleted' });
  } catch (error) {
    next(error);
  }
});

export { router as appointmentRouter };
