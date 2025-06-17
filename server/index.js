// server/index.js
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // 🔐 Stripe Secret Key

const YOUR_FRONTEND_DOMAIN = 'https://picturecaption.app';

// --- CORS Setup ---
app.use(cors({
  origin: YOUR_FRONTEND_DOMAIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

// Explicitly handle OPTIONS preflight requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', YOUR_FRONTEND_DOMAIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.sendStatus(200);
});

app.use(express.json());

// --- Main Endpoint ---
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { plan, amount } = req.body;

    // Custom token purchase
    if (plan === 'custom') {
      const usd = parseFloat(amount);
      if (isNaN(usd) || usd < 1) {
        return res.status(400).json({ error: 'Minimum $1 required' });
      }

      const cents = Math.round(usd * 100);
      const tokens = Math.floor(usd * 100); // $1 = 100 tokens

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: { name: 'Custom Token Pack' },
            unit_amount: cents,
          },
          quantity: 1,
        }],
        success_url: `${YOUR_FRONTEND_DOMAIN}/success?tokens=${tokens}`,
        cancel_url: `${YOUR_FRONTEND_DOMAIN}/subscribe?cancelled=true`,
        metadata: {
          type: 'custom',
          tokens: tokens.toString()
        }
      });

      return res.json({ url: session.url });
    }

    // Standard plans
    const plans = {
      monthly: { price: 900, name: 'Monthly Plan' },
      yearly: { price: 8900, name: 'Yearly Plan' },
      tokens1000: { price: 1200, name: '1,000 Tokens', tokens: 1000 },
      tokens10000: { price: 9900, name: '10,000 Tokens', tokens: 10000 },
    };

    const selected = plans[plan];
    if (!selected) {
      console.error('❌ Invalid plan:', plan);
      return res.status(400).json({ error: 'Invalid plan' });
    }

    const successUrl = selected.tokens
      ? `${YOUR_FRONTEND_DOMAIN}/success?tokens=${selected.tokens}`
      : `${YOUR_FRONTEND_DOMAIN}/success`;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: selected.name },
          unit_amount: selected.price,
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: `${YOUR_FRONTEND_DOMAIN}/subscribe?cancelled=true`,
      metadata: {
        type: selected.tokens ? 'token_pack' : 'subscription',
        tokens: selected.tokens ? selected.tokens.toString() : '0',
      }
    });

    console.log('✅ Checkout session created:', session.url);
    res.json({ url: session.url });

  } catch (error) {
    console.error('❌ Stripe session error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Start Server ---
const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
