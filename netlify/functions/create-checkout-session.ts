// netlify/functions/create-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15' // Add your preferred version
});

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const { plan, amount, uid } = JSON.parse(event.body);
    const baseUrl = 'https://picturecaption.app'; // ✅ Live production domain

    let session;
    let price = 0;
    let name = '';
    let metadata: { [key: string]: string } = { uid };

    // Subscription plans
    if (plan === 'monthly') {
      price = 900; // $9.00
      name = 'Monthly Plan';
      metadata.plan = 'monthly';
    } else if (plan === 'yearly') {
      price = 8900; // $89.00
      name = 'Yearly Plan';
      metadata.plan = 'yearly';
    }

    // Fixed token packs
    else if (plan === 'tokens1000') {
      price = 1200; // $12.00
      name = 'Token Pack (1,000 tokens)';
      metadata.tokens = '1000';
    } else if (plan === 'tokens10000') {
      price = 9900; // $99.00
      name = 'Token Pack (10,000 tokens)';
      metadata.tokens = '10000';
    }

    // Custom token plan
    else if (plan === 'custom' && amount) {
      const tokenAmount = parseFloat(amount);
      if (isNaN(tokenAmount) || tokenAmount < 1) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid amount' })
        };
      }

      const estimatedTokens = Math.floor(tokenAmount / 0.012);
      price = Math.round(tokenAmount * 100);
      name = `Custom Token Pack (~${estimatedTokens} tokens)`;
      metadata.tokens = estimatedTokens.toString();
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid plan' })
      };
    }

    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: { name },
            unit_amount: price
          },
          quantity: 1
        }
      ],
      metadata,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/subscribe`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
