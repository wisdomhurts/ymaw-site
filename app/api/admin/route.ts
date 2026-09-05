import { NextResponse } from "next/server";
import { supabase, pushToSheet, sendMail, mailShell, SITE_URL } from "@/lib/server";
import { FACTS } from "@/lib/facts";

export const runtime = "nodejs";

function authorized(req: Request) {
  const key = process.env.ADMIN_KEY;
  if (!key) return false;
  const given = req.headers.get("x-admin-key") || new URL(req.url).searchParams.get("key");
  return given === key;
}

// GET /api/admin?key=… [&format=csv]  → registrations for the event
// GET /api/admin?key=…&diag=1          → which services are configured (never the values)
// GET /api/admin?key=…&roster=1        → the printable bus sheet, one page per stop
export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const diag = new URL(req.url).searchParams.get("diag");
  // ?diag=mail → send one test email to NOTIFY_EMAIL and report Resend's answer
  // verbatim, plus which domains the Resend account has verified. This is how
  // we learn whether info@ymaw.com can actually be reached.
  if (diag === "mail") {
    const key = process.env.RESEND_API_KEY;
    if (!key) return NextResponse.json({ error: "RESEND_API_KEY not set" }, { status: 503 });
    const domains = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${key}` } })
      .then(async (r) => ({ status: r.status, body: (await r.json().catch(() => ({}))) as { data?: { name: string; status: string; region?: string }[] } }))
      .catch((e) => ({ status: 0, body: { error: String(e) } as unknown as { data?: [] } }));
    const to = (process.env.NOTIFY_EMAIL || FACTS.email).split(",").map((s) => s.trim());
    const sent = await sendMail({ to, subject: `YMAW site · test notification · ${new Date().toISOString().slice(0, 16)}`, html: mailShell("Notifications are live.", `<p>This is a test sent from ${SITE_URL}/api/admin?diag=mail. If you're reading it in ${to.join(", ")}, every form on the site reaches this inbox.</p>`) });
    return NextResponse.json({ to, from: process.env.RESEND_FROM || "YMAW <onboarding@resend.dev>", sent, domains: domains.body.data?.map((d) => ({ name: d.name, status: d.status })) ?? domains.body });
  }
  if (diag) {
    const has = (k: string) => {
      const v = process.env[k];
      return v ? { set: true, length: v.length, prefix: v.slice(0, 8) } : { set: false };
    };
    return NextResponse.json({
      supabase: has("SUPABASE_URL").set && has("SUPABASE_SERVICE_ROLE_KEY").set,
      stripe_secret_key: has("STRIPE_SECRET_KEY"),
      stripe_webhook_secret: has("STRIPE_WEBHOOK_SECRET"),
      resend: has("RESEND_API_KEY").set,
      sheets_webhook: has("SHEETS_WEBHOOK_URL").set && has("SHEETS_WEBHOOK_SECRET").set,
      ghl: has("GHL_API_KEY").set && has("GHL_LOCATION_ID").set ? "api" : has("GHL_WEBHOOK_URL").set ? "webhook" : false,
      site_url: process.env.PUBLIC_SITE_URL || null,
      notify_email: process.env.NOTIFY_EMAIL || null,
      env: process.env.VERCEL_ENV || null,
    });
  }
  const db = supabase();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });

  // ?purge=health → erase the medical file for weekends that are over.
  //
  // The health number, the medications and the doctor's details exist so the
  // safety team can act on a mountain. Once a weekend has ended they serve no
  // purpose, and BC's PIPA says information must be destroyed once the purpose
  // it was collected for is done. The signed agreements, which the Society may
  // need for years, are untouched. ?purge=health&dry=1 counts without erasing.
  if (new URL(req.url).searchParams.get("purge") === "health") {
    const dry = new URL(req.url).searchParams.get("dry") === "1";
    const cutoff = new Date(Date.now() - 90 * 864e5).toISOString();
    const sel = await db
      .from("registrations")
      .select("ref, event, created_at")
      .neq("event", FACTS.event)
      .lt("created_at", cutoff)
      .not("health_number", "is", null);
    if (sel.error) return NextResponse.json({ error: sel.error.message }, { status: 500 });
    const refs = sel.data.map((r) => r.ref as string);
    if (dry || !refs.length) return NextResponse.json({ dry: true, would_purge: refs.length, refs });
    const upd = await db
      .from("registrations")
      .update({ health_number: null, medical_notes: null, medications: null, doctor_name: null, doctor_phone: null, health_purged_at: new Date().toISOString() })
      .in("ref", refs);
    if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });
    return NextResponse.json({ purged: refs.length, refs });
  }

  // ?roster=1 → the bus sheet, one page per pickup, ready to print.
  //
  // A production man standing in a parking lot at 3pm needs paper: who is
  // getting on here, is he actually here, and who do I phone if he isn't.
  // Nothing else. The health file stays out of it — the safety men carry that
  // separately — but a young man with an allergy, a medication or a diet is
  // flagged so the man at the door knows to check.
  if (new URL(req.url).searchParams.get("roster") === "1") {
    const sel = await db
      .from("registrations")
      .select("ref, son_first, son_last, son_age, shirt_size, pickup, parent_name, parent_phone, emergency_name, emergency_relationship, emergency_phone, dietary, medical_notes, medications, payment_status")
      .eq("role", "young_man")
      .eq("event", FACTS.event)
      .order("son_last", { ascending: true });
    if (sel.error) return NextResponse.json({ error: sel.error.message }, { status: 500 });
    type R = Record<string, unknown>;
    const rows = sel.data as R[];
    const esc = (v: unknown) =>
      String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] as string);
    const stops = FACTS.stops;
    const groups: { town: string; place: string; address: string; depart: string; ret: string; men: R[] }[] = stops.map((s) => ({
      town: s.town, place: s.place, address: s.address, depart: s.depart, ret: s.return, men: rows.filter((r) => r.pickup === s.town),
    }));
    const orphans = rows.filter((r) => !stops.some((s) => s.town === r.pickup));
    if (orphans.length) groups.push({ town: "No stop chosen", place: "Phone the parent before Friday", address: "", depart: "—", ret: "—", men: orphans });

    const flags = (r: R) => {
      const f: string[] = [];
      if (r.medications) f.push("M");
      if (r.dietary) f.push("D");
      if (r.medical_notes) f.push("!");
      return f.join(" ");
    };

    const sheet = (g: (typeof groups)[number]) => `
    <section class="stop">
      <header>
        <div>
          <p class="kicker">${esc(FACTS.short)} ${FACTS.year} · Bus roster</p>
          <h1>${esc(g.town)}</h1>
          <p class="place">${esc(g.place)}${g.address ? " · " + esc(g.address) : ""}</p>
        </div>
        <div class="when">
          <p><span>Departs</span> ${esc(g.depart)}</p>
          <p><span>Returns</span> ${esc(g.ret)}</p>
          <p class="count"><span>On this bus</span> ${g.men.length}</p>
        </div>
      </header>
      ${g.men.length === 0 ? `<p class="empty">Nobody registered for this stop yet.</p>` : `
      <table>
        <thead><tr><th class="tick">On</th><th>Young man</th><th class="num">Age</th><th class="num">Shirt</th><th>Who to call</th><th>If no answer</th><th class="num">Flags</th></tr></thead>
        <tbody>
          ${g.men
            .map(
              (r) => `<tr>
            <td class="tick"><span class="box"></span></td>
            <td class="who"><strong>${esc(r.son_first)} ${esc(r.son_last)}</strong><br><span class="ref">${esc(r.ref)}</span>${r.payment_status !== "paid" ? ` <span class="unpaid">unpaid</span>` : ""}</td>
            <td class="num">${esc(r.son_age)}</td>
            <td class="num">${esc(r.shirt_size) || "—"}</td>
            <td>${esc(r.parent_name)}<br><span class="tel">${esc(r.parent_phone)}</span></td>
            <td>${esc(r.emergency_name)}${r.emergency_relationship ? ` <span class="rel">(${esc(r.emergency_relationship)})</span>` : ""}<br><span class="tel">${esc(r.emergency_phone)}</span></td>
            <td class="num flag">${flags(r)}</td>
          </tr>`,
            )
            .join("")}
        </tbody>
      </table>`}
      <footer>
        <p>M · medication &nbsp; D · diet &nbsp; ! · medical note or allergy. The full file is with the safety team.</p>
        <p>Anyone missing at departure: phone the parent, then ${esc(FACTS.email)}. Do not leave a young man in a parking lot.</p>
        <p class="signoff">On board <span class="rule short"></span> of ${g.men.length} &nbsp;·&nbsp; Checked by <span class="rule"></span> &nbsp;·&nbsp; Time <span class="rule short"></span></p>
      </footer>
    </section>`;

    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(FACTS.short)} ${FACTS.year} bus roster</title>
