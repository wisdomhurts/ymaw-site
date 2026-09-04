import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase, notifyTeam, recordTable } from "@/lib/server";
import { ghlUpsertContact } from "@/lib/ghl";

export const runtime = "nodejs";

const Body = z.object({
  kind: z.enum(["volunteer", "question", "aid", "partner", "sponsor", "media", "newsletter"]).default("question"),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().max(3000).optional(),
  website: z.string().max(0).optional(),
});

const LABEL: Record<string, string> = {
  volunteer: "Volunteer · a day on load or strike",
  question: "Question",
  aid: "Financial assistance",
  partner: "Partnership",
  sponsor: "Sponsor a young man",
  media: "Media / press",
  newsletter: "Mailing list",
};

// POST /api/inquire — the contact forms on /faq and /support. Every one is
// stored, filed in GHL as a contact, and emailed to the team in full.
export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Name, a real email, and a message." }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true });
  const now = new Date().toISOString();

  const db = supabase();
  if (db) {
    const ins = await db.from("inquiries").insert({ kind: d.kind, name: d.name, email: d.email, message: d.message || null });
    if (ins.error) console.error("inquiry insert failed", ins.error);
  }

  const ghl = await ghlUpsertContact({
    email: d.email,
    name: d.name,
    tags: ["ymaw-inquiry", `ymaw-inquiry-${d.kind}`],
    source: `ymaw.com · contact form · ${d.kind}`,
    fields: { inquiry_kind: d.kind, inquiry_message: d.message || "" },
  });
  if (!ghl.ok) console.warn("ghl inquiry", ghl.error);

  await notifyTeam(
    `${LABEL[d.kind] || d.kind} · ${d.name}`,
    `<p style="font-size:18px"><strong>${d.name}</strong> (<a href="mailto:${d.email}" style="color:#e8652a">${d.email}</a>) · ${LABEL[d.kind] || d.kind}</p>
     ${d.message ? `<blockquote style="margin:14px 0;padding:12px 16px;border-left:3px solid #e8652a;background:rgba(241,236,225,.05);white-space:pre-wrap">${d.message.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</blockquote>` : ""}
     ${recordTable({ kind: d.kind, name: d.name, email: d.email, received_at: now, ghl: ghl.ok ? `contact filed via ${ghl.via}` : `not filed in GHL (${ghl.error})` })}
     <p style="margin-top:16px">Reply straight to this email; it goes to ${d.name}.</p>`,
    { replyTo: d.email },
  );

  return NextResponse.json({ ok: true, demo: !db });
}
