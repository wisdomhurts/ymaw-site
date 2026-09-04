import { NextResponse } from "next/server";
import { supabase, pushToSheet, sendMail, mailShell, SITE_URL } from "@/lib/server";
import { FACTS } from "@/lib/facts";

export const runtime = "nodejs";

function authorized(req: Request) {
  const key = process.env.ADMIN_KEY;
  if (!key) return false;
  const given = req.headers.get("x-admin-key") || new URL(req.url).searchParams.get("key");
  return given === key;
}

// GET /api/admin?key=… [&format=csv]  → registrations for the event
// GET /api/admin?key=…&diag=1          → which services are configured (never the values)
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const diag = new URL(req.url).searchParams.get("diag");
  // ?diag=mail → send one test email to NOTIFY_EMAIL and report Resend's answer
  // verbatim, plus which domains the Resend account has verified. This is how
  // we learn whether info@ymaw.com can actually be reached.
  if (diag === "mail") {
    const key = process.env.RESEND_API_KEY;
    if (!key) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
    const domains = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${key}` } })
      .then(async (r) => ({ status: r.status, body: (await r.json().catch(() => ({}))) as { data?: { name: string; status: string; region?: string }[] } }))
      .catch((e) => ({ status: 0, body: { error: String(e) } as unknown as { data?: [] } }));
    const to = (process.env.NOTIFY_EMAIL || FACTS.email).split(",").map((s) => s.trim());
    const sent = await sendMail({ to, subject: `YMAW site · test notification · ${new Date().toISOString().slice(0, 16)}`, html: mailShell("Notifications are live.", `<p>This is a test sent from ${SITE_URL}/api/admin?diag=mail. If you're reading it in ${to.join(", ")}, every form on the site reaches this inbox.</p>`) });
    return NextResponse.json({ to, from: process.env.RESEND_FROM || "YMAW <onboarding@resend.dev>", sent, domains: domains.body.data?.map((d) => ({ name: d.name, status: d.status })) ?? domains.body });
  }
  if (diag) {
    const has = (k: string) => {
      const v = process.env[k];
      return v ? { set: true, length: v.length, prefix: v.slice(0, 8) } : { set: false };
    };
    return NextResponse.json({
      supabase: has("SUPABASE_URL").set && has("SUPABASE_SERVICE_ROLE_KEY").set,
      stripe_secret_key: has("STRIPE_SECRET_KEY"),
      stripe_webhook_secret: has("STRIPE_WEBHOOK_SECRET"),
      resend: has("RESEND_API_KEY").set,
      sheets_webhook: has("SHEETS_WEBHOOK_URL").set && has("SHEETS_WEBHOOK_SECRET").set,
      ghl: has("GHL_API_KEY").set && has("GHL_LOCATION_ID").set ? "api" : has("GHL_WEBHOOK_URL").set ? "webhook" : false,
      site_url: process.env.PUBLIC_SITE_URL || null,
      notify_email: process.env.NOTIFY_EMAIL || null,
      env: process.env.VERCEL_ENV || null,
    });
  }
  const db = supabase();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const q = await db.from("registrations").select("*").order("created_at", { ascending: false }).limit(1000);
  if (q.error) return NextResponse.json({ error: q.error.message }, { status: 500 });
  const rows = q.data.map((r) => ({ ...r, health_number: r.health_number ? "•••" + String(r.health_number).slice(-3) : null }));
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    const cols = Object.keys(rows[0] || { ref: "" });
    const esc = (v: unknown) => `"${String(v == null ? "" : typeof v === "object" ? JSON.stringify(v) : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc((r as Record<string, unknown>)[c])).join(","))].join("\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="ymaw-registrations.csv"` } });
  }
  return NextResponse.json({ rows });
}

// POST /api/admin { id, payment_status?, notes? }
export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabase();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const b = (await req.json().catch(() => ({}))) as { id?: string; payment_status?: string; notes?: string };
  if (!b.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (b.payment_status) {
    patch.payment_status = b.payment_status;
    if (b.payment_status === "paid") patch.paid_at = new Date().toISOString();
  }
  if (typeof b.notes === "string") patch.notes = b.notes.slice(0, 2000);
  const upd = await db.from("registrations").update(patch).eq("id", b.id).select("id, ref, payment_status").single();
  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });
  await pushToSheet({ kind: "update", ref: upd.data.ref, ...patch });
  return NextResponse.json({ ok: true, row: upd.data });
}
