import Stripe from 'stripe';
import { logger } from './logger';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

export const STRIPE_PRICE_IDS = {
  starter: process.env.STRIPE_PRICE_STARTER!,
  professional: process.env.STRIPE_PRICE_PROFESSIONAL!,
  enterprise: process.env.STRIPE_PRICE_ENTERPRISE!,
};

export const createCustomer = async (email: string, name: string) => {
  return stripe.customers.create({ email, name });
};

export const createSubscription = async (customerId: string, priceId: string) => {
  return stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    expand: ['latest_invoice.payment_intent'],
  });
};

export const createCheckoutSession = async (customerId: string, priceId: string, successUrl: string, cancelUrl: string) => {
  return stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    subscription_data: { trial_period_days: 14 },
  });
};

export const cancelSubscription = async (subscriptionId: string) => {
  return stripe.subscriptions.cancel(subscriptionId);
};

export const constructEvent = (payload: Buffer, signature: string) => {
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET!);
};

export default stripe;
