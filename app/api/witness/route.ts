import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase, notifyTeam, pushToSheet, sendMail, mailShell } from "@/lib/server";
import { signedRecordPdfFor } from "@/lib/signed-pdf";
import { FACTS } from "@/lib/facts";

export const runtime = "nodejs";

// A witness who signs from their own device, on their own connection, at a
// different moment is the only kind whose signature adds anything the
// registrant's own signature didn't already carry. That is what this route is
// for; a witness standing in the room signs on the registration form itself.

// GET /api/witness?token=… → who is asking, and for whom
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (token.length < 16) return NextResponse.json({ error: "Bad link" }, { status: 400 });
  const db = supabase();
  if (!db) return NextResponse.json({ demo: true, signer: "A parent", subject: "a young man", role: "young_man", ref: "YMAW-DEMO", signed: false });
  const q = await db
    .from("registrations")
    .select("ref, role, son_first, son_last, parent_name, witness_name, witness_signed_at, witness_token_expires")
    .eq("witness_token", token)
    .maybeSingle();
  if (q.error || !q.data) return NextResponse.json({ error: "That link isn't valid." }, { status: 404 });
  const r = q.data;
  if (r.witness_token_expires && new Date(r.witness_token_expires) < new Date()) {
    return NextResponse.json({ error: "That link has expired. Ask the person who named you to email " + FACTS.email + "." }, { status: 410 });
  }
  return NextResponse.json({
    ref: r.ref,
    role: r.role,
    witness_name: r.witness_name,
    signer: r.role === "young_man" ? r.parent_name : `${r.son_first} ${r.son_last}`,
    subject: r.role === "young_man" ? `${r.son_first} ${r.son_last}` : null,
    signed: !!r.witness_signed_at,
  });
}

const Body = z.object({
  token: z.string().min(16),
  signature: z.string().trim().min(2).max(120),
  confirmed: z.literal(true),
});

// POST /api/witness → records the witness's signature, from their own device
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Tick the box and type your name." }, { status: 400 });
  const { token, signature } = parsed.data;
  const db = supabase();
  if (!db) return NextResponse.json({ ok: true, demo: true });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent")?.slice(0, 300) || null;
  const signedAt = new Date().toISOString();

  const upd = await db
    .from("registrations")
    .update({ witness_signature: signature, witness_signed_at: signedAt, witness_signer_ip: ip, witness_signer_ua: ua })
    .eq("witness_token", token)
    .is("witness_signed_at", null)
    .select("*")
    .maybeSingle();
  if (upd.error) return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 500 });
  if (!upd.data) return NextResponse.json({ error: "Already signed, or the link isn't valid." }, { status: 409 });
  const row = upd.data as Record<string, unknown>;

  const pdf = await signedRecordPdfFor(row);
  const who = row.role === "young_man" ? String(row.parent_name) : `${row.son_first} ${row.son_last}`;

  await Promise.allSettled([
    notifyTeam(
      `Witnessed · ${row.ref} · ${signature}`,
      `<p><strong>${signature}</strong> signed as witness to ${who}'s registration, from their own device.</p><p>Reference <strong>${row.ref}</strong>.</p>` +
        (pdf ? `<p style="font-size:13px;color:#a9a89c">Attached: the complete signed record.</p>` : ""),
      { attachments: pdf ? [pdf] : undefined },
    ),
    row.parent_email
      ? sendMail({
          to: String(row.parent_email),
          subject: `YMAW ${FACTS.year} · ${row.ref} · ${signature} signed as your witness`,
          html: mailShell(
            "Your witness signed.",
            `<p>${signature} confirmed they saw you sign, from their own device.</p>${pdf ? "<p>Attached is the complete signed record. This replaces the copy sent when you registered.</p>" : ""}`,
          ),
          attachments: pdf ? [pdf] : undefined,
        })
      : Promise.resolve(),
    pushToSheet({ kind: "update", ref: row.ref, witness_signed_at: signedAt, witness_signature: signature }),
  ]);

  return NextResponse.json({ ok: true, ref: row.ref });
}
