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
type Mail = { to: string | string[]; subject: string; html: string; text?: string; replyTo?: string };

export async function sendMail(m: Mail): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY not set" };
  const from = process.env.RESEND_FROM || `YMAW <onboarding@resend.dev>`;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: m.to, subject: m.subject, html: m.html, text: m.text, reply_to: m.replyTo || FACTS.email }),
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
export async function pushToSheet(row: Record<string, unknown>) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  if (!url) return { ok: false, error: "SHEETS_WEBHOOK_URL not set" };
  try {
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ secret: process.env.SHEETS_WEBHOOK_SECRET || "", row }) });
    return { ok: r.ok };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

/* ───────────── Notify the team ───────────── */
export async function notifyTeam(subject: string, html: string) {
  const to = (process.env.NOTIFY_EMAIL || FACTS.email).split(",").map((s) => s.trim());
  return sendMail({ to, subject, html: mailShell(subject, html) });
}
