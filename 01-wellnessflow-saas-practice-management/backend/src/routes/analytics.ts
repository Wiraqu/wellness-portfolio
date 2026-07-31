import { Router } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(authenticate);

router.get('/dashboard', async (req: AuthRequest, res, next) => {
  try {
    const practitionerId = req.user!.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [
      totalClients,
      activeClients,
      monthlyRevenue,
      upcomingAppointments,
      totalSessions,
      completedSessions,
      lastMonthRevenue,
    ] = await Promise.all([
      prisma.client.count({ where: { practitionerId } }),
      prisma.client.count({ where: { practitionerId, status: 'ACTIVE' } }),
      prisma.invoice.aggregate({
        where: { practitionerId, status: 'PAID', paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.appointment.count({
        where: { practitionerId, status: 'SCHEDULED', date: { gte: now } },
      }),
      prisma.appointment.count({ where: { practitionerId, date: { gte: startOfMonth } } }),
      prisma.appointment.count({ where: { practitionerId, status: 'COMPLETED', date: { gte: startOfMonth } } }),
      prisma.invoice.aggregate({
        where: { practitionerId, status: 'PAID', paidAt: { gte: startOfLastMonth, lt: startOfMonth } },
        _sum: { amount: true },
      }),
    ]);

    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    const revenueGrowth = lastMonthRevenue._sum.amount
      ? (((monthlyRevenue._sum.amount || 0) - (lastMonthRevenue._sum.amount || 0)) / (lastMonthRevenue._sum.amount || 1)) * 100
      : 0;

    res.json({
      success: true,
      data: {
        totalClients,
        activeClients,
        monthlyRevenue: monthlyRevenue._sum.amount || 0,
        upcomingAppointments,
        completionRate,
        revenueGrowth: Math.round(revenueGrowth),
        totalSessions,
      },
    });
  } catch (error) { next(error); }
});

router.get('/revenue', async (req: AuthRequest, res, next) => {
  try {
    const { months = 6 } = req.query;
    const practitionerId = req.user!.id;
    const results = [];

    for (let i = parseInt(months as string) - 1; i >= 0; i--) {
      const start = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1);
      const end = new Date(new Date().getFullYear(), new Date().getMonth() - i + 1, 1);
      const [revenue, sessions, clients] = await Promise.all([
        prisma.invoice.aggregate({
          where: { practitionerId, status: 'PAID', paidAt: { gte: start, lt: end } },
          _sum: { amount: true },
        }),
        prisma.appointment.count({ where: { practitionerId, date: { gte: start, lt: end } } }),
        prisma.client.count({ where: { practitionerId, createdAt: { gte: start, lt: end } } }),
      ]);
      results.push({ month: start.toLocaleString('default', { month: 'short' }), revenue: revenue._sum.amount || 0, sessions, clients });
    }
    res.json({ success: true, data: results });
  } catch (error) { next(error); }
});

export { router as analyticsRouter };
