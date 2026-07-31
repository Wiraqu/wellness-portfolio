import { Router } from 'express';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createCheckoutSession, cancelSubscription, STRIPE_PRICE_IDS } from '../services/stripe';

const router = Router();
router.use(authenticate);

router.post('/checkout', async (req: AuthRequest, res, next) => {
  try {
    const { tier } = req.body;
    const priceId = STRIPE_PRICE_IDS[tier as keyof typeof STRIPE_PRICE_IDS];
    if (!priceId) throw new AppError('Invalid subscription tier', 400);

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { stripeCustomerId: true, email: true, name: true },
    });
    if (!user?.stripeCustomerId) throw new AppError('Stripe customer not found', 400);

    const session = await createCheckoutSession(
      user.stripeCustomerId, priceId,
      `${process.env.FRONTEND_URL}/dashboard/billing?success=true`,
      `${process.env.FRONTEND_URL}/dashboard/billing?canceled=true`
    );
    res.json({ success: true, data: { sessionId: session.id, url: session.url } });
  } catch (error) { next(error); }
});

router.post('/cancel', async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { stripeSubscriptionId: true },
    });
    if (!user?.stripeSubscriptionId) throw new AppError('No active subscription', 400);

    await cancelSubscription(user.stripeSubscriptionId);
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { subscriptionTier: 'FREE', stripeSubscriptionId: null },
    });
    res.json({ success: true, message: 'Subscription cancelled' });
  } catch (error) { next(error); }
});

router.get('/plans', async (_req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'starter', name: 'Starter', price: 29, features: ['Up to 10 clients', 'Basic scheduling', 'Email reminders'] },
      { id: 'professional', name: 'Professional', price: 79, features: ['Unlimited clients', 'Telehealth', 'Analytics', 'Custom branding'] },
      { id: 'enterprise', name: 'Enterprise', price: 199, features: ['Multi-practitioner', 'API access', 'HIPAA compliance', 'Priority support'] },
    ],
  });
});

export { router as subscriptionRouter };
