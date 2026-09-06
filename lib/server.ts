// Server-only helpers: Supabase (service role), Stripe, Resend, Sheets webhook.
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import Stripe from "stripe";
import { randomBytes } from "node:crypto";
import { FACTS } from "./facts";

export const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://ymaw.com").replace(/\/$/, "");

export function supabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function stripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function makeRef() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const b = randomBytes(5);
  let s = "";
  for (let i = 0; i < 5; i++) s += alphabet[b[i] % alphabet.length];
  return `YMAW-${s}`;
}

export function makeToken() {
  return randomBytes(24).toString("base64url");
}

export const clip = (v: unknown, n: number) => (v == null ? null : String(v).slice(0, n)) || null;

/* ───────────── Email (Resend) ───────────── */
type Attachment = { filename: string; content: Uint8Array | Buffer };
type Mail = { to: string | string[]; subject: string; html: string; text?: string; replyTo?: string; attachments?: Attachment[] };

export async function sendMail(m: Mail): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  const from = process.env.RESEND_FROM || `YMAW <onboarding@resend.dev>`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from, to: m.to, subject: m.subject, html: m.html, text: m.text,
        reply_to: m.replyTo || FACTS.email,
        // Resend takes attachment content as base64.
        attachments: m.attachments?.map((a) => ({ filename: a.filename, content: Buffer.from(a.content).toString("base64") })),
      }),
    });
    const j = (await r.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!r.ok) return { ok: false, error: j.message || `resend ${r.status}` };
    return { ok: true, id: j.id };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export function mailShell(title: string, bodyHtml: string) {
  return `<!doctype html><html><body style="margin:0;background:#0a0d11;color:#f1ece1;font-family:Helvetica,Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px">
    <p style="font:800 28px/1 Impact,'Arial Narrow',sans-serif;letter-spacing:.04em;margin:0 0 6px">YMAW</p>
    <p style="font:12px/1.4 Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;color:#a9a89c;margin:0 0 24px">Young Men's Adventure Weekend · Since 1990</p>
    <h1 style="font:800 30px/1.05 Impact,'Arial Narrow',sans-serif;margin:0 0 16px;color:#f1ece1">${title}</h1>
    <div style="font-size:16px;line-height:1.55;color:#e6e1d6">${bodyHtml}</div>
    <hr style="border:0;border-top:1px solid rgba(241,236,225,.15);margin:28px 0">
    <p style="font-size:13px;color:#a9a89c;margin:0">Questions: reply to this email or write to <a href="mailto:${FACTS.email}" style="color:#e8652a">${FACTS.email}</a>.<br>${FACTS.society}</p>
  </div></body></html>`;
}

/* ───────────── Google Sheet (Apps Script webhook) ───────────── */

// Where the sheet lives can come from the environment or from the settings
// table. The table exists so the endpoint can be changed without a redeploy,
// and so a value that is a capability rather than a secret does not have to be
// pasted into a dashboard by hand. Read once per warm instance.
let sheetUrl: string | null | undefined;

async function sheetWebhookUrl(): Promise<string | null> {
  if (process.env.SHEETS_WEBHOOK_URL) return process.env.SHEETS_WEBHOOK_URL;
  if (sheetUrl !== undefined) return sheetUrl;
  const db = supabase();
  if (!db) return (sheetUrl = null);
  const q = await db.from("settings").select("value").eq("key", "sheets_webhook_url").maybeSingle();
  return (sheetUrl = q.data?.value ?? null);
}

export async function pushToSheet(row: Record<string, unknown>) {
  const url = await sheetWebhookUrl();
  if (!url) return { ok: false, error: "no sheets webhook configured" };
  try {
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET || "", row }),
      redirect: "follow",
    });
    return { ok: r.ok };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/* ───────────── Notify the team ───────────── */
export async function notifyTeam(subject: string, html: string, opts: { replyTo?: string; attachments?: Attachment[] } = {}) {
  const to = (process.env.NOTIFY_EMAIL || FACTS.email).split(",").map((s) => s.trim());
  return sendMail({ to, subject, html: mailShell(subject, html), replyTo: opts.replyTo, attachments: opts.attachments });
}

const esc = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Every field of a record as a two-column table for the team email. Nested
// objects (details, address) are flattened to "details.address.city". The
// health number is the one thing that never goes into an email: last three
// digits only, the rest lives in Supabase and /admin.
export function recordTable(record: Record<string, unknown>, opts: { skip?: string[]; order?: string[] } = {}) {
  const flat: Record<string, unknown> = {};
  const walk = (obj: Record<string, unknown>, prefix: string) => {
    for (const [k, v] of Object.entries(obj)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (v && typeof v === "object" && !Array.isArray(v)) walk(v as Record<string, unknown>, key);
      else flat[key] = v;
    }
  };
  walk(record, "");
  const skip = new Set(["id", "signer_ua", "participant_signer_ua", "sign_token", "sign_token_expires", "participant_signature", "guardian_signature", "emails", "legal_snapshot", ...(opts.skip || [])]);
  const keys = Object.keys(flat).filter((k) => !skip.has(k) && flat[k] !== null && flat[k] !== "" && flat[k] !== undefined);
  const first = (opts.order || []).filter((k) => keys.includes(k));
  const rest = keys.filter((k) => !first.includes(k));
  const rows = [...first, ...rest].map((k) => {
    let v = flat[k];
    if (k === "health_number") v = "•••" + String(v).slice(-3) + " (full number in /admin)";
    else if (Array.isArray(v)) v = v.join("; ");
    else if (typeof v === "boolean") v = v ? "Yes" : "No";
    else if (/_at$/.test(k) && typeof v === "string") v = v.replace("T", " ").slice(0, 16) + " UTC";
    else if (k === "amount_cents") v = `$${(Number(v) / 100).toFixed(2)} CAD`;
    const label = k.replace(/^details\./, "").replace(/[._]/g, " ");
    return `<tr><td style="padding:6px 10px 6px 0;color:#a9a89c;vertical-align:top;white-space:nowrap;font-size:13px">${esc(label)}</td><td style="padding:6px 0;vertical-align:top">${esc(v)}</td></tr>`;
  });
  return `<table style="border-collapse:collapse;width:100%;font-size:15px;line-height:1.4">${rows.join("")}</table>`;
}

// One line the team can read at a glance: who, what, how much, how it's being paid.
export function paymentLine(r: { payment_method?: string | null; payment_status?: string | null; amount_cents?: number | null; ref?: string }) {
  const amt = r.amount_cents != null ? `$${(Number(r.amount_cents) / 100).toFixed(0)} CAD` : "";
  const method = r.payment_method === "card" ? "card (Stripe)" : r.payment_method === "etransfer" ? `e-transfer to ${FACTS.email}, message ${r.ref}` : r.payment_method === "aid" ? "work-to-earn / assistance requested" : r.payment_method || "";
  return `${amt} · ${method} · status: ${r.payment_status || "pending"}`;
}
