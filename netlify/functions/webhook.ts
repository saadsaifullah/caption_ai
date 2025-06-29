import Stripe from 'stripe';
import * as admin from 'firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

// ✅ Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

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

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;
    const uid = session.metadata?.uid;
    const plan = session.metadata?.plan;
    const tokens = parseInt(session.metadata?.tokens || '0');

    if (!uid) {
      console.warn('⚠️ Missing UID in metadata. Skipping Firestore update.');
      return { statusCode: 200, body: 'Missing UID. Skipping update.' };
    }

    try {
      const userRef = db.collection('users').doc(uid);
      const userSnap = await userRef.get();

      // ✅ Update tokens
      if (tokens) {
        const prevTokens = userSnap.exists ? userSnap.data()?.tokens || 0 : 0;
        await userRef.set({ tokens: prevTokens + tokens }, { merge: true });
      }

      // ✅ Update subscription
      if (plan === 'monthly' || plan === 'yearly') {
        const expires = new Date();
        expires.setMonth(expires.getMonth() + (plan === 'monthly' ? 1 : 12));
        await userRef.set(
          {
            plan,
            planExpires: expires.toISOString(),
          },
          { merge: true }
        );
      }

      console.log(`✅ Firestore updated for user ${uid}`);
    } catch (error) {
      console.error('🔥 Failed to update Firestore:', error);
      return {
        statusCode: 500,
        body: 'Internal server error while updating user in Firestore',
      };
    }
  }

  return {
    statusCode: 200,
    body: 'Webhook received',
  };
};
