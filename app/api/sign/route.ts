import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase, notifyTeam, pushToSheet, sendMail, mailShell } from "@/lib/server";
import { signedRecordPdfFor } from "@/lib/signed-pdf";
import { FACTS } from "@/lib/facts";
import { YM_AGREEMENTS } from "@/lib/legal";

export const runtime = "nodejs";

// GET /api/sign?token=… → { first, ref, signed }
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") || "";
  if (token.length < 16) return NextResponse.json({ error: "Bad link" }, { status: 400 });
  const db = supabase();
  if (!db) return NextResponse.json({ demo: true, first: "Young man", ref: "YMAW-DEMO", signed: false });
  const q = await db.from("registrations").select("ref, son_first, participant_signed_at, sign_token_expires").eq("sign_token", token).maybeSingle();
  if (q.error || !q.data) return NextResponse.json({ error: "That link isn't valid." }, { status: 404 });
  if (q.data.sign_token_expires && new Date(q.data.sign_token_expires) < new Date()) return NextResponse.json({ error: "That link has expired. Ask the person who registered you to email info@ymaw.com." }, { status: 410 });
  return NextResponse.json({ first: q.data.son_first, ref: q.data.ref, signed: !!q.data.participant_signed_at });
}

const Body = z.object({
  token: z.string().min(16),
  initials: z.array(z.string().trim().min(1).max(6)).length(YM_AGREEMENTS.length),
  signature: z.string().trim().min(2).max(120),
});

// POST /api/sign → records the young man's initials and signature
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Initial every line and sign your name." }, { status: 400 });
  const { token, initials, signature } = parsed.data;
  const db = supabase();
  if (!db) return NextResponse.json({ ok: true, demo: true });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent")?.slice(0, 300) || null;
  const signedAt = new Date().toISOString();
  // His signature gets its own IP and device. Writing it to signer_ip used to
  // erase where and on what his parent signed, days earlier.
  const upd = await db
    .from("registrations")
    .update({ participant_initials: initials, participant_signature: signature, participant_signed_at: signedAt, participant_signer_ip: ip, participant_signer_ua: ua })
    .eq("sign_token", token)
    .is("participant_signed_at", null)
    .select("*")
    .maybeSingle();
  if (upd.error) return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 500 });
  if (!upd.data) return NextResponse.json({ error: "Already signed, or the link isn't valid." }, { status: 409 });
  const row = upd.data as Record<string, unknown>;

  // The record is only complete now, so both copies of the PDF are reissued
  // with his signature on them.
  const pdf = await signedRecordPdfFor(row);
  const note = `<p>${row.son_first} read and initialled his four agreements and signed his name.</p><p>Registered by ${row.parent_name}. Reference <strong>${row.ref}</strong>.</p>`;

  await Promise.allSettled([
    notifyTeam(`Signed · ${row.ref} · ${row.son_first}`, note + (pdf ? `<p style="font-size:13px;color:#a9a89c">Attached: the complete signed record, now with both signatures.</p>` : ""), { attachments: pdf ? [pdf] : undefined }),
    row.parent_email
      ? sendMail({
          to: String(row.parent_email),
          subject: `YMAW ${FACTS.year} · ${row.ref} · ${row.son_first} signed his part`,
          html: mailShell(`${row.son_first} signed his part.`, `<p>His seat is confirmed. ${FACTS.dates.label}, ${FACTS.region}.</p>${pdf ? "<p>Attached is the complete signed record, with both signatures on it. This replaces the copy sent when you registered.</p>" : ""}`),
          attachments: pdf ? [pdf] : undefined,
        })
      : Promise.resolve(),
    pushToSheet({ kind: "update", ref: row.ref, participant_signed_at: signedAt }),
  ]);
  return NextResponse.json({ ok: true, ref: row.ref, first: row.son_first });
}