<meta name="robots" content="noindex">
<style>
  @page { size: letter portrait; margin: 14mm; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #111; background: #fff; font: 12px/1.45 ui-sans-serif, system-ui, "Helvetica Neue", Arial, sans-serif; }
  .stop { padding: 22px 26px 0; max-width: 60rem; margin: 0 auto; }
  .stop + .stop { border-top: 2px solid #111; margin-top: 34px; }
  @media print { .stop + .stop { break-before: page; border-top: 0; margin-top: 0; } }
  header { display: flex; justify-content: space-between; align-items: flex-end; gap: 24px; border-bottom: 2px solid #111; padding-bottom: 10px; }
  .kicker { margin: 0; font-size: 10px; letter-spacing: .16em; text-transform: uppercase; color: #666; }
  h1 { margin: 4px 0 2px; font-size: 30px; line-height: 1; letter-spacing: -.01em; }
  .place { margin: 0; color: #444; }
  .when { text-align: right; white-space: nowrap; }
  .when p { margin: 0 0 2px; }
  .when span { display: inline-block; min-width: 5.5em; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #666; }
  .count { margin-top: 6px !important; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; margin-top: 14px; }
  th { text-align: left; font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: #666; font-weight: 600; padding: 0 8px 6px; border-bottom: 1px solid #bbb; }
  td { padding: 9px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
  tr { break-inside: avoid; }
  .num { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
  th.tick, td.tick { width: 34px; text-align: center; }
  .box { display: inline-block; width: 15px; height: 15px; border: 1.5px solid #111; border-radius: 2px; }
  .who strong { font-size: 13px; }
  .ref { font-size: 10px; letter-spacing: .08em; color: #777; }
  .rel { color: #777; }
  .tel { font-variant-numeric: tabular-nums; color: #333; }
  .flag { font-weight: 700; letter-spacing: .1em; }
  .empty { margin: 18px 0; color: #777; font-style: italic; }
  footer { margin-top: 12px; padding: 10px 0 20px; border-top: 1px solid #ddd; color: #666; font-size: 10.5px; }
  footer p { margin: 0 0 3px; }
  .unpaid { display: inline-block; margin-top: 2px; padding: 0 4px; border: 1px solid #111; border-radius: 2px; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; font-weight: 700; }
  .signoff { margin-top: 12px !important; color: #111; font-size: 11px; }
  .rule { display: inline-block; width: 12em; border-bottom: 1px solid #111; }
  .rule.short { width: 4em; }
</style></head><body>${groups.map(sheet).join("")}</body></html>`;
    return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  }

  const q = await db.from("registrations").select("*").order("created_at", { ascending: false }).limit(1000);
  if (q.error) return NextResponse.json({ error: q.error.message }, { status: 500 });
  const rows = q.data.map((r) => ({ ...r, health_number: r.health_number ? "•••" + String(r.health_number).slice(-3) : null }));
  const url = new URL(req.url);
  if (url.searchParams.get("format") === "csv") {
    const cols = Object.keys(rows[0] || { ref: "" });
    const esc = (v: unknown) => `"${String(v == null ? "" : typeof v === "object" ? JSON.stringify(v) : v).replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => esc((r as Record<string, unknown>)[c])).join(","))].join("\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="ymaw-registrations.csv"` } });
  }
  return NextResponse.json({ rows });
}

// POST /api/admin { id, payment_status?, notes? }
export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabase();
  if (!db) return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  const b = (await req.json().catch(() => ({}))) as { id?: string; payment_status?: string; notes?: string };
  if (!b.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (b.payment_status) {
    patch.payment_status = b.payment_status;
    if (b.payment_status === "paid") patch.paid_at = new Date().toISOString();
  }
  if (typeof b.notes === "string") patch.notes = b.notes.slice(0, 2000);
  const upd = await db.from("registrations").update(patch).eq("id", b.id).select("id, ref, payment_status").single();
  if (upd.error) return NextResponse.json({ error: upd.error.message }, { status: 500 });
  await pushToSheet({ kind: "update", ref: upd.data.ref, ...patch });
  return NextResponse.json({ ok: true, row: upd.data });
}
