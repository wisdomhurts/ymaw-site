import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase, notifyTeam, recordTable } from "@/lib/server";
import { ghlUpsertContact, slug } from "@/lib/ghl";
import { FACTS } from "@/lib/facts";

export const runtime = "nodejs";

// POST /api/subscribe { email, name?, lists?, where?, website? }
// The mailing list lives in GHL. Every signup also lands in Supabase
// (inquiries, kind "newsletter") and in the team's inbox, so a GHL hiccup
// never loses a person.
const Body = z.object({
  email: z.string().trim().email().max(160),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  lists: z.array(z.string().trim().min(1).max(60)).max(5).default(FACTS.newsletters.map((n) => n.name)),
  where: z.string().trim().max(60).optional().or(z.literal("")), // "homepage", "faq", "support"
  website: z.string().max(0).optional(), // honeypot
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "A real email, please." }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true });
  const name = d.name || "";
  const lists = d.lists.length ? d.lists : FACTS.newsletters.map((n) => n.name);
  const source = `ymaw.com · ${d.where || "site"} mailing list`;

  const db = supabase();
  if (db) {
    const ins = await db.from("inquiries").insert({ kind: "newsletter", name: name || "—", email: d.email, message: `Lists: ${lists.join(", ")} · from ${d.where || "site"}` });
    if (ins.error) console.error("subscribe insert failed", ins.error);
  }

  const ghl = await ghlUpsertContact({
    email: d.email,
    name,
    tags: ["ymaw-mailing-list", ...lists.map(slug), `ymaw-${FACTS.year}`],
    source,
    fields: { lists: lists.join(", "), where: d.where || "site" },
  });
  if (!ghl.ok) console.warn("ghl subscribe", ghl.error);

  await notifyTeam(
    `Mailing list · ${name || d.email}`,
    `<p style="font-size:18px"><strong>${name ? `${name} (${d.email})` : d.email}</strong> joined the mailing list.</p>
     ${recordTable({ email: d.email, name: name || null, lists: lists, from: d.where || "site", ghl: ghl.ok ? `added via ${ghl.via}` : `not added (${ghl.error})`, created_at: new Date().toISOString() })}`,
  );

  return NextResponse.json({ ok: true, ghl: ghl.ok });
}
