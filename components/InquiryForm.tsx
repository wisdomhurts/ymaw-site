"use client";

import { useState } from "react";
import { FACTS } from "@/lib/facts";

const LABELS: Record<string, string> = { partner: "Partnering (school, org, community)", volunteer: "Giving a day on load or strike", sponsor: "Sponsoring a young man I know", question: "A question", aid: "Financial assistance", media: "Media or press" };

export default function InquiryForm({ kinds = ["question"] }: { kinds?: string[] }) {
  const [kind, setKind] = useState(kinds[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    try {
      const r = await fetch("/api/inquire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, name, email, message, website: hp }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setState("done");
    } catch (x) {
      setErr((x as Error).message || "Something went wrong");
      setState("error");
    }
  };

  if (state === "done") return <div className="card p-6"><p className="display text-2xl">Got it.</p><p className="mt-2 text-[color:var(--muted)]">A man will write back. If it's urgent, {FACTS.email}.</p></div>;

  return (
    <form onSubmit={submit} className="grid gap-4">
      {kinds.length > 1 && (
        <div className="field">
          <label htmlFor="kind">What's this about</label>
          <select id="kind" className="select" value={kind} onChange={(e) => setKind(e.target.value)}>
            {kinds.map((k) => <option key={k} value={k}>{LABELS[k] || k}</option>)}
          </select>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field"><label htmlFor="iq-name">Your name</label><input id="iq-name" className="input" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></div>
        <div className="field"><label htmlFor="iq-email">Email</label><input id="iq-email" className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" /></div>
      </div>
      <div className="field"><label htmlFor="iq-msg">Message</label><textarea id="iq-msg" className="textarea" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="A sentence or two is plenty." /></div>
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} aria-hidden />
      {state === "error" && <p className="text-sm text-flame">{err}</p>}
      <button type="submit" className="btn btn-ember w-fit" disabled={state === "busy"}>{state === "busy" ? "Sending…" : "Send"}</button>
    </form>
  );
}
