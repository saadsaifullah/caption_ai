// server/index.js
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = 'https://picturecaption.app';

// ✅ Proper CORS middleware
app.use(cors({
  origin: YOUR_DOMAIN, // You can also use origin: true if deploying to multiple subdomains
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}));

// ✅ Important: Handle preflight requests manually
app.options('*', cors({
  origin: YOUR_DOMAIN,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
}), (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());

// ✅ Your create-checkout-session logic here...


app.post('/create-checkout-session', async (req, res) => {
  try {
    const { plan, amount } = req.body;

    if (plan === 'custom') {
      const usd = parseFloat(amount);
      if (isNaN(usd) || usd < 1) return res.status(400).json({ error: 'Minimum $1 required' });

      const cents = Math.round(usd * 100);
      const tokens = Math.floor(usd * 100);

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
        success_url: `${YOUR_DOMAIN}/success?tokens=${tokens}`,
        cancel_url: `${YOUR_DOMAIN}/subscribe?cancelled=true`,
        metadata: {
          type: 'custom',
          tokens: tokens.toString()
        }
      });

      return res.json({ url: session.url });
    }

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
      ? `${YOUR_DOMAIN}/success?tokens=${selected.tokens}`
      : `${YOUR_DOMAIN}/success`;

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
      cancel_url: `${YOUR_DOMAIN}/subscribe?cancelled=true`,
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

app.listen(4242, () => {
  console.log('✅ Server running on http://localhost:4242');
});
