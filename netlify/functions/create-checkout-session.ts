// netlify/functions/create-checkout-session.ts
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-05-28.basil', // match exactly
});


export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { plan, amount, uid } = JSON.parse(event.body);

    if (!uid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User ID (uid) is required.' }),
      };
    }

    const baseUrl = 'https://picturecaption.app'; // ✅ Your production domain

    let price = 0;
    let name = '';
    const metadata: { [key: string]: string } = { uid };

    // Subscription plans
    if (plan === 'monthly') {
      price = 900;
      name = 'Monthly Plan';
      metadata.plan = 'monthly';
    } else if (plan === 'yearly') {
      price = 8900;
      name = 'Yearly Plan';
      metadata.plan = 'yearly';
    }

    // Fixed token packs
    else if (plan === 'tokens1000') {
      price = 1200;
      name = 'Token Pack (1,000 tokens)';
      metadata.tokens = '1000';
    } else if (plan === 'tokens10000') {
      price = 9900;
      name = 'Token Pack (10,000 tokens)';
      metadata.tokens = '10000';
    }

    // Custom token amount
    else if (plan === 'custom' && amount) {
      const tokenAmount = parseFloat(amount);
      if (isNaN(tokenAmount) || tokenAmount < 1) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid amount: must be at least $1' }),
        };
      }

      const estimatedTokens = Math.floor(tokenAmount / 0.012);
      price = Math.round(tokenAmount * 100); // in cents
      name = `Custom Token Pack (~${estimatedTokens} tokens)`;
      metadata.tokens = estimatedTokens.toString();
      metadata.plan = 'custom';
    }

    // Invalid plan
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid plan or missing amount' }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name },
            unit_amount: price,
          },
          quantity: 1,
        },
      ],
      metadata,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error: any) {
    console.error('❌ Stripe Checkout Error:', error.message || error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
