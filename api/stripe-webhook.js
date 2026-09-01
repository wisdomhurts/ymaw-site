// POST /api/stripe-webhook - Stripe calls this; we mark registrations paid.
// Configure the endpoint in the Stripe dashboard for the event
// `checkout.session.completed` and put its signing secret in
// STRIPE_WEBHOOK_SECRET. Signature verification needs the raw body.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const config = { api: { bodyParser: false } };

function rawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return res.status(503).json({ error: 'Stripe is not configured yet.' });
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      await rawBody(req),
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error('webhook signature failed', e.message);
    return res.status(400).json({ error: 'Bad signature' });
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object;
    if (s.payment_status === 'paid' && s.client_reference_id) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      const upd = await supabase.from('registrations').update({
        payment_status: 'paid',
        paid_at: new Date().toISOString(),
        stripe_payment_intent: typeof s.payment_intent === 'string' ? s.payment_intent : null
      }).eq('id', s.client_reference_id);
      if (upd.error) {
        console.error('mark-paid failed', upd.error);
        return res.status(500).json({ error: 'DB update failed' });
      }
    }
  }
  return res.status(200).json({ received: true });
}
