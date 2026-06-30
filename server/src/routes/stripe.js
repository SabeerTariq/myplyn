import { Router } from 'express';
import '../config/env.js';

const router = Router();

router.post('/webhook', async (req, res) => {
  if (process.env.PAYMENTS_MOCK === 'true') {
    return res.json({ received: true, mock: true });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return res.status(501).json({ error: 'Stripe not configured' });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(stripeKey);
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle funding
        break;
      case 'account.updated':
        // Handle Connect status
        break;
      case 'transfer.paid':
        // Handle payout complete
        break;
      default:
        break;
    }

    res.json({ received: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/connect/onboard', async (req, res) => {
  if (process.env.PAYMENTS_MOCK === 'true') {
    return res.json({ url: null, mock: true, message: 'Connect onboarding simulated' });
  }
  res.status(501).json({ error: 'Configure Stripe for Connect onboarding' });
});

export default router;
