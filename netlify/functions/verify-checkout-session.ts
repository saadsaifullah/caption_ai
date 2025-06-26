// netlify/functions/verify-checkout-session.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
});

export const handler = async (event: any) => {
  const session_id = event.queryStringParameters.session_id;
  if (!session_id) {
    return { statusCode: 400, body: 'Missing session ID' };
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: session.payment_status === 'paid',
        plan: session.metadata?.plan || null,
        tokens: session.metadata?.tokens || null,
        uid: session.metadata?.uid || null
      })
    };
  } catch (err) {
    console.error('Verify session failed:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to verify session' })
    };
  }
};
