import { NextResponse } from "next/server";
import { Registration, type YoungManT, type ManT, type SponsorT } from "@/lib/schema";
import { FACTS } from "@/lib/facts";
import { WAIVER_VERSION, YM_AGREEMENTS, MEN_AGREEMENTS } from "@/lib/legal";
import { supabase, stripe, makeRef, makeToken, sendMail, mailShell, notifyTeam, pushToSheet, SITE_URL } from "@/lib/server";

export const runtime = "nodejs";

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return bad("Bad request");
  }
  const parsed = Registration.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return bad(`${first.path.join(".")}: ${first.message}`);
  }
  const d = parsed.data;
  if (d.website) return NextResponse.json({ ok: true, ref: makeRef() }); // honeypot

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const ua = req.headers.get("user-agent")?.slice(0, 300) || null;
  const ref = makeRef();
  const now = new Date().toISOString();
  const db = supabase();

  // Demo mode: nothing configured yet — answer honestly, store nothing.
  if (!db) {
    return NextResponse.json({ ok: true, ref, demo: true, url: null });
  }

  let row: Record<string, unknown>;
  let amount: number = FACTS.priceCents;
  let payer_email = "";
  let payer_name = "";
  let lineName = "";
  let signToken: string | null = null;

  if (d.role === "young_man") {
    const y = d as YoungManT;
    payer_email = y.parent_email;
    payer_name = y.parent_name;
    lineName = `YMAW ${FACTS.year} · Registration for ${y.son_first}`;
    const signedHere = y.participant_mode === "here" && y.participant_signature && (y.participant_initials?.length || 0) >= YM_AGREEMENTS.length;
    if (!signedHere) signToken = makeToken();
    row = {
      ref, event: FACTS.event, role: "young_man", registrant_type: "young_man",
      son_first: y.son_first, son_last: y.son_last, son_age: y.son_age, dob: y.dob,
      attended_before: y.attended_before === "yes", times_attended: y.times_attended ?? null,
      wilderness_experience: y.wilderness_experience || null, dietary: y.dietary || null,
      medical_notes: y.medical_notes || null, medications: y.medications || null,
      health_number: y.health_number, doctor_name: y.doctor_name, doctor_phone: y.doctor_phone,
      parent_name: y.parent_name, relationship: y.relationship, parent_email: y.parent_email, parent_phone: y.parent_phone,
      emergency_name: y.emergency_name, emergency_relationship: y.emergency_relationship, emergency_phone: y.emergency_phone, emergency_alt_phone: y.emergency_alt_phone || null,
      heard_from: y.heard_from || null, sponsor_name: y.sponsor_name || null, sponsor_phone: y.sponsor_phone || null,
      consent_waiver: true, waiver_version: WAIVER_VERSION, consented_at: now, guardian_signature: y.guardian_signature,
      photo_consent: y.media_consent === "full", media_consent: y.media_consent,
      participant_email: y.participant_email || null,
      participant_initials: signedHere ? y.participant_initials : null,
      participant_signature: signedHere ? y.participant_signature : null,
      participant_signed_at: signedHere ? now : null,
      sign_token: signToken, sign_token_expires: signToken ? new Date(Date.now() + 30 * 864e5).toISOString() : null,
      signer_ip: ip, signer_ua: ua,
      payment_method: y.payment_method, payment_status: y.payment_method === "aid" ? "aid_requested" : "pending",
      amount_cents: amount, currency: "CAD",
      details: { address: y.address, aid_note: y.aid_note || null, agreements: YM_AGREEMENTS, participant_mode: y.participant_mode },
    };
  } else if (d.role === "man") {
    const m = d as ManT;
    payer_email = m.email;
    payer_name = `${m.first} ${m.last}`;
    lineName = `YMAW ${FACTS.year} · Production man · ${m.first} ${m.last}`;
    row = {
      ref, event: FACTS.event, role: "man", registrant_type: "production",
      parent_name: `${m.first} ${m.last}`, parent_email: m.email, parent_phone: m.phone,
      son_first: m.first, son_last: m.last,
      dietary: m.dietary || null, attended_before: m.attended_before === "yes", times_attended: m.times_attended ?? null,
      wilderness_experience: m.wilderness_experience || null,
      emergency_name: m.emergency_name, emergency_phone: m.emergency_phone,
      consent_waiver: true, waiver_version: WAIVER_VERSION, consented_at: now, guardian_signature: m.signature,
      participant_initials: m.initials, participant_signature: m.signature, participant_signed_at: now,
      photo_consent: true, media_consent: "full",
      signer_ip: ip, signer_ua: ua,
      payment_method: m.payment_method, payment_status: m.payment_method === "aid" ? "aid_requested" : "pending",
      amount_cents: amount, currency: "CAD",
      details: { address: m.address, vehicle: m.vehicle, departments: m.departments || [], skills: m.skills || null, crc_status: m.crc_status, aid_note: m.aid_note || null, agreements: MEN_AGREEMENTS },
    };
  } else {
    const s = d as SponsorT;
    payer_email = s.email;
    payer_name = s.name;
    amount = s.amount_cents;
    lineName = `YMAW ${FACTS.year} · Sponsor ${s.seats} seat${s.seats > 1 ? "s" : ""}`;
    row = {
      ref, event: FACTS.event, role: "sponsor", registrant_type: "sponsor", headcount: s.seats,
      parent_name: s.name, parent_email: s.email, parent_phone: s.phone || "",
      consent_waiver: true, waiver_version: WAIVER_VERSION, consented_at: now,
      payment_method: s.payment_method, payment_status: "pending", amount_cents: amount, currency: "CAD",
      details: { for_whom: s.for_whom || null, message: s.message || null },
    };
  }

  const ins = await db.from("registrations").insert(row).select("id").single();
  if (ins.error) {
    console.error("register insert failed", ins.error);
    return bad(`We couldn't save that. Email ${FACTS.email} and we'll register by hand.`, 500);
  }
  const id = ins.data.id as string;

  // Side effects that must never block the registrant: sheet, emails.
  const after: Promise<unknown>[] = [];
  after.push(pushToSheet({ ref, created_at: now, ...flatten(row) }));

  if (signToken && d.role === "young_man") {
    const y = d as YoungManT;
    const link = `${SITE_URL}/register/sign/${signToken}`;
    const to = y.participant_email || y.parent_email;
    after.push(
      sendMail({
        to,
        subject: `${y.son_first}, your part of the YMAW registration`,
        html: mailShell(
          `${y.son_first}, one thing is yours to do.`,
          `<p>${y.parent_name} has registered you for the Young Men's Adventure Weekend, ${FACTS.dates.label}.</p>
           <p>Four agreements are yours to read and sign, not theirs. It takes two minutes on a phone.</p>
           <p style="margin:24px 0"><a href="${link}" style="background:#e8652a;color:#0a0d11;font-weight:800;padding:14px 22px;border-radius:999px;text-decoration:none;display:inline-block">Read and sign my part</a></p>
           <p style="font-size:13px;color:#a9a89c">This link is yours alone and works for 30 days. Reference ${ref}.</p>`,
        ),
      }),
    );
  }

  const stripeUrl = await (async () => {
    if (d.role === "sponsor" ? d.payment_method !== "card" : d.payment_method !== "card") return null;
    const st = stripe();
    if (!st) return null;
    try {
      const session = await st.checkout.sessions.create({
        mode: "payment",
        client_reference_id: id,
        customer_email: payer_email,
        currency: "cad",
        line_items: [{
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: amount,
            product_data: {
              name: lineName,
              description: `${FACTS.name}, ${FACTS.dates.label}, ${FACTS.region}. Bus, meals, tools and shirt included.`,
            },
          },
        }],
        metadata: { ref, event: FACTS.event, role: d.role },
        success_url: `${SITE_URL}/thank-you?ref=${ref}&paid=1`,
        cancel_url: `${SITE_URL}/register?canceled=1&ref=${ref}`,
        payment_intent_data: { description: `${lineName} (${ref})` },
      });
      await db.from("registrations").update({ stripe_session_id: session.id }).eq("id", id);
      return session.url;
    } catch (e) {
      console.error("stripe session failed", e);
      return null;
    }
  })();

  // Confirmation to the payer (card path gets its receipt after the webhook).
  const payNote =
    d.payment_method === "etransfer"
      ? `<p><strong>Payment by e-transfer:</strong> send <strong>$${(amount / 100).toFixed(0)} CAD</strong> to <strong>${FACTS.email}</strong> with the message <strong>${ref}</strong>. We mark the seat paid when it lands.</p>`
      : d.payment_method === "aid"
        ? `<p><strong>Assistance requested.</strong> A man from the enrolment team will call or write within a couple of days. Money is never the reason a young man stays home.</p>`
        : stripeUrl
          ? `<p>If the card payment didn't complete, <a href="${stripeUrl}" style="color:#e8652a">finish paying here</a> or e-transfer $${(amount / 100).toFixed(0)} CAD to ${FACTS.email} with the message ${ref}.</p>`
          : `<p>Card payments aren't switched on yet, so the seat is held as pending. E-transfer $${(amount / 100).toFixed(0)} CAD to ${FACTS.email} with the message ${ref}, and you're done.</p>`;

  const who = d.role === "young_man" ? (d as YoungManT).son_first : d.role === "man" ? "you" : "your sponsored seat";
  after.push(
    sendMail({
      to: payer_email,
      subject: `YMAW ${FACTS.year} · ${ref} · ${d.role === "young_man" ? `${(d as YoungManT).son_first} is on the list` : d.role === "man" ? "You're on the team" : "Thank you"}`,
      html: mailShell(
        d.role === "young_man" ? "He's on the list." : d.role === "man" ? "You're on the team." : "Thank you.",
        `<p>Reference <strong>${ref}</strong>. ${FACTS.dates.label}, ${FACTS.region}.</p>
         ${payNote}
         ${d.role === "young_man" ? `<p>The bus: Langley (McDonald's, 20394 88 Ave) Friday 3:00 pm, or Burnaby (Christine Sinclair Community Centre, south lot) Friday 4:00 pm. Return Sunday afternoon at the same stop.</p><p>What to bring, printable: <a href="${SITE_URL}/what-to-bring" style="color:#e8652a">${SITE_URL}/what-to-bring</a></p>` : ""}
         ${d.role === "man" ? `<p>Criminal record check: <a href="${FACTS.crc.portal}" style="color:#e8652a">${FACTS.crc.portal}</a>, access code <strong>${FACTS.crc.code}</strong>. Load is Thursday, the weekend is ${FACTS.dates.label}. The every-other-Thursday production meetings will be in your inbox.</p>` : ""}
         <p>Thank you for ${who}.</p>`,
      ),
    }),
  );
  after.push(notifyTeam(`New ${d.role.replace("_", " ")} registration · ${ref}`, `<p><strong>${payer_name}</strong> (${payer_email}) · ${d.role} · ${d.payment_method} · $${(amount / 100).toFixed(0)}</p><p>${d.role === "young_man" ? `Young man: ${(d as YoungManT).son_first} ${(d as YoungManT).son_last}, ${(d as YoungManT).son_age}. Media: ${(d as YoungManT).media_consent}. His signature: ${signToken ? "pending (link sent)" : "done"}.` : ""}</p><p>Supabase → registrations → ${ref}</p>`));

  const results = await Promise.allSettled(after);
  const emails = { confirmation: results[results.length - 2]?.status, team: results[results.length - 1]?.status, sign_link: signToken ? results[1]?.status : "n/a" };
  await db.from("registrations").update({ emails }).eq("id", id);

  return NextResponse.json({ ok: true, ref, url: stripeUrl, needsSignature: !!signToken });
}

function flatten(row: Record<string, unknown>) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v as Record<string, unknown>)) out[`${k}.${k2}`] = typeof v2 === "object" ? JSON.stringify(v2) : v2;
    } else out[k] = Array.isArray(v) ? v.join("; ") : v;
  }
  delete out.health_number; // keep the health number out of the sheet
  return out;
}
