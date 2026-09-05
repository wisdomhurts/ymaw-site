"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WITNESS_ATTESTATION } from "@/lib/legal";
import { FACTS } from "@/lib/facts";
import { Check, Signature, StepHead } from "@/components/register/fields";
import FireMark from "@/components/FireMark";

type Info = { ref: string; role: string; witness_name: string | null; signer: string; subject: string | null; signed: boolean; demo?: boolean };

export default function WitnessFlow({ token }: { token: string }) {
  const [info, setInfo] = useState<Info | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [sig, setSig] = useState("");
  const [ok, setOk] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    fetch(`/api/witness?token=${encodeURIComponent(token)}`)
      .then(async (r) => { const j = await r.json(); if (!r.ok) throw new Error(j.error); setInfo(j); })
      .catch((e) => setErr(e.message));
  }, [token]);

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!ok) e.ok = "Please confirm before signing.";
    if (!sig.trim()) e.sig = "Type your name";
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const r = await fetch("/api/witness", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, signature: sig, confirmed: true }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      setDone(true);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (err) return <div><StepHead kicker="Witness" title="That link didn't work." lede={err} /><p>Write to <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>.</p></div>;
  if (!info) return <p className="mono text-[color:var(--muted)]">One moment…</p>;

  if (done || info.signed) {
    return (
      <div>
        <FireMark size={44} animate title="" />
        <StepHead kicker={info.ref} title="Done. Thank you." lede={`Your signature is on ${info.signer}'s registration. That's all we needed.`} />
        <Link href="/" className="btn btn-ink">See what the weekend is</Link>
      </div>
    );
  }

  return (
    <div>
      <StepHead
        kicker={`Witness · ${info.ref}`}
        title="You saw them sign."
        lede={`${info.signer} named you as a witness${info.subject ? ` to ${info.subject}'s registration` : ""} for the ${FACTS.name}, ${FACTS.dates.label}.`}
      />
      <div className="rounded-2xl border border-ink/15 p-5">
        <p className="mono text-flame">What you are confirming</p>
        <div className="legal mt-3"><p>{WITNESS_ATTESTATION.replace("the person named above", info.signer)}</p></div>
      </div>
      <p className="mt-4 text-sm text-[color:var(--muted)]">
        You are not a party to anything, you take on no cost or obligation, and you are not consenting to anything on anyone's behalf. If you didn't see {info.signer} sign, don't sign this — close the page and tell them.
      </p>
      <div className="mt-5"><Check checked={ok} onChange={setOk} error={errs.ok}>I confirm the statement above is true.</Check></div>
      <div className="mt-6"><Signature label="Your signature" value={sig} onChange={setSig} hint="Type your full name." error={errs.sig} /></div>
      <div className="mt-8"><button type="button" className="btn btn-ember btn-lg" disabled={busy} onClick={submit}>{busy ? "One moment…" : "Sign as witness"}</button></div>
      <p className="mt-6 text-xs text-dust">We record the time and the connection this signature came from, and nothing else about you. Questions: <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a> · <Link className="link" href="/privacy">Privacy</Link></p>
    </div>
  );
}
