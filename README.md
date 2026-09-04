# ymaw.com · 2026 rebuild

The Young Men's Adventure Weekend site: a hero's-journey scroll through the weekend in real frames, two doors (the young man / the person bringing him), and a complete registration flow for young men, production men and sponsors. Next.js 16 · Tailwind 4 · GSAP ScrollTrigger + Lenis · Supabase · Stripe · Resend.

## Where things are

```
app/                      routes (App Router)
  page.tsx                The Threshold: hero, two doors, the ten-station journey, countdown, manifesto, men, register
  his-path/               the young man's door (second person)
  bringing-him/           the family's door
  the-weekend/            the weekend in six parts (lib/arc.ts; the hour-by-hour clock is kept in lib/schedule.ts)
  since-1990/             then-and-now pairs (lib/archive.ts)
  the-men/                departments, the 2026 team, values, Man Code, the fourteen standards
  support/  faq/  what-to-bring/   (what-to-bring is the printable field card; lib/packing.ts)
  register/               3 roles · components/register/RegisterFlow.tsx
  register/sign/[token]/  the young man's own signing link
  thank-you/              "the walk out" confirmation (card / e-transfer / assistance)
  admin/                  key-protected list, mark paid, notes, CSV export
  api/register            validates (zod), stores in Supabase, Stripe Checkout, emails, sheet row
  scripts/sheets-webhook.gs  Apps Script that receives sheet rows/updates (see Google Sheets below)
  api/stripe/webhook      checkout.session.completed → payment_status = paid → receipt
  api/sign                GET (token info) / POST (his initials + signature)
  api/inquire             questions / partners / aid / media
  api/admin               GET list (json|csv) · POST { id, payment_status, notes }
components/               Hero, Journey, TrailRail, Media (Still/Clip), Nav, Footer, FireMark, Countdown, Timeline, Reveal, ShareButton…
lib/facts.ts              every locked fact and number (price, dates, stops, values, standards, 2026 team)
lib/journey.ts            the ten stations, two voices each
lib/legal.ts              agreements, medical consent, waivers (versioned), media choices
lib/schema.ts             zod schemas shared by client and server
lib/server.ts             Supabase, Stripe, Resend, Sheets helpers (server only)
public/media/             real frames only (stills/*.webp, clips/*.mp4). lib/media.ts is the manifest.
public/brand/             marks, lockups, T-shirt print files (text outlined), poster, mockups
```

## Env vars

See `.env.example`. The site runs without them in an honest demo mode (nothing stored; the thank-you page says so).

| Var | Where |
|---|---|
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Supabase → project **ymaw** → Settings → API. Schema already applied (`registrations`, `inquiries`; RLS on, no policies: service role only). |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Stripe → Developers. Add webhook endpoint `https://ymaw.com/api/stripe/webhook` for `checkout.session.completed` (and `checkout.session.async_payment_succeeded`). Apple Pay / Google Pay appear automatically in Checkout once the domain is registered in Stripe → Payment methods. |
| `RESEND_API_KEY`, `RESEND_FROM`, `NOTIFY_EMAIL` | Resend. Verify `ymaw.com` (DNS) to send from info@ymaw.com; until then `onboarding@resend.dev` only delivers to the account owner. `NOTIFY_EMAIL` (info@ymaw.com) gets every form in full: each registration with every field and how it's being paid, each card payment when it lands, each contact-form message, each mailing-list signup. Reply-to is set to the person who wrote. |
| `SHEETS_WEBHOOK_URL`, `SHEETS_WEBHOOK_SECRET` | Optional Google Sheet mirror, see below. |
| `GHL_API_KEY` + `GHL_LOCATION_ID`, or `GHL_WEBHOOK_URL` | GoHighLevel, the Society's mailing list. Every mailing-list signup (homepage, FAQ, Support) and every contact-form message is upserted as a GHL contact with tags (`ymaw-mailing-list`, `rising-the-man-within`, `the-forged-circle`, `ymaw-inquiry-<kind>`). API path: Settings → Private Integrations → token with `contacts.write`, plus the Location ID. Webhook path: a workflow with an Inbound Webhook trigger; we POST `email, name, first_name, last_name, phone, tags, source, lists, where`. |
| `ADMIN_KEY` | Any long random string. Unlocks `/admin`. |
| `PUBLIC_SITE_URL` | `https://ymaw.com` (preview deploys can leave it unset). |

