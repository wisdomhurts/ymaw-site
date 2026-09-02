import { NextResponse } from "next/server";
import { stripe, supabase, sendMail, mailShell, notifyTeam } from "@/lib/server";
import { FACTS } from "@/lib/facts";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const st = stripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!st || !secret) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const sig = req.headers.get("stripe-signature") || "";
  const raw = await req.text();
  let event;
  try {
    event = st.webhooks.constructEvent(raw, sig, secret);
  } catch (e) {
    console.error("webhook signature failed", (e as Error).message);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const s = event.data.object;
    if (s.payment_status === "paid" && s.client_reference_id) {
      const db = supabase();
      if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
      const upd = await db
        .from("registrations")
        .update({
          payment_status: "paid",
          paid_at: new Date().toISOString(),
          stripe_payment_intent: typeof s.payment_intent === "string" ? s.payment_intent : null,
        })
        .eq("id", s.client_reference_id)
        .select("ref, parent_email, parent_name, son_first, role, amount_cents")
        .single();
      if (upd.error) {
        console.error("mark-paid failed", upd.error);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }
      const r = upd.data;
      const who = r.role === "young_man" ? `${r.son_first}'s seat` : r.role === "man" ? "your place on the team" : "your sponsored seat";
      await Promise.allSettled([
        sendMail({
          to: r.parent_email,
          subject: `YMAW ${FACTS.year} · ${r.ref} · Paid`,
          html: mailShell(
            "Paid. Thank you.",
            `<p>We received $${(r.amount_cents / 100).toFixed(0)} CAD for ${who}. Reference <strong>${r.ref}</strong>.</p><p>${FACTS.dates.label}. See you at the bus.</p>`,
          ),
        }),
        notifyTeam(`Paid · ${r.ref}`, `<p>${r.parent_name} paid $${(r.amount_cents / 100).toFixed(0)} by card (${r.role}).</p>`),
      ]);
    }
  }
  return NextResponse.json({ received: true });
}
