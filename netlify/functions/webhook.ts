import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // No apiVersion here

export const config = {
  api: {
    bodyParser: false,
  },
};

export const handler = async (event: any) => {
  const sig = event.headers['stripe-signature'];

  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      Buffer.from(event.body, 'utf8'),
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // ✅ Log session for debugging
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    console.log('✅ Checkout session completed:', {
      uid: session.metadata?.uid,
      plan: session.metadata?.plan,
      tokens: session.metadata?.tokens,
    });

    // You are handling Firestore on the frontend now,
    // so we only log and acknowledge the webhook.
  }

  return {
    statusCode: 200,
    body: 'Webhook received successfully',
  };
};
