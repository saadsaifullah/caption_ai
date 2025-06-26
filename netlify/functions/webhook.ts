import Stripe from 'stripe';
import { buffer } from 'micro';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../src/firebase'; // adjust if your path is different

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
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
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const uid = session.metadata?.uid;
    const plan = session.metadata?.plan;
    const tokens = parseInt(session.metadata?.tokens || '0');

    if (!uid) {
      console.warn('⚠️ Missing UID in metadata. Skipping Firestore update.');
      return { statusCode: 200, body: 'Missing UID. Skipping update.' };
    }

    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    // Token purchase
    if (tokens) {
      const prevTokens = userSnap.exists() ? userSnap.data()?.tokens || 0 : 0;
      await setDoc(userRef, { tokens: prevTokens + tokens }, { merge: true });
    }

    // Subscription purchase
    if (plan === 'monthly' || plan === 'yearly') {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + (plan === 'monthly' ? 1 : 12));
      await setDoc(userRef, {
        plan,
        planExpires: expires.toISOString()
      }, { merge: true });
    }

    console.log(`✅ Firestore updated for user ${uid}`);
  }

  return { statusCode: 200, body: 'Webhook received' };
};
