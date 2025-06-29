// netlify/functions/webhook.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // use your current Stripe API version
});

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

  // ✅ You can log or process different event types if needed
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    console.log(`✅ Checkout completed for session: ${session.id}`);
  }

  return {
    statusCode: 200,
    body: '✅ Webhook received and verified',
  };
};
