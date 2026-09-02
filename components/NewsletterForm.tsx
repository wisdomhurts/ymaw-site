"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lists, setLists] = useState<string[]>(["Rising the Man Within"]);
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const toggle = (l: string) => setLists((c) => (c.includes(l) ? c.filter((x) => x !== l) : [...c, l]));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("busy");
    const r = await fetch("/api/inquire", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "newsletter", name: name || "—", email, message: `Lists: ${lists.join(", ")}` }) });
    setState(r.ok ? "done" : "error");
  };
  if (state === "done") return <p className="text-sm">You're on the list. First one comes after the weekend.</p>;
  return (
    <form onSubmit={submit} className="grid gap-3">
      <div className="flex flex-wrap gap-2">
        {["Rising the Man Within", "The Forged Circle"].map((l) => (
          <button key={l} type="button" className="choice !rounded-full !px-4 !py-2 text-sm" data-on={lists.includes(l)} onClick={() => toggle(l)} aria-pressed={lists.includes(l)}>{l}</button>
        ))}
      </div>
      <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr_auto]">
        <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" aria-label="Name" />
        <input className="input" type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" aria-label="Email" />
        <button className="btn btn-ink btn-sm" type="submit" disabled={state === "busy" || lists.length === 0}>{state === "busy" ? "…" : "Subscribe"}</button>
      </div>
      {state === "error" && <p className="text-sm text-flame">Didn't go through. Email info@ymaw.com and we'll add you.</p>}
    </form>
  );
}
