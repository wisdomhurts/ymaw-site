import { NextResponse } from "next/server";
import { supabase, pushToSheet } from "@/lib/server";

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
  if (new URL(req.url).searchParams.get("diag")) {
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
