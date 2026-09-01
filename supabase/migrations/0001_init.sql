-- YMAW registrations + inquiries.
-- RLS is enabled with NO policies on purpose: no anon or authenticated access
-- at all. Only the service role key (used by the Vercel functions) can read
-- or write. The admin view is the Supabase table editor.
create table if not exists public.registrations (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  created_at timestamptz not null default now(),
  event text not null default 'fall-2026',

  parent_name text not null,
  parent_email text not null,
  parent_phone text not null,

  son_first text not null,
  son_last text not null,
  son_age int not null check (son_age between 12 and 17),

  emergency_name text not null,
  emergency_phone text not null,
  medical_notes text,

  consent_waiver boolean not null default false,
  waiver_version text not null default 'v2026-1',
  consented_at timestamptz,
  photo_consent boolean not null default false,

  payment_method text not null check (payment_method in ('card','etransfer','aid')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending','paid','aid_requested','waived','refunded','cancelled')),
  amount_cents int not null default 27900,
  currency text not null default 'CAD',
  stripe_session_id text,
  stripe_payment_intent text,
  paid_at timestamptz,

  notes text
);
alter table public.registrations enable row level security;

create index if not exists registrations_event_idx on public.registrations (event, payment_status);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  kind text not null default 'question' check (kind in ('volunteer','question','aid')),
  name text not null,
  email text not null,
  message text,
  handled boolean not null default false
);
alter table public.inquiries enable row level security;
