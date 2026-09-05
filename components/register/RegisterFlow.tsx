"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FACTS, STOPS, PICKUPS } from "@/lib/facts";
import { YM_AGREEMENTS, MEN_AGREEMENTS, MEDICAL_CONSENT, YM_WAIVER, YM_WAIVER_INTRO, MEN_WAIVER, MEN_WAIVER_INTRO, MEDIA_RELEASE, WITNESS_ATTESTATION, WAIVER_VERSION } from "@/lib/legal";
import { Field, Select, YesNo, Choice, Check, Agreement, Signature, StepHead } from "./fields";
import FireMark from "../FireMark";

type Role = "young_man" | "man" | "sponsor";
type D = Record<string, string>;
const KEY = "ymaw:reg:v2";

const RELATIONSHIPS = ["Mother", "Father", "Step-parent", "Legal guardian", "Grandparent", "Other family", "Other"];
// An emergency contact is usually not a parent — that is the point of one.
const EMERGENCY_RELATIONSHIPS = ["Mother", "Father", "Step-parent", "Grandparent", "Aunt", "Uncle", "Sibling (adult)", "Family friend", "Neighbour", "Coach or teacher", "Other"];
const HEARD = ["A man who's been", "A parent whose son went", "School or counsellor", "Coach or club", "Instagram or Facebook", "Search", "Flyer or poster", "Other"];
const PROVINCES = ["BC", "AB", "SK", "MB", "ON", "QC", "NB", "NS", "PE", "NL", "YT", "NT", "NU", "Other"];
const DEPTS = FACTS.departments.map((d) => d.name);

// The site says 12 to 17; registration accepts 11 to 18 on the Friday of the weekend.
const DOB_MIN = (() => { const d = new Date(FACTS.dates.start + "T12:00:00"); d.setFullYear(d.getFullYear() - FACTS.agesAccepted.max - 1); d.setDate(d.getDate() + 1); return d.toISOString().slice(0, 10); })();
const DOB_MAX = (() => { const d = new Date(FACTS.dates.start + "T12:00:00"); d.setFullYear(d.getFullYear() - FACTS.agesAccepted.min); return d.toISOString().slice(0, 10); })();

function ageFrom(dob: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null;
  const start = new Date(FACTS.dates.start + "T12:00:00");
  const b = new Date(dob + "T12:00:00");
  let a = start.getFullYear() - b.getFullYear();
  const m = start.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && start.getDate() < b.getDate())) a--;
  return a;
}

