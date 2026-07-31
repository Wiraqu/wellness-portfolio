import { loadStripe } from '@stripe/stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for solo practitioners',
    price: 29,
    interval: 'month' as const,
    features: ['Up to 10 clients', 'Basic scheduling', 'Email reminders', 'Stripe payments'],
    stripePriceId: 'price_starter_001'
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'For growing practices',
    price: 79,
    interval: 'month' as const,
    features: ['Unlimited clients', 'Advanced scheduling', 'Telehealth', 'Analytics dashboard', 'Custom branding'],
    stripePriceId: 'price_pro_001'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For multi-practitioner clinics',
    price: 199,
    interval: 'month' as const,
    features: ['Everything in Pro', 'Multi-practitioner', 'API access', 'HIPAA compliance', 'Priority support'],
    stripePriceId: 'price_enterprise_001'
  }
];
