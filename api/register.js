// POST /api/register - create a registration, then route by payment path:
//   card       -> Stripe Checkout session, respond { url }
//   etransfer  -> record as pending,   respond { ok, ref }
//   aid        -> record aid request,  respond { ok, ref }
// With no SUPABASE_URL configured the endpoint answers { demo: true } and
// stores nothing, so the deployed site works honestly before provisioning.
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { randomBytes } from 'node:crypto';

const PRICE_CENTS = 27900;
const EVENT = 'fall-2026';

function makeRef() {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  const b = randomBytes(5);
  let s = '';
  for (let i = 0; i < 5; i++) s += alphabet[b[i] % alphabet.length];
  return 'YMAW-' + s;
}

function bad(res, msg) { return res.status(400).json({ error: msg }); }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const d = req.body || {};

  // Honeypot: bots fill every field; parents never see this one.
  if (d.website) return res.status(200).json({ ok: true, ref: makeRef() });

  const need = ['parent_name', 'parent_email', 'parent_phone', 'son_first',
    'son_last', 'son_age', 'emergency_name', 'emergency_phone', 'payment_method'];
  for (const k of need) {
    if (!d[k] || String(d[k]).trim() === '') return bad(res, 'Missing: ' + k.replace(/_/g, ' '));
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.parent_email)) return bad(res, 'That email does not look right.');
  const age = parseInt(d.son_age, 10);
  if (!(age >= 12 && age <= 17)) return bad(res, 'YMAW is for boys aged 12 to 17.');
  if (!['card', 'etransfer', 'aid'].includes(d.payment_method)) return bad(res, 'Unknown payment method.');
  if (d.consent_waiver !== true && d.consent_waiver !== 'true') return bad(res, 'The participation agreement has to be accepted.');
  const clip = (v, n) => String(v || '').slice(0, n);

  const ref = makeRef();

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(200).json({ ok: true, demo: true, ref });
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const row = {
    ref,
    parent_name: clip(d.parent_name, 120),
    parent_email: clip(d.parent_email, 160),
    parent_phone: clip(d.parent_phone, 40),
    son_first: clip(d.son_first, 80),
    son_last: clip(d.son_last, 80),
    son_age: age,
    emergency_name: clip(d.emergency_name, 120),
    emergency_phone: clip(d.emergency_phone, 40),
    medical_notes: clip(d.medical_notes, 2000) || null,
    consent_waiver: true,
    waiver_version: clip(d.waiver_version, 20) || 'v2026-1',
    consented_at: new Date().toISOString(),
    photo_consent: d.photo_consent === true || d.photo_consent === 'true',
    payment_method: d.payment_method,
    payment_status: d.payment_method === 'aid' ? 'aid_requested' : 'pending',
    amount_cents: PRICE_CENTS,
    event: EVENT
  };
  const ins = await supabase.from('registrations').insert(row).select('id').single();
  if (ins.error) {
    console.error('register insert failed', ins.error);
    return res.status(500).json({ error: 'Could not save the registration. Email info@ymaw.com and we will register him by hand.' });
  }

  if (d.payment_method !== 'card') return res.status(200).json({ ok: true, ref });

  if (!process.env.STRIPE_SECRET_KEY) {
    // Registration is stored; card rails just aren't live yet.
    await supabase.from('registrations').update({ payment_method: 'etransfer' }).eq('id', ins.data.id);
    return res.status(200).json({ ok: true, ref, demo: false, url: null, fallback: 'etransfer' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const origin = process.env.PUBLIC_SITE_URL ||
    ('https://' + (req.headers['x-forwarded-host'] || req.headers.host));
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      client_reference_id: ins.data.id,
      customer_email: row.parent_email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'cad',
          unit_amount: PRICE_CENTS,
          product_data: {
            name: 'YMAW Fall 2026 · Registration for ' + row.son_first,
            description: 'Young Men’s Adventure Weekend, Vancouver BC. All meals, activities and equipment included.'
          }
        }
      }],
      metadata: { ref, event: EVENT },
      success_url: origin + '/success.html?path=card&ref=' + ref + '&son=' + encodeURIComponent(row.son_first),
      cancel_url: origin + '/register.html?canceled=1'
    });
    await supabase.from('registrations').update({ stripe_session_id: session.id }).eq('id', ins.data.id);
    return res.status(200).json({ ok: true, ref, url: session.url });
  } catch (e) {
    console.error('stripe session failed', e);
    return res.status(500).json({ error: 'Card checkout is unavailable right now. Choose e-Transfer, or email info@ymaw.com.' });
  }
}
