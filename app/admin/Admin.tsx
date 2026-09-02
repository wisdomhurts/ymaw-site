"use client";

import { useEffect, useMemo, useState } from "react";
import { FACTS } from "@/lib/facts";

type Row = Record<string, unknown> & { id: string; ref: string; created_at: string; role: string; payment_status: string; payment_method: string; amount_cents: number; parent_name: string; parent_email: string; parent_phone: string; son_first?: string; son_last?: string; son_age?: number; media_consent?: string; participant_signed_at?: string | null; notes?: string | null };

const STATUSES = ["pending", "paid", "aid_requested", "waived", "refunded", "cancelled"];

export default function Admin() {
  const [key, setKey] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => { try { const k = sessionStorage.getItem("ymaw:admin"); if (k) setKey(k); } catch {} }, []);

  const load = async (k = key) => {
    setErr("");
    const r = await fetch(`/api/admin?key=${encodeURIComponent(k)}`);
    const j = await r.json();
    if (!r.ok) { setErr(j.error || "Nope"); setRows(null); return; }
    setRows(j.rows);
    try { sessionStorage.setItem("ymaw:admin", k); } catch {}
  };
  useEffect(() => { if (key && rows === null && !err) load(key); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [key]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    const r = await fetch("/api/admin", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": key }, body: JSON.stringify({ id, ...body }) });
    if (r.ok) load();
  };

  const shown = useMemo(() => (rows || []).filter((r) => (role === "all" || r.role === role) && (status === "all" || r.payment_status === status) && (!q || JSON.stringify(r).toLowerCase().includes(q.toLowerCase()))), [rows, role, status, q]);

  const counts = useMemo(() => {
    const c = { young: 0, youngPaid: 0, men: 0, sponsors: 0, cents: 0 };
    for (const r of rows || []) {
      if (r.role === "young_man") { c.young++; if (r.payment_status === "paid" || r.payment_status === "waived") c.youngPaid++; }
      if (r.role === "man") c.men++;
      if (r.role === "sponsor") c.sponsors++;
      if (r.payment_status === "paid") c.cents += r.amount_cents;
    }
    return c;
  }, [rows]);

  if (!rows) {
    return (
      <div className="max-w-md">
        <p className="mono text-flame">Admin</p>
        <h1 className="t-h2 mt-2">The list.</h1>
        <p className="mt-3 text-ink/70">Enter the admin key (set as <span className="mono">ADMIN_KEY</span> in Vercel).</p>
        <form className="mt-5 flex gap-2" onSubmit={(e) => { e.preventDefault(); load(key); }}>
          <input className="input" type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="Admin key" autoComplete="current-password" />
          <button className="btn btn-ink" type="submit">Open</button>
        </form>
        {err && <p className="mt-3 text-sm text-flame">{err}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-flame">Admin · {FACTS.event}</p>
          <h1 className="t-h2 mt-2">{counts.young} young men <span className="text-ink/40">/ 50</span></h1>
          <p className="mt-2 text-ink/70">{counts.youngPaid} paid or waived · {counts.men} production men · {counts.sponsors} sponsors · ${(counts.cents / 100).toLocaleString()} received by card</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a className="btn btn-ghost btn-sm" style={{ borderColor: "rgba(22,17,12,.2)" }} href={`/api/admin?key=${encodeURIComponent(key)}&format=csv`}>Export CSV</a>
          <button className="btn btn-ink btn-sm" onClick={() => load()}>Refresh</button>
        </div>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_2fr]">
        <select className="select" value={role} onChange={(e) => setRole(e.target.value)}><option value="all">All roles</option><option value="young_man">Young men</option><option value="man">Production men</option><option value="sponsor">Sponsors</option></select>
        <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <input className="input" placeholder="Search name, email, ref…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-ink/15">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>{["Ref", "When", "Who", "Contact", "Role", "Pay", "Status", "Signed", "Media", "Notes"].map((h) => <th key={h} className="mono px-3 py-3 font-normal text-ink/60">{h}</th>)}</tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t border-ink/10 align-top">
                <td className="mono px-3 py-3 whitespace-nowrap">{r.ref}</td>
                <td className="px-3 py-3 whitespace-nowrap text-ink/70">{new Date(r.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" })}</td>
                <td className="px-3 py-3">
                  {r.role === "young_man" ? <><strong>{r.son_first} {r.son_last}</strong> <span className="text-ink/60">({r.son_age})</span><br /><span className="text-ink/70">{r.parent_name}</span></> : <strong>{r.parent_name}</strong>}
                </td>
                <td className="px-3 py-3 text-ink/70"><a className="link" href={`mailto:${r.parent_email}`}>{r.parent_email}</a><br />{r.parent_phone}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.role.replace("_", " ")}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.payment_method} · ${(r.amount_cents / 100).toFixed(0)}</td>
                <td className="px-3 py-3">
                  <select className="select !py-1.5 !text-xs" value={r.payment_status} onChange={(e) => patch(r.id, { payment_status: e.target.value })}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">{r.role === "young_man" ? (r.participant_signed_at ? <span className="text-leaf">his: yes</span> : <span className="text-flame">his: pending</span>) : "—"}</td>
                <td className="px-3 py-3 whitespace-nowrap">{r.media_consent || "—"}</td>
                <td className="px-3 py-3 min-w-[12rem]">
                  <input className="input !py-1.5 !text-xs" defaultValue={r.notes || ""} placeholder="Add a note…" onBlur={(e) => { if (e.target.value !== (r.notes || "")) patch(r.id, { notes: e.target.value }); }} />
                </td>
              </tr>
            ))}
            {shown.length === 0 && <tr><td colSpan={10} className="px-3 py-10 text-center text-ink/60">Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-ink/50">Health numbers are masked here and in the CSV; open the Supabase table editor for the full record. Payment status changes save immediately.</p>
    </div>
  );
}
