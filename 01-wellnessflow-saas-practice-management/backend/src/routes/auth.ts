import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../server';
import { AppError } from '../middleware/errorHandler';
import { authenticate, AuthRequest } from '../middleware/auth';
import { createCustomer } from '../services/stripe';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['PRACTITIONER', 'CLIENT']).default('PRACTITIONER'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, name, role } = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) throw new AppError('Email already registered', 409);

    const hashedPassword = await bcrypt.hash(password, 12);

    // Create Stripe customer for practitioners
    let stripeCustomerId: string | undefined;
    if (role === 'PRACTITIONER') {
      const customer = await createCustomer(email, name);
      stripeCustomerId = customer.id;
    }

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        stripeCustomerId,
        ...(role === 'PRACTITIONER' && {
          practitionerProfile: { create: {} },
        }),
      },
      select: { id: true, email: true, name: true, role: true, subscriptionTier: true },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({ success: true, data: { user, token } });
  } catch (error) {
    next(error);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError('Invalid credentials', 401);

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new AppError('Invalid credentials', 401);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
        },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, name: true, role: true,
        subscriptionTier: true, avatar: true, createdAt: true,
        practitionerProfile: true,
      },
    });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };
