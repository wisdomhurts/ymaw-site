import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase, notifyTeam, pushToSheet } from "@/lib/server";
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
  const upd = await db
    .from("registrations")
    .update({ participant_initials: initials, participant_signature: signature, participant_signed_at: new Date().toISOString(), details: undefined, signer_ip: ip })
    .eq("sign_token", token)
    .is("participant_signed_at", null)
    .select("ref, son_first, parent_name")
    .maybeSingle();
  if (upd.error) return NextResponse.json({ error: "Couldn't save. Try again." }, { status: 500 });
  if (!upd.data) return NextResponse.json({ error: "Already signed, or the link isn't valid." }, { status: 409 });
  await Promise.allSettled([
    notifyTeam(`Signed · ${upd.data.ref}`, `<p>${upd.data.son_first} signed his agreements (registered by ${upd.data.parent_name}).</p>`),
    pushToSheet({ kind: "update", ref: upd.data.ref, participant_signed_at: new Date().toISOString() }),
  ]);
  return NextResponse.json({ ok: true, ref: upd.data.ref, first: upd.data.son_first });
}
