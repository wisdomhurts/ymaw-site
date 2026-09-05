"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { YM_AGREEMENTS, YM_WAIVER, YM_WAIVER_INTRO, WAIVER_VERSION } from "@/lib/legal";
import { FACTS } from "@/lib/facts";
import { Agreement, Check, Signature, StepHead } from "@/components/register/fields";
import FireMark from "@/components/FireMark";

export default function SignFlow({ token }: { token: string }) {
  const [info, setInfo] = useState<{ first: string; ref: string; signed: boolean; demo?: boolean } | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [inits, setInits] = useState<string[]>(YM_AGREEMENTS.map(() => ""));
  const [sig, setSig] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/sign?token=${encodeURIComponent(token)}`)
      .then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error); setInfo(j); })
      .catch((e) => setErr(e.message));
  }, [token]);

  const submit = async () => {
    const e: Record<string, string> = {};
    inits.forEach((v, i) => { if (!v.trim()) e[`i${i}`] = "Initials"; });
    if (!agreed) e.agreed = "Read the release and tick the box.";
    if (!sig.trim()) e.sig = "Type your name";
    else if (info?.first && !sig.toLowerCase().includes(info.first.toLowerCase().split(" ")[0])) e.sig = `Your signature should include your name, ${info.first}.`;
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const r = await fetch("/api/sign", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, initials: inits, signature: sig, consent_waiver: true }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setDone(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (err) return <div><StepHead kicker="Your part" title="That link didn't work." lede={err} /><p>Ask whoever registered you to email <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>.</p></div>;
  if (!info) return <p className="mono text-[color:var(--muted)]">One moment…</p>;

  if (done || info.signed) {
    return (
      <div>
        <FireMark size={44} animate title="" />
        <StepHead kicker={info.ref} title={`Done, ${info.first}.`} lede="That's your word. See you at the bus." />
        <div className="flex flex-wrap gap-3">
          <Link href="/what-to-bring" className="btn btn-ink">What to bring</Link>
          <Link href="/his-path" className="btn btn-ghost" style={{ borderColor: "rgba(22,17,12,.2)" }}>Read what happens</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <StepHead kicker={`To ${info.first} · ${info.ref}`} title="This is the part nobody can do for you." lede="Someone who cares about you registered you for the Young Men's Adventure Weekend. Four agreements are yours to read and sign, not theirs." />
      <p className="mb-6 text-[color:var(--muted)]">Read each line. If you agree, put your initials next to it. Then sign your name. Men have signed these same lines before every weekend since 1990. Not sure about one? Ask the man who sent you, or email us.</p>
      <div className="divide-y divide-[color:var(--line)] rounded-2xl border border-[color:var(--line)] px-5">
        {YM_AGREEMENTS.map((t, i) => (
          <Agreement key={i} n={i + 1} text={t} initials={inits[i]} onChange={(v) => setInits((cur) => cur.map((x, k) => (k === i ? v.toUpperCase().slice(0, 6) : x)))} error={errs[`i${i}`]} />
        ))}
      </div>
      <h2 className="t-h3 mt-10">The release and waiver</h2>
      <p className="mt-2 text-[color:var(--muted)]">Your parent or guardian has agreed to this for you. You sign it too, because it is about you and you should know what it says. Read it. If any of it worries you, ask before you sign.</p>
      <div className="legal mt-4">
        <p>{YM_WAIVER_INTRO}</p>
        {YM_WAIVER.map((p, i) => <p key={i}><strong>{i + 1}.</strong> {p}</p>)}
        <p className="mono !text-[0.65rem] text-[color:var(--muted)]">Version {WAIVER_VERSION}</p>
      </div>
      <div className="mt-4"><Check checked={agreed} onChange={setAgreed} error={errs.agreed}>I have read the release and waiver and I agree to it.</Check></div>
      <div className="mt-6"><Signature label="Your signature" value={sig} onChange={setSig} hint="Type your full name. That's your word, for everything above." error={errs.sig} /></div>
      <div className="mt-8"><button type="button" className="btn btn-ember btn-lg" disabled={busy} onClick={submit}>{busy ? "One moment…" : "Sign it"}</button></div>
    </div>
  );
}