export default function RegisterFlow({ initialRole, canceledRef, intent }: { initialRole?: string; canceledRef?: string; intent?: string }) {
  // A donation and a sponsorship are the same transaction on the same Stripe
  // account; only the words around them differ.
  const donating = intent === "donate";
  const [role, setRole] = useState<Role | null>(
    initialRole === "young-man" ? "young_man" : initialRole === "man" ? "man" : initialRole === "sponsor" ? "sponsor" : null,
  );
  const [step, setStep] = useState(0);
  const [d, setD] = useState<D>({ province: "BC", relationship: "", attended_before: "", participant_mode: "here", payment_method: "", seats: "1", crc_status: "", amount: String(FACTS.priceCAD) });
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [serverErr, setServerErr] = useState<string | null>(null);
  const [handed, setHanded] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  // restore
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s.d) setD((cur) => ({ ...cur, ...s.d }));
        if (s.role && !initialRole) setRole(s.role);
      }
    } catch {}
  }, [initialRole]);
  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify({ d, role })); } catch {}
  }, [d, role]);

  const set = useCallback((k: string, v: string) => {
    setD((cur) => ({ ...cur, [k]: v }));
    setErrs((e) => { if (!e[k]) return e; const n = { ...e }; delete n[k]; return n; });
  }, []);
  const setInit = (prefix: string, i: number, v: string) => set(`${prefix}${i}`, v.toUpperCase().slice(0, 6));

  const steps = useMemo(() => {
    if (role === "young_man") return ["Him", "His health", "You", "His part", "Your part", "Payment"];
    if (role === "man") return ["You", "Vehicle", "Agreements", "Waiver", "Payment"];
    if (role === "sponsor") return ["You", "Payment"];
    return [];
  }, [role]);

  const goto = (n: number) => {
    setStep(n);
    setServerErr(null);
    requestAnimationFrame(() => top.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  /* ───────── validation per step ───────── */
  const need = (keys: string[], msgs: Record<string, string> = {}) => {
    const e: Record<string, string> = {};
    for (const k of keys) if (!d[k] || !d[k].trim()) e[k] = msgs[k] || "Required";
    return e;
  };
  const emailOk = (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v || "");

  // A witness is optional, but a half-filled one is not: if you name someone,
  // we need enough to actually reach or record them.
  const witnessErrors = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (d.witness_mode === "here") {
      if (!d.witness_name?.trim()) e.witness_name = "Their name";
      if (!d.witness_signature?.trim()) e.witness_signature = "Ask them to type their name";
    }
    if (d.witness_mode === "link") {
      if (!d.witness_name?.trim()) e.witness_name = "Their name";
      if (!d.witness_email?.trim()) e.witness_email = "Where do we send it?";
      else if (!emailOk(d.witness_email)) e.witness_email = "That email doesn't look right";
    }
    return e;
  };

  const validate = (): boolean => {
    let e: Record<string, string> = {};
    const name = steps[step];
    if (role === "young_man") {
      if (name === "Him") {
        e = need(["son_first", "son_last", "dob", "attended_before", "shirt_size", "pickup"]);
        const a = ageFrom(d.dob);
        if (d.dob && (a === null || a < FACTS.agesAccepted.min || a > FACTS.agesAccepted.max)) e.dob = `He needs to be ${FACTS.agesAccepted.min} to ${FACTS.agesAccepted.max} on ${FACTS.dates.label.split(",")[0]}.`;
      } else if (name === "His health") {
        e = need(["health_number", "doctor_name", "doctor_phone"]);
      } else if (name === "You") {
        e = need(["parent_name", "relationship", "parent_email", "parent_phone", "street", "city", "province", "postal", "emergency_name", "emergency_relationship", "emergency_phone"]);
        if (d.parent_email && !emailOk(d.parent_email)) e.parent_email = "That email doesn't look right";
      } else if (name === "His part") {
        if (d.participant_mode === "here") {
          YM_AGREEMENTS.forEach((_, i) => { if (!d[`ym_init${i}`]?.trim()) e[`ym_init${i}`] = "Initials"; });
          if (d.participant_consent_waiver !== "1") e.participant_consent_waiver = "He needs to agree to the release too";
          if (!d.participant_signature?.trim()) e.participant_signature = "He types his name here";
          else if (d.son_first && !d.participant_signature.toLowerCase().includes(d.son_first.trim().toLowerCase().split(" ")[0])) e.participant_signature = `His signature should include his name, ${d.son_first}.`;
        } else if (d.participant_email && !emailOk(d.participant_email)) e.participant_email = "That email doesn't look right";
      } else if (name === "Your part") {
        if (d.consent_medical !== "1") e.consent_medical = "Please confirm the medical consent";
        if (d.consent_waiver !== "1") e.consent_waiver = "Please confirm the release and waiver";
        if (d.consent_media !== "1") e.consent_media = "Please agree to the photo and video release";
        if (!d.guardian_signature?.trim()) e.guardian_signature = "Type your full name";
        else if (d.parent_name && d.guardian_signature.trim().toLowerCase() !== d.parent_name.trim().toLowerCase()) e.guardian_signature = `Type your name exactly as above: ${d.parent_name}.`;
        Object.assign(e, witnessErrors());
      } else if (name === "Payment") {
        if (!d.payment_method) e.payment_method = "Choose how you'd like to pay";
      }
    } else if (role === "man") {
      if (name === "You") {
        e = need(["first", "last", "email", "phone", "street", "city", "province", "postal", "attended_before", "shirt_size", "emergency_name", "emergency_phone"]);
        if (d.email && !emailOk(d.email)) e.email = "That email doesn't look right";
      } else if (name === "Vehicle") {
        e = need(["driveToSite"]);
      } else if (name === "Agreements") {
        MEN_AGREEMENTS.forEach((_, i) => { if (!d[`m_init${i}`]?.trim()) e[`m_init${i}`] = "Initials"; });
        if (!d.crc_status) e.crc_status = "Choose one";
      } else if (name === "Waiver") {
        if (d.consent_waiver !== "1") e.consent_waiver = "Please confirm the release and waiver";
        if (!d.signature?.trim()) e.signature = "Type your full name";
        else if (d.first && !d.signature.toLowerCase().includes(d.first.trim().toLowerCase())) e.signature = `Your signature should include your name, ${d.first}.`;
        Object.assign(e, witnessErrors());
      } else if (name === "Payment") {
        if (!d.payment_method) e.payment_method = "Choose how you'd like to pay";
      }
    } else if (role === "sponsor") {
      if (name === "You") {
        e = need(["name", "email", "seats"]);
        if (d.email && !emailOk(d.email)) e.email = "That email doesn't look right";
        if (!(parseFloat(donating ? d.donate_amount || "" : d.amount) >= 10)) e.amount = donating ? "How much would you like to give?" : "Amount";
      } else if (name === "Payment") {
        if (!d.payment_method) e.payment_method = "Choose how you'd like to pay";
      }
    }
    setErrs(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return false;
    }
    return true;
  };

  const next = () => { if (validate()) goto(step + 1); };

  /* ───────── submit ───────── */
  const submit = async () => {
    if (!validate()) return;
    setBusy(true);
    setServerErr(null);
    let payload: Record<string, unknown>;
    const address = { street: d.street, city: d.city, province: d.province, postal: d.postal };
    if (role === "young_man") {
      payload = {
        role, son_first: d.son_first, son_last: d.son_last, son_age: ageFrom(d.dob), dob: d.dob,
        attended_before: d.attended_before, times_attended: d.times_attended ? Number(d.times_attended) : undefined,
        wilderness_experience: d.wilderness_experience || "", dietary: d.dietary || "", medical_notes: d.medical_notes || "", medications: d.medications || "",
        shirt_size: d.shirt_size, pickup: d.pickup,
        health_number: d.health_number, doctor_name: d.doctor_name, doctor_phone: d.doctor_phone,
        parent_name: d.parent_name, relationship: d.relationship, parent_email: d.parent_email, parent_phone: d.parent_phone, address,
        emergency_name: d.emergency_name, emergency_relationship: d.emergency_relationship, emergency_phone: d.emergency_phone, emergency_alt_phone: d.emergency_alt_phone || "",
        heard_from: d.heard_from || "", sponsor_name: d.sponsor_name || "", sponsor_phone: d.sponsor_phone || "",
        participant_mode: d.participant_mode,
        participant_initials: d.participant_mode === "here" ? YM_AGREEMENTS.map((_, i) => d[`ym_init${i}`]) : undefined,
        participant_signature: d.participant_mode === "here" ? d.participant_signature : undefined,
        participant_email: d.participant_email || "",
        participant_consent_waiver: d.participant_mode === "here" ? d.participant_consent_waiver === "1" : undefined,
        witness_mode: d.witness_mode || "none",
        witness_name: d.witness_name || "", witness_email: d.witness_email || "", witness_signature: d.witness_signature || "",
        consent_medical: true, consent_waiver: true, consent_media: true, guardian_signature: d.guardian_signature,
        payment_method: d.payment_method, aid_note: d.aid_note || "", website: d.website || "",
      };
    } else if (role === "man") {
      payload = {
        role, first: d.first, last: d.last, email: d.email, phone: d.phone, address, dietary: d.dietary || "",
        attended_before: d.attended_before, times_attended: d.times_attended ? Number(d.times_attended) : undefined,
        wilderness_experience: d.wilderness_experience || "", departments: DEPTS.filter((x) => d[`dept:${x}`] === "1"), skills: d.skills || "",
        shirt_size: d.shirt_size,
        emergency_name: d.emergency_name, emergency_phone: d.emergency_phone,
        vehicle: { make: d.vehicle_make || "", year: d.vehicle_year || "", fourByFour: d.fourByFour || undefined, driveToSite: d.driveToSite || undefined, passengers: d.passengers || "" },
        initials: MEN_AGREEMENTS.map((_, i) => d[`m_init${i}`]), crc_status: d.crc_status, consent_waiver: true, signature: d.signature,
        witness_mode: d.witness_mode || "none",
        witness_name: d.witness_name || "", witness_email: d.witness_email || "", witness_signature: d.witness_signature || "",

        payment_method: d.payment_method, aid_note: d.aid_note || "", website: d.website || "",
      };
    } else {
      payload = {
        role, name: d.name, email: d.email, phone: d.phone || "", seats: donating ? 1 : Number(d.seats || 1), amount_cents: Math.round(parseFloat(donating ? d.donate_amount || "0" : d.amount) * 100),
        for_whom: d.for_whom || "", message: d.message || "", payment_method: d.payment_method, website: d.website || "",
      };
    }
    try {
      const r = await fetch("/api/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Something went wrong");
      try { sessionStorage.removeItem(KEY); } catch {}
      if (j.url) { window.location.href = j.url; return; }
      const q = new URLSearchParams({ ref: j.ref, path: d.payment_method, role: role!, ...(j.demo ? { demo: "1" } : {}), ...(j.needsSignature ? { sign: "1" } : {}), ...(d.son_first ? { first: d.son_first } : {}) });
      window.location.href = `/thank-you?${q.toString()}`;
    } catch (e) {
      setServerErr((e as Error).message);
      setBusy(false);
    }
  };

  /* ───────── role picker ───────── */
  if (!role) {
    return (
      <div ref={top}>
        <StepHead kicker="Register" title="Who's registering?" lede="One form, on a phone, in about five minutes. Pick your door." />
        {canceledRef && <p className="card mb-6 p-4 text-sm">Card payment was cancelled. Your registration <span className="mono">{canceledRef}</span> is saved as pending — pay by e-transfer, or start again below.</p>}
        <div className="grid gap-3">
          <Choice on={false} onClick={() => { setRole("young_man"); goto(0); }} title={`A young man, ${FACTS.ages.min} to ${FACTS.ages.max}`} line="A parent or guardian registers. He signs his own agreements — on your phone, or from a link we email him." badge={`$${FACTS.priceCAD}`} />
          <Choice on={false} onClick={() => { setRole("man"); goto(0); }} title="A production man" line="Volunteer on the team that produces the weekend. Criminal record check required." badge={`$${FACTS.priceCAD}`} />
          <Choice on={false} onClick={() => { setRole("sponsor"); goto(0); }} title="Sponsor a seat" line="Send a young man you know, or one you don't. A seat is $320; any amount helps." badge="Any amount" />
        </div>
        <p className="mt-8 text-sm text-[color:var(--muted)]">Questions first? <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>. Money the issue? Choose the young man's door and pick assistance at the end.</p>
      </div>
    );
  }

  const name = steps[step];
  const total = steps.length;
  const price = role === "sponsor" ? parseFloat((donating ? d.donate_amount : d.amount) || "0") : FACTS.priceCAD;

  /* ───────── shared blocks ───────── */
  const AddressBlock = (
    <>
      <Field label="Street address" name="street" value={d.street || ""} onChange={(v) => set("street", v)} required autoComplete="street-address" error={errs.street} />
      <Field label="City" name="city" value={d.city || ""} onChange={(v) => set("city", v)} required autoComplete="address-level2" error={errs.city} half />
      <div className="grid grid-cols-2 gap-3 sm:col-span-1">
        <Select label="Province" name="province" value={d.province || ""} onChange={(v) => set("province", v)} options={PROVINCES} required error={errs.province} half />
        <Field label="Postal code" name="postal" value={d.postal || ""} onChange={(v) => set("postal", v.toUpperCase())} required autoComplete="postal-code" error={errs.postal} half />
      </div>
    </>
  );

  /* A witness, as the paper forms had. Offered, never required: a parent alone
     at ten at night can still finish, and the record says so plainly. Someone
     in the room signs here; someone elsewhere gets their own link, which is the
     only version that produces evidence independent of this device. */
  const WitnessBlock = (
    <div className="mt-8 rounded-2xl border border-[color:var(--line)] p-5 sm:p-6">
      <p className="mono text-ember">Witness · optional</p>
      <h3 className="t-h3 mt-2">Is anyone with you?</h3>
      <p className="mt-2 text-sm text-[color:var(--muted)]">
        The paper forms had a witness line. You don't need one, and skipping it changes nothing about your registration. If someone watched you sign, their name makes the record stronger.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <Choice on={!d.witness_mode || d.witness_mode === "none"} onClick={() => set("witness_mode", "none")} title="No witness" line="Carry on. Nothing is missing." />
        <Choice on={d.witness_mode === "here"} onClick={() => set("witness_mode", "here")} title="They're here" line="They sign on this device, now." />
        <Choice on={d.witness_mode === "link"} onClick={() => set("witness_mode", "link")} title="Send them a link" line="They sign from their own phone." />
      </div>
      {(d.witness_mode === "here" || d.witness_mode === "link") && (
        <div className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Their full name" name="witness_name" value={d.witness_name || ""} onChange={(v) => set("witness_name", v)} required error={errs.witness_name} half />
            {d.witness_mode === "link" && <Field label="Their email" name="witness_email" type="email" inputMode="email" value={d.witness_email || ""} onChange={(v) => set("witness_email", v)} required error={errs.witness_email} half />}
          </div>
          {d.witness_mode === "here" ? (
            <>
              <div className="legal"><p>{WITNESS_ATTESTATION.replace("the person named above", d.parent_name || d.first || "the person named above")}</p></div>
              <Signature label={`Their signature${d.witness_name ? `, ${d.witness_name}` : ""}`} value={d.witness_signature || ""} onChange={(v) => set("witness_signature", v)} hint="Hand them the phone. This is their name, not yours." error={errs.witness_signature} />
            </>
          ) : (
            <p className="text-sm text-[color:var(--muted)]">We email them a link. They read one short statement, type their name, and they're done — no account, no form, no obligation. Your registration is complete either way.</p>
          )}
        </div>
      )}
    </div>
  );

  const PaymentBlock = (
    <>
      <div className="grid gap-3">
        <Choice on={d.payment_method === "card"} onClick={() => set("payment_method", "card")} title="Card · Apple Pay · Google Pay" line="Secure checkout by Stripe. Your seat is confirmed the moment it goes through." badge={`$${price.toFixed(0)} CAD`} />
        <Choice on={d.payment_method === "etransfer"} onClick={() => set("payment_method", "etransfer")} title="Interac e-Transfer" line={`Send $${price.toFixed(0)} to ${FACTS.email} with your reference code as the message. We mark it paid when it lands.`} badge={`$${price.toFixed(0)} CAD`} />
        {role !== "sponsor" && (
          <Choice on={d.payment_method === "aid"} onClick={() => set("payment_method", "aid")} title="Assistance or work-to-earn" line="Money is never the reason a young man stays home. Tell us a little and a man from the enrolment team will call." badge="Let's talk">
            {d.payment_method === "aid" && (
              <div className="mt-3" onClick={(e) => e.stopPropagation()}>
                <textarea className="textarea" placeholder="A sentence or two is plenty. Work-to-earn means he earns his seat through community service — many young men choose it." value={d.aid_note || ""} onChange={(e) => set("aid_note", e.target.value)} />
              </div>
            )}
          </Choice>
        )}
      </div>
      {errs.payment_method && <p className="mt-2 text-sm text-flame">{errs.payment_method}</p>}
      <p className="mt-5 text-sm text-[color:var(--muted)]">The fee covers the bus, every meal, tools, the shirt, and the weekend. It is non-refundable unless the weekend is cancelled. Receipts come by email.</p>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" value={d.website || ""} onChange={(e) => set("website", e.target.value)} aria-hidden />
    </>
  );

  return (
    <div ref={top} className="scroll-mt-24">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <button type="button" className="mono text-[color:var(--muted)] hover:text-[color:var(--fg)]" onClick={() => { if (step === 0) { setRole(null); } else goto(step - 1); }}>← {step === 0 ? "Change door" : steps[step - 1]}</button>
          <span className="mono text-[color:var(--muted)]">Step {step + 1} of {total} · {name}</span>
        </div>
        <div className="steps" style={{ gridTemplateColumns: `repeat(${total}, 1fr)` }}>
          {steps.map((s, i) => <i key={s} data-done={i < step} data-now={i === step} />)}
        </div>
      </div>

      {/* ───────── YOUNG MAN ───────── */}
      {role === "young_man" && name === "Him" && (
        <section>
          <StepHead kicker="His registration · 1 of 6" title="Him." lede="Who's getting on the bus." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="His first name" name="son_first" value={d.son_first || ""} onChange={(v) => set("son_first", v)} required autoComplete="off" error={errs.son_first} half />
            <Field label="His last name" name="son_last" value={d.son_last || ""} onChange={(v) => set("son_last", v)} required autoComplete="off" error={errs.son_last} half />
            <Field label="Date of birth" name="dob" type="date" value={d.dob || ""} onChange={(v) => set("dob", v)} required error={errs.dob} half hint={d.dob && ageFrom(d.dob) !== null ? `${ageFrom(d.dob)} on the Friday of the weekend` : `He must be ${FACTS.agesAccepted.min}–${FACTS.agesAccepted.max} on ${FACTS.dates.label.split(",")[0]}`} min={DOB_MIN} max={DOB_MAX} />
            <YesNo label="Has he been to YMAW before?" value={d.attended_before || ""} onChange={(v) => set("attended_before", v)} error={errs.attended_before} />
            {d.attended_before === "yes" && <Field label="How many times?" name="times_attended" type="number" inputMode="numeric" value={d.times_attended || ""} onChange={(v) => set("times_attended", v)} half />}
            <Field label="Any wilderness experience?" name="wilderness_experience" value={d.wilderness_experience || ""} onChange={(v) => set("wilderness_experience", v)} textarea placeholder="Camping, scouts, hiking, none — all fine." />
            <Select label="Shirt size" name="shirt_size" value={d.shirt_size || ""} onChange={(v) => set("shirt_size", v)} options={[...FACTS.shirtSizes]} required error={errs.shirt_size} half hint="Youth sizes start YS. Every young man gets one." />
            <Select label="Where does he get on the bus?" name="pickup" value={d.pickup || ""} onChange={(v) => set("pickup", v)} options={[...PICKUPS]} required error={errs.pickup} half />
            <p className="-mt-1 text-xs text-dust sm:col-span-2">
              {STOPS.map((st) => `${st.town} — ${st.place}, ${st.address}, ${st.depart}`).join(" · ")}. He comes back to the same stop on Sunday. For Squamish, Transport emails you the place and the time.
            </p>
          </div>
        </section>
      )}

      {role === "young_man" && name === "His health" && (
        <section>
          <StepHead kicker="His registration · 2 of 6" title="His health." lede="The safety team reads this before the bus leaves. Nobody else does." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Allergies, asthma, conditions, disabilities" name="medical_notes" value={d.medical_notes || ""} onChange={(v) => set("medical_notes", v)} textarea placeholder="Anything the men should know. Or: none." />
            <Field label="Medications: name, purpose, dose" name="medications" value={d.medications || ""} onChange={(v) => set("medications", v)} textarea placeholder="He brings them in a labelled bag; the safety man holds them if you'd prefer." />
            <Field label="Dietary requirements" name="dietary" value={d.dietary || ""} onChange={(v) => set("dietary", v)} placeholder="Vegetarian, vegan, no nuts, no dairy, halal…" />
            <Field label="BC Services Card / health number" name="health_number" value={d.health_number || ""} onChange={(v) => set("health_number", v)} required inputMode="numeric" error={errs.health_number} half hint="Stored privately. Only the safety team sees it." />
            <Field label="Doctor's name" name="doctor_name" value={d.doctor_name || ""} onChange={(v) => set("doctor_name", v)} required error={errs.doctor_name} half />
            <Field label="Doctor's phone" name="doctor_phone" type="tel" inputMode="tel" value={d.doctor_phone || ""} onChange={(v) => set("doctor_phone", v)} required error={errs.doctor_phone} half />
          </div>
          {/* PIPA wants the purpose stated where the information is taken, not
              buried on another page. It is also just the decent thing to do. */}
          <p className="mt-5 text-sm text-[color:var(--muted)]">
            This is the only part of the form that is medical. It goes to the safety team, it travels with them on paper for the weekend, and it is erased within ninety days after the weekend ends. What we keep, and for how long, is set out in our <Link href="/privacy" className="link">privacy notice</Link>.
          </p>
        </section>
      )}

      {role === "young_man" && name === "You" && (
        <section>
          <StepHead kicker="His registration · 3 of 6" title="You." lede="The parent or guardian signing for him, and who we call if we need to." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your full name" name="parent_name" value={d.parent_name || ""} onChange={(v) => set("parent_name", v)} required autoComplete="name" error={errs.parent_name} half />
            <Select label="Relationship to him" name="relationship" value={d.relationship || ""} onChange={(v) => set("relationship", v)} options={RELATIONSHIPS} required error={errs.relationship} half />
            <Field label="Your email" name="parent_email" type="email" inputMode="email" value={d.parent_email || ""} onChange={(v) => set("parent_email", v)} required autoComplete="email" error={errs.parent_email} half hint="Confirmation and the bus details go here." />
            <Field label="Your phone" name="parent_phone" type="tel" inputMode="tel" value={d.parent_phone || ""} onChange={(v) => set("parent_phone", v)} required autoComplete="tel" error={errs.parent_phone} half />
            {AddressBlock}
            <h2 className="t-h3 mt-4 sm:col-span-2">Emergency contact</h2>
            <p className="-mt-2 text-sm text-[color:var(--muted)] sm:col-span-2">Someone other than you, in case you can't be reached over the weekend.</p>
            <Field label="Name" name="emergency_name" value={d.emergency_name || ""} onChange={(v) => set("emergency_name", v)} required error={errs.emergency_name} half />
            <Select label="Relationship to him" name="emergency_relationship" value={d.emergency_relationship || ""} onChange={(v) => set("emergency_relationship", v)} options={EMERGENCY_RELATIONSHIPS} required error={errs.emergency_relationship} half />
            <Field label="Phone" name="emergency_phone" type="tel" inputMode="tel" value={d.emergency_phone || ""} onChange={(v) => set("emergency_phone", v)} required error={errs.emergency_phone} half />
            <Field label="Second phone" name="emergency_alt_phone" type="tel" inputMode="tel" value={d.emergency_alt_phone || ""} onChange={(v) => set("emergency_alt_phone", v)} half />
            <h2 className="t-h3 mt-4 sm:col-span-2">Two more things</h2>
            <Select label="How did you hear about YMAW?" name="heard_from" value={d.heard_from || ""} onChange={(v) => set("heard_from", v)} options={HEARD} />
            <Field label="Sponsor's name" name="sponsor_name" value={d.sponsor_name || ""} onChange={(v) => set("sponsor_name", v)} half hint="If a man invited him, name him. He'll want to know." />
            <Field label="Sponsor's phone" name="sponsor_phone" type="tel" inputMode="tel" value={d.sponsor_phone || ""} onChange={(v) => set("sponsor_phone", v)} half />
          </div>
        </section>
      )}

      {role === "young_man" && name === "His part" && (
        <section>
          <StepHead kicker="His registration · 4 of 6" title="His part." lede="Four agreements are his to sign, not yours. The weekend starts here." />
          <div className="mb-6 grid gap-3 sm:grid-cols-2">
            <Choice on={d.participant_mode === "here"} onClick={() => { set("participant_mode", "here"); setHanded(false); }} title="He's here" line="Hand him the phone. Two minutes." />
            <Choice on={d.participant_mode === "link"} onClick={() => set("participant_mode", "link")} title="He's not here" line="We'll email him a link to sign his part. You can finish yours now." />
          </div>

          {d.participant_mode === "link" && (
            <div className="grid gap-4">
              <Field label="His email (or leave blank and we'll send it to yours)" name="participant_email" type="email" inputMode="email" value={d.participant_email || ""} onChange={(v) => set("participant_email", v)} error={errs.participant_email} />
              <p className="text-sm text-[color:var(--muted)]">His seat is held once you pay. It's confirmed when he signs. The link works for 30 days.</p>
            </div>
          )}

          {d.participant_mode === "here" && !handed && (
            <button type="button" onClick={() => setHanded(true)} className="group relative block w-full overflow-hidden rounded-2xl bg-ember p-8 text-left text-night transition-transform duration-500 hover:-translate-y-1 sm:p-12">
              <span className="mono text-night/70">Step one</span>
              <span className="display mt-2 block text-[3rem] leading-none sm:text-[4.5rem]">Hand him the phone.</span>
              <span className="mt-3 block max-w-[30rem] text-night/80">What comes next is written to him. When he's holding it, tap below.</span>
              <span className="btn btn-ink mt-6">He has it →</span>
            </button>
          )}

          {d.participant_mode === "here" && handed && (
            <div className="rounded-2xl border border-[color:var(--line)] p-5 sm:p-7">
              <p className="mono text-ember">To {d.son_first || "you"}</p>
              <p className="t-lede mt-2">This is the part nobody can do for you.</p>
              <p className="mt-3 text-[color:var(--muted)]">Read each line. If you agree, put your initials next to it. Then sign your name. Men have signed these same lines before every weekend since 1990. If you're not sure about one, ask.</p>
              <div className="mt-6 divide-y divide-[color:var(--line)]">
                {YM_AGREEMENTS.map((t, i) => (
                  <Agreement key={i} n={i + 1} text={t} initials={d[`ym_init${i}`] || ""} onChange={(v) => setInit("ym_init", i, v)} error={errs[`ym_init${i}`]} />
                ))}
              </div>
              <div className="mt-8">
                <h3 className="t-h3">The release and waiver</h3>
                <p className="mt-2 text-sm text-[color:var(--muted)]">Your parent is agreeing to this for you. You sign it too, because it is about you and you should know what it says.</p>
                <div className="legal mt-3">
                  <p>{YM_WAIVER_INTRO}</p>
                  {YM_WAIVER.map((p, i) => <p key={i}><strong>{i + 1}.</strong> {p}</p>)}
                </div>
                <div className="mt-3"><Check checked={d.participant_consent_waiver === "1"} onChange={(v) => set("participant_consent_waiver", v ? "1" : "")} error={errs.participant_consent_waiver}>I have read the release and waiver and I agree to it.</Check></div>
              </div>
              <div className="mt-6">
                <Signature label="Your signature" value={d.participant_signature || ""} onChange={(v) => set("participant_signature", v)} hint="Type your full name. That's your word, for everything above." error={errs.participant_signature} />
              </div>
              <p className="mt-6 text-sm text-[color:var(--muted)]">Done. Hand it back.</p>
            </div>
          )}
        </section>
      )}

      {role === "young_man" && name === "Your part" && (
        <section>
          <StepHead kicker="His registration · 5 of 6" title="Your part." lede="Medical consent, the release and waiver, and the photo and video release." />
          <div className="grid gap-7">
            <div>
              <h2 className="t-h3">Medical treatment</h2>
              <div className="legal mt-3"><p>As parent or guardian of <strong>{d.son_first} {d.son_last}</strong>: {MEDICAL_CONSENT}</p></div>
              <div className="mt-3"><Check checked={d.consent_medical === "1"} onChange={(v) => set("consent_medical", v ? "1" : "")} error={errs.consent_medical}>I give this consent.</Check></div>
            </div>
            <div>
              <h2 className="t-h3">Release and waiver of liability</h2>
              <div className="legal mt-3">
                <p>{YM_WAIVER_INTRO}</p>
                {YM_WAIVER.map((p, i) => <p key={i}><strong>{i + 1}.</strong> {p}</p>)}
                <p className="mono !text-[0.65rem] text-[color:var(--muted)]">Version {WAIVER_VERSION}</p>
              </div>
              <div className="mt-3"><Check checked={d.consent_waiver === "1"} onChange={(v) => set("consent_waiver", v ? "1" : "")} error={errs.consent_waiver}>I have read the release and waiver and I agree to it on behalf of myself and {d.son_first || "the participant"}.</Check></div>
            </div>
            <div>
              <h2 className="t-h3">Photos and video of him</h2>
              <p className="mt-2 text-sm text-[color:var(--muted)]">Every frame on this website was taken at a real weekend by the men. This is how the next young man finds it.</p>
              <div className="legal mt-3"><p>As parent or guardian of <strong>{d.son_first} {d.son_last}</strong>: {MEDIA_RELEASE}</p></div>
              <div className="mt-3"><Check checked={d.consent_media === "1"} onChange={(v) => set("consent_media", v ? "1" : "")} error={errs.consent_media}>I agree to the photo and video release.</Check></div>
            </div>
            <Signature label={`Your signature, ${d.parent_name || "parent or guardian"}`} value={d.guardian_signature || ""} onChange={(v) => set("guardian_signature", v)} error={errs.guardian_signature} />

            {WitnessBlock}
          </div>
        </section>
      )}

      {role === "young_man" && name === "Payment" && (
        <section>
          <StepHead kicker="His registration · 6 of 6" title="Payment." lede={`$${FACTS.priceCAD} CAD. Everything included.`} />
          {PaymentBlock}
        </section>
      )}

      {/* ───────── MAN ───────── */}
      {role === "man" && name === "You" && (
        <section>
          <StepHead kicker="Production man · 1 of 5" title="You." lede="Fathers, tradesmen, teachers, men who came through the weekend. We need you more than another sentence." />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" name="first" value={d.first || ""} onChange={(v) => set("first", v)} required autoComplete="given-name" error={errs.first} half />
            <Field label="Last name" name="last" value={d.last || ""} onChange={(v) => set("last", v)} required autoComplete="family-name" error={errs.last} half />
            <Field label="Email" name="email" type="email" inputMode="email" value={d.email || ""} onChange={(v) => set("email", v)} required autoComplete="email" error={errs.email} half />
            <Field label="Phone" name="phone" type="tel" inputMode="tel" value={d.phone || ""} onChange={(v) => set("phone", v)} required autoComplete="tel" error={errs.phone} half />
            {AddressBlock}
            <YesNo label="Have you staffed YMAW before?" value={d.attended_before || ""} onChange={(v) => set("attended_before", v)} error={errs.attended_before} />
            {d.attended_before === "yes" && <Field label="How many weekends?" name="times_attended" type="number" inputMode="numeric" value={d.times_attended || ""} onChange={(v) => set("times_attended", v)} half />}
            <Field label="Wilderness or relevant experience" name="wilderness_experience" value={d.wilderness_experience || ""} onChange={(v) => set("wilderness_experience", v)} textarea placeholder="First aid, trades, cooking for crowds, guiding, none — say so." />
            <div className="field sm:col-span-2">
              <span className="lbl">Where would you serve? (pick any)</span>
              <div className="flex flex-wrap gap-2">
                {DEPTS.map((x) => (
                  <button key={x} type="button" className="choice !rounded-full !px-4 !py-2 text-sm" data-on={d[`dept:${x}`] === "1"} onClick={() => set(`dept:${x}`, d[`dept:${x}`] === "1" ? "" : "1")} aria-pressed={d[`dept:${x}`] === "1"}>{x}</button>
                ))}
              </div>
              <p className="text-xs text-dust">First weekend? You'll likely be a shadow. It's the best seat in the house.</p>
            </div>
            <Field label="Dietary requirements" name="dietary" value={d.dietary || ""} onChange={(v) => set("dietary", v)} half />
            <Select label="Shirt size" name="shirt_size" value={d.shirt_size || ""} onChange={(v) => set("shirt_size", v)} options={[...FACTS.shirtSizes]} required error={errs.shirt_size} half />
            <Field label="Emergency contact name" name="emergency_name" value={d.emergency_name || ""} onChange={(v) => set("emergency_name", v)} required error={errs.emergency_name} half />
            <Field label="Emergency contact phone" name="emergency_phone" type="tel" inputMode="tel" value={d.emergency_phone || ""} onChange={(v) => set("emergency_phone", v)} required error={errs.emergency_phone} half />
          </div>
        </section>
      )}

      {role === "man" && name === "Vehicle" && (
        <section>
          <StepHead kicker="Production man · 2 of 5" title="Vehicle." lede="The last stretch to the site is rough road. Transport plans the convoy from this." />
          <div className="grid gap-4 sm:grid-cols-2">
            <YesNo label="Will you drive to the site?" value={d.driveToSite || ""} onChange={(v) => set("driveToSite", v)} error={errs.driveToSite} />
            {d.driveToSite === "yes" && (
              <>
                <Field label="Make and model" name="vehicle_make" value={d.vehicle_make || ""} onChange={(v) => set("vehicle_make", v)} half />
                <Field label="Year" name="vehicle_year" value={d.vehicle_year || ""} onChange={(v) => set("vehicle_year", v)} half inputMode="numeric" />
                <YesNo label="4x4 / AWD?" value={d.fourByFour || ""} onChange={(v) => set("fourByFour", v)} />
                <Field label="Seats you can offer (including you)" name="passengers" value={d.passengers || ""} onChange={(v) => set("passengers", v)} half inputMode="numeric" />
              </>
            )}
          </div>
        </section>
      )}

      {role === "man" && name === "Agreements" && (
        <section>
          <StepHead kicker="Production man · 3 of 5" title="Agreements." lede="The standards the men hold each other to. Initial each line." />
          <div className="divide-y divide-[color:var(--line)] rounded-2xl border border-[color:var(--line)] px-5">
            {MEN_AGREEMENTS.map((t, i) => <Agreement key={i} n={i + 1} text={t} initials={d[`m_init${i}`] || ""} onChange={(v) => setInit("m_init", i, v)} error={errs[`m_init${i}`]} />)}
          </div>
          <h2 className="t-h3 mt-8">Criminal record check</h2>
          <p className="mt-2 text-sm text-[color:var(--muted)]">Every man on site has one. BC residents: the online portal takes ten minutes. Outside BC: your local police station, with the Society's letter (email us).</p>
          <div className="mt-4 rounded-2xl border border-ember/40 bg-ember/5 p-5">
            <p className="mono text-ember">The Society&rsquo;s access code</p>
            <p className="mono mt-2 select-all text-[clamp(1.6rem,5vw,2.4rem)] font-bold leading-none tracking-[0.12em] text-[color:var(--fg)]">{FACTS.crc.code}</p>
            <p className="mt-3 text-sm text-[color:var(--muted)]">Enter it at <a className="link" href={FACTS.crc.portal} target="_blank" rel="noopener">{FACTS.crc.portal}</a>. Tap the code to select it.</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Choice on={d.crc_status === "done"} onClick={() => set("crc_status", "done")} title="Done" line="I have a current CRC on file with the Society, or I've just submitted one." />
            <Choice on={d.crc_status === "will"} onClick={() => set("crc_status", "will")} title="I'll do it this week" line="I understand I can't attend without it." />
          </div>
          {errs.crc_status && <p className="mt-2 text-sm text-flame">{errs.crc_status}</p>}
        </section>
      )}

      {role === "man" && name === "Waiver" && (
        <section>
          <StepHead kicker="Production man · 4 of 5" title="Release and waiver." />
          <div className="legal">
            <p>{MEN_WAIVER_INTRO}</p>
            {MEN_WAIVER.map((p, i) => <p key={i}><strong>{i + 1}.</strong> {p}</p>)}
            <p className="mono !text-[0.65rem] text-[color:var(--muted)]">Version {WAIVER_VERSION}</p>
          </div>
          <div className="mt-4"><Check checked={d.consent_waiver === "1"} onChange={(v) => set("consent_waiver", v ? "1" : "")} error={errs.consent_waiver}>I have read the release and waiver and I agree to it.</Check></div>
          <div className="mt-6"><Signature label={`Your signature, ${d.first || ""} ${d.last || ""}`} value={d.signature || ""} onChange={(v) => set("signature", v)} error={errs.signature} /></div>
          <div className="mt-8">{WitnessBlock}</div>
        </section>
      )}

      {role === "man" && name === "Payment" && (
        <section>
          <StepHead kicker="Production man · 5 of 5" title="Payment." lede={`$${FACTS.priceCAD} CAD covers your meals, your shirt and your share of the weekend. Every man pays it; nobody is paid.`} />
          {PaymentBlock}
        </section>
      )}

      {/* ───────── SPONSOR ───────── */}
      {role === "sponsor" && name === "You" && (
        <section>
          <StepHead
            kicker={donating ? "Donate · 1 of 2" : "Sponsor · 1 of 2"}
            title={donating ? "Give what you can." : "Send a young man."}
            lede={donating ? `Gear, food, the bus, and seats for young men whose families can't cover the fee. A whole seat is $${FACTS.priceCAD}; any amount helps.` : `A seat is $${FACTS.priceCAD}. Sponsor one you know, or one you don't, or part of one.`}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Your name" name="name" value={d.name || ""} onChange={(v) => set("name", v)} required autoComplete="name" error={errs.name} half />
            <Field label="Email" name="email" type="email" inputMode="email" value={d.email || ""} onChange={(v) => set("email", v)} required autoComplete="email" error={errs.email} half />
            <Field label="Phone" name="phone" type="tel" inputMode="tel" value={d.phone || ""} onChange={(v) => set("phone", v)} half />
            {!donating && <Field label="Seats" name="seats" type="number" inputMode="numeric" value={d.seats || "1"} onChange={(v) => { set("seats", v); const n = parseInt(v || "1", 10); if (n > 0) set("amount", String(n * FACTS.priceCAD)); }} required min="1" max="20" half />}
            <Field label="Amount (CAD)" name="amount" type="number" inputMode="decimal" value={donating ? (d.donate_amount ?? "") : d.amount || ""} onChange={(v) => set(donating ? "donate_amount" : "amount", v)} required error={errs.amount} half hint={donating ? "Any amount. Every dollar goes to the weekend." : "Edit for a partial seat or a bigger gift."} />
            <Field label="Who is it for?" name="for_whom" value={d.for_whom || ""} onChange={(v) => set("for_whom", v)} textarea placeholder="A young man you know (his name and a parent's contact), or 'whoever needs it most'." />
            <Field label="A line for him, if you'd like" name="message" value={d.message || ""} onChange={(v) => set("message", v)} textarea placeholder="Men who went once write the best ones." />
          </div>
        </section>
      )}

      {role === "sponsor" && name === "Payment" && (
        <section>
          <StepHead kicker="Sponsor · 2 of 2" title="Payment." lede={`$${price.toFixed(0)} CAD. Thank you.`} />
          {PaymentBlock}
        </section>
      )}

      {/* ───────── nav ───────── */}
      {serverErr && <p className="card mt-6 border-flame/50 p-4 text-sm text-flame">{serverErr}</p>}
      <div className="mt-10 flex flex-wrap items-center gap-3">
        {step > 0 && <button type="button" className="btn btn-ghost" onClick={() => goto(step - 1)}>Back</button>}
        {step < total - 1 ? (
          <button type="button" className="btn btn-ember" onClick={next}>Continue</button>
        ) : (
          <button type="button" className="btn btn-ember btn-lg" disabled={busy} onClick={submit}>
            {busy ? "One moment…" : d.payment_method === "card" ? `Pay $${price.toFixed(0)} and register` : d.payment_method === "aid" ? "Send it" : "Register"}
          </button>
        )}
        <span className="ml-auto flex items-center gap-2 text-xs text-dust"><FireMark size={12} title="" /> Saved as you go on this device</span>
      </div>
      {step === total - 1 && <p className="mt-4 text-xs text-dust">By continuing you agree that the signatures typed above are your own and are binding. We email you a PDF of everything you signed. <Link href="/privacy" className="link">Privacy notice</Link> · <Link href="/faq" className="link">Questions</Link></p>}
    </div>
  );
}
