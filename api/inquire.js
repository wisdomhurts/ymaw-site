// POST /api/inquire - production-team interest and general questions.
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const d = req.body || {};
  if (d.website) return res.status(200).json({ ok: true });
  if (!d.name || !d.email) return res.status(400).json({ error: 'Name and email are needed.' });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return res.status(400).json({ error: 'That email does not look right.' });
  const kind = ['volunteer', 'question', 'aid'].includes(d.kind) ? d.kind : 'question';

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(200).json({ ok: true, demo: true });
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const ins = await supabase.from('inquiries').insert({
    kind,
    name: String(d.name).slice(0, 120),
    email: String(d.email).slice(0, 160),
    message: String(d.message || '').slice(0, 1000) || null
  });
  if (ins.error) {
    console.error('inquiry insert failed', ins.error);
    return res.status(500).json({ error: 'Could not save. Email info@ymaw.com instead.' });
  }
  return res.status(200).json({ ok: true });
}