## Google Sheets (live registrations, 5 minutes)

Three spreadsheets live in the Drive folder **YMAW 2026 Registrations**: *Young Men*, *Production Men*, *Sponsors*. The site pushes every new registration into the right one, and later changes (paid by card, admin status/notes, the young man signing) update the row by Ref. Health numbers never leave the site.

1. Open **YMAW 2026 · Young Men** → Extensions → Apps Script → paste `scripts/sheets-webhook.gs` → set `SECRET` to something long.
2. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone** → copy the web app URL.
3. Vercel → env vars: `SHEETS_WEBHOOK_URL` = that URL, `SHEETS_WEBHOOK_SECRET` = the same secret → Redeploy.

The script owns the header rows: if a column is missing it adds it at the end, so the sheets can be re-ordered freely and old rows keep their place.

## Live since Sept 4, 2026

`https://ymaw.com` is the canonical address. `www.ymaw.com` and `ymaw.vercel.app` 308-redirect to it. DNS (Google nameservers): A `@` → `216.198.79.1`, CNAME `www` → `65711fde6896792c.vercel-dns-017.com`; the MX/TXT records are email and were left alone. Stripe is live on the Ymaw account (`acct_1Mz3b7…`) with webhook `ymaw-site-registrations` → `https://ymaw.com/api/stripe/webhook`. Not yet set: `RESEND_API_KEY` (no emails go out), `SHEETS_WEBHOOK_*` (sheets are not live yet).

**Deploying.** The Vercel project `ymaw` is not git-connected. It builds from a one-file bootstrap: the install command clones `next-2026` from GitHub, then `next build`. So after pushing to `next-2026`, deploy with the same call every time (Vercel MCP `deploy_to_vercel`, project `ymaw`, target `production`, files `[BOOTSTRAP.md]`, projectSettings `{ framework: "nextjs", installCommand: "rm -rf /tmp/src && git clone --depth 1 --branch next-2026 https://github.com/wisdomhurts/ymaw-site /tmp/src && rm -rf /tmp/src/.git && cp -a /tmp/src/. . && npm install", buildCommand: "npm run build" }`). Two things bit us on Sept 4: the dashboard **Redeploy** button re-uploads only the bootstrap file and ships an empty site (404 everywhere), and omitting `framework: "nextjs"` from that call resets the project's Framework Preset to *Other*, which also ships an empty site. The project settings now carry both, so a dashboard Redeploy should work, but the call above is the known-good path.

**Config check.** `GET /api/admin?key=…&diag=1` reports which services the running deployment can actually see (set / length / prefix, never values). Use it before blaming code.

## Still to do

1. Resend: sign up as info@ymaw.com, set `RESEND_API_KEY` (team notifications work at once), verify ymaw.com (three DNS records) so parents and young men get their emails too.
2. GHL: paste `GHL_API_KEY` + `GHL_LOCATION_ID` (or `GHL_WEBHOOK_URL`) so the mailing-list forms feed the CRM.
3. Google Sheets live feed (section above).
4. Stripe → Payment methods → register `ymaw.com` for Apple Pay / Google Pay.
5. Redirect old URLs: `/registration/`, `/registration-2/`, `/the-weekend/`, `/history/`, `/leadership/`, `/gallery/`, `/contact/` — configured in `next.config.ts`; check them once after cancelling WP Engine.
6. Print the field card once; hand the T-shirt SVGs to the shop.

## Media

Every frame is real. Add stills as WebP (1800px and 900px `-m`) to `public/media/stills`, clips as H.264 MP4 (720p, muted, 5–10 s) to `public/media/clips`, then register them in `lib/media.ts`. Map a still or clip to a station in `lib/journey.ts`, to an hour in `lib/schedule.ts`, or to a year in `lib/archive.ts`.

## Language

Young men, never boys. Production men, not staff. The weekend, not the event. Rite of passage, not program. Nothing invented: price, ages, dates, stops, since 1990, and the Society's own counts.
