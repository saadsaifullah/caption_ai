 
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { plan, amount } = JSON.parse(event.body);

    const domain = 'https://picturecaption.app';

    const plans = {
      monthly: { price: 900, name: 'Monthly Plan' },
      yearly: { price: 8900, name: 'Yearly Plan' },
      tokens1000: { price: 1200, name: '1,000 Tokens', tokens: 1000 },
      tokens10000: { price: 9900, name: '10,000 Tokens', tokens: 10000 },
    };

    // Custom token logic
    if (plan === 'custom') {
      const usd = parseFloat(amount);
      if (isNaN(usd) || usd < 1) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Minimum $1 required' }),
        };
      }

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
        success_url: `${domain}/success?tokens=${tokens}`,
        cancel_url: `${domain}/subscribe?cancelled=true`,
        metadata: { type: 'custom', tokens: tokens.toString() },
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ url: session.url }),
      };
    }

    // Standard plan logic
    const selected = plans[plan];
    if (!selected) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid plan' }),
      };
    }

    const successUrl = selected.tokens
      ? `${domain}/success?tokens=${selected.tokens}`
      : `${domain}/success`;

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
      cancel_url: `${domain}/subscribe?cancelled=true`,
      metadata: {
        type: selected.tokens ? 'token_pack' : 'subscription',
        tokens: selected.tokens ? selected.tokens.toString() : '0',
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Stripe Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' }),
    };
  }
};
