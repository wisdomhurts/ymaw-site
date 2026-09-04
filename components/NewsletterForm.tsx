"use client";

import { useState } from "react";
import { FACTS } from "@/lib/facts";

/**
 * Join the mailing list. Posts to /api/subscribe, which files the person in
 * GHL (the Society's list), Supabase, and the team inbox.
 *
 * `where` tags the signup with the page it came from. Colours follow the
 * surface it sits on (night by default, paper inside data-surface="paper").
 */
export default function NewsletterForm({ where = "site", compact = false }: { where?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [lists, setLists] = useState<string[]>([FACTS.newsletters[0].name]);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const toggle = (l: string) => setLists((c) => (c.includes(l) ? c.filter((x) => x !== l) : [...c, l]));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    try {
      const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, name, lists, where, website: hp }) });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  };

  if (state === "done") return <p className="text-sm text-[color:var(--fg)]">You're on the list. First one comes after the weekend.</p>;

  return (
    <form onSubmit={submit} className="grid gap-3" aria-label="Join the mailing list">
      {!compact && (
        <div className="flex flex-wrap gap-2">
          {FACTS.newsletters.map((n) => (
            <button key={n.name} type="button" className="choice !rounded-full !px-4 !py-2 text-sm" data-on={lists.includes(n.name)} onClick={() => toggle(n.name)} aria-pressed={lists.includes(n.name)} title={`For ${n.who}: ${n.line}.`}>
              {n.name}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-label="Name" />
        <input className="input" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-label="Email" />
        <button className="btn btn-ember btn-sm" type="submit" disabled={state === "busy" || lists.length === 0}>{state === "busy" ? "…" : "Join the list"}</button>
      </div>
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden />
      {state === "error" && <p className="text-sm text-flame">Didn't go through. Email {FACTS.email} and we'll add you.</p>}
      <p className="text-xs text-[color:var(--muted)]">Unsubscribe in one tap. The list is never shared.</p>
    </form>
  );
}
