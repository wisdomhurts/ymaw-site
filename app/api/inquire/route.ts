import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase, notifyTeam } from "@/lib/server";

export const runtime = "nodejs";

const Body = z.object({
  kind: z.enum(["volunteer", "question", "aid", "partner", "sponsor", "media", "newsletter"]).default("question"),
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().max(3000).optional(),
  website: z.string().max(0).optional(),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Name, a real email, and a message." }, { status: 400 });
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true });
  const db = supabase();
  if (db) {
    const ins = await db.from("inquiries").insert({ kind: d.kind, name: d.name, email: d.email, message: d.message || null });
    if (ins.error) console.error("inquiry insert failed", ins.error);
  }
  await notifyTeam(`${d.kind} · ${d.name}`, `<p>${d.name} &lt;${d.email}&gt;</p><p>${(d.message || "").replace(/</g, "&lt;")}</p>`);
  return NextResponse.json({ ok: true, demo: !db });
}
