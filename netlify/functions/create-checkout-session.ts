// netlify/functions/create-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {

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
    let session;

    const baseUrl = 'https://picturecaption.app'; // ✅ Your live domain

    if (plan === 'monthly' || plan === 'yearly') {
      const price = plan === 'monthly' ? 900 : 8900;

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan === 'monthly' ? 'Monthly Plan' : 'Yearly Plan'
              },
              unit_amount: price
            },
            quantity: 1
          }
        ],
        metadata: {
          plan,
          uid
        },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/subscribe`
      });
    } else if (plan === 'custom' && amount) {
      const tokenAmount = parseFloat(amount);
      if (isNaN(tokenAmount) || tokenAmount < 1) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid amount' })
        };
      }

      const estimatedTokens = Math.floor(tokenAmount / 0.012);

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Custom Token Pack (${estimatedTokens} tokens)`
              },
              unit_amount: Math.round(tokenAmount * 100)
            },
            quantity: 1
          }
        ],
        metadata: {
          tokens: estimatedTokens.toString(),
          uid
        },
        success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/subscribe`
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server error' })
    };
  }
};
