# YMAW · ymaw.com

The Young Men's Adventure Weekend site: one continuous scroll journey through
the weekend (Friday dusk → Sunday), built with
[scrollcraft](https://github.com/nateherkai/scroll-craft) worldflight mode from
the weekend's own photo archive, plus a full online registration flow.

## Layout

```
index.html          the journey (worldflight; engine files scrollcraft.js/.css, never edited)
register.html/.js   4-step registration: parent → son → consent → payment
success.html        post-registration landing (card / e-transfer / assistance)
api/register.js     validates, stores in Supabase, creates Stripe Checkout
api/stripe-webhook.js  checkout.session.completed → payment_status='paid'
api/inquire.js      production-team / question form
supabase/migrations/   schema (RLS on, zero policies: service-role only)
scripts/build-assets.sh  photos → graded, scrubable dense-GOP legs + posters
src/photos/         the archive sources (2003–2025, real frames only)
scrollcraft/        BRIEF.md, fingerprint registry (design record)
```

## Registration paths

- **Card** → Stripe Checkout ($279 CAD) → webhook marks `paid`.
- **e-Transfer** → spot reserved as `pending`; parent sends to info@ymaw.com;
  mark `paid` by hand in Supabase (table editor) as transfers arrive.
- **Financial assistance** → stored as `aid_requested`; follow up personally.

**Demo mode is automatic and honest:** with no env vars set, the API answers
`{demo:true}`, stores nothing, and the success page says so.

## Provisioning (one-time)

1. **Supabase**: create a free project, run `supabase/migrations/0001_init.sql`
   in the SQL editor, copy `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`.
2. **Stripe**: create account; copy `STRIPE_SECRET_KEY` (test first). Add a
   webhook endpoint `https://<site>/api/stripe-webhook` for
   `checkout.session.completed`; copy `STRIPE_WEBHOOK_SECRET`.
3. **Vercel**: set the env vars from `.env.example`, deploy.
4. Point ymaw.com DNS at Vercel; set `PUBLIC_SITE_URL=https://ymaw.com`.

Admin = the Supabase table editor: `registrations` (mark e-transfers paid in
`payment_status`) and `inquiries`.

> The participation agreement in `register.html` (v2026-1) is a working draft.
> Have it reviewed by your insurer or lawyer before the first real season, and
> bump `waiver_version` if the text changes.

## Media

Legs are currently slow camera moves rendered from archive photographs
(`scripts/build-assets.sh`). When real footage lands, grade + encode it to the
same filenames (`assets/legN.mp4` / `legN-m.mp4`, dense GOP: `-g 8` desktop,
`-g 4` mobile, audio stripped) and re-extract posters from the encoded files;
nothing else changes.

## Verify

```
npm i playwright-core
node <scrollcraft-skill>/scripts/serve.mjs --root . --port 4500
node <scrollcraft-skill>/scripts/worldflight-assert.mjs --url http://localhost:4500
node <scrollcraft-skill>/scripts/shoot.mjs --url http://localhost:4500 --out lab/shots
```
