import { NextResponse } from "next/server";
import { supabase } from "@/lib/server";
import { FACTS, PICKUPS } from "@/lib/facts";

export const runtime = "nodejs";

// A man changes a cell in the Google Sheet; the sheet posts here; the database
// changes. That is the whole point: the enrolment men are on the phone chasing
// shirt sizes and record checks, and the sheet is where they already are.
//
// The database stays the record. The sheet is a window that can now be written
// through, one field at a time, under the same rules the registration form uses.

type Setter = (v: string, row: Record<string, unknown>) => Record<string, unknown>;
type Field = { label: string; set: Setter; check?: (v: string) => string | null };

const trim = (v: string) => v.trim();
const orNull = (v: string) => (v.trim() === "" ? null : v.trim());
const list = (v: string) => v.split(",").map((s) => s.trim()).filter(Boolean);
const oneOf = (allowed: readonly string[], what: string) => (v: string) =>
  v.trim() === "" || allowed.includes(v.trim()) ? null : `Has to be ${what}.`;

// Only these. Anything else the sheet sends is refused and the cell is put back
// the way it was, so nobody can quietly edit a signature time or a total.
const FIELDS: Record<string, Field> = {
  _name: {
    label: "name",
    check: (v) => (v.trim().length < 2 ? "A name needs at least two letters." : null),
    set: (v) => {
      const parts = trim(v).split(/\s+/);
      return { son_first: parts[0], son_last: parts.slice(1).join(" ") };
    },
  },
  son_age: {
    label: "age",
    check: (v) => {
      if (v.trim() === "") return null;
      const n = Number(v);
      return Number.isInteger(n) && n >= FACTS.agesAccepted.min && n <= FACTS.agesAccepted.max
        ? null
        : `Age has to be a whole number from ${FACTS.agesAccepted.min} to ${FACTS.agesAccepted.max}.`;
    },
    set: (v) => ({ son_age: v.trim() === "" ? null : Number(v) }),
  },
  dob: {
    label: "date of birth",
    check: (v) => (v.trim() === "" || /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) ? null : "Use YYYY-MM-DD."),
    set: (v) => ({ dob: orNull(v) }),
  },
  pickup: { label: "pickup stop", check: oneOf(PICKUPS as readonly string[], PICKUPS.join(" or ")), set: (v) => ({ pickup: orNull(v) }) },
  dropoff: { label: "drop-off stop", check: oneOf(PICKUPS as readonly string[], PICKUPS.join(" or ")), set: (v) => ({ dropoff: orNull(v) }) },
  shirt_size: {
    label: "shirt size",
    check: oneOf(FACTS.shirtSizes as readonly string[], `one of ${FACTS.shirtSizes.join(", ")}`),
    set: (v) => ({ shirt_size: orNull(v) }),
  },
  parent_name: { label: "parent or guardian", set: (v) => ({ parent_name: trim(v) }) },
  relationship: { label: "relationship", set: (v) => ({ relationship: orNull(v) }) },
  parent_email: {
    label: "email",
    check: (v) => (v.trim() === "" || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.trim()) ? null : "That email doesn't look right."),
    set: (v) => ({ parent_email: trim(v) }),
  },
  parent_phone: { label: "phone", set: (v) => ({ parent_phone: trim(v) }) },
  emergency_name: { label: "emergency contact", set: (v) => ({ emergency_name: trim(v) }) },
  emergency_relationship: { label: "emergency relationship", set: (v) => ({ emergency_relationship: orNull(v) }) },
  emergency_phone: { label: "emergency phone", set: (v) => ({ emergency_phone: trim(v) }) },
  emergency_alt_phone: { label: "second phone", set: (v) => ({ emergency_alt_phone: orNull(v) }) },
  release_to_name: { label: "who may collect him", set: (v) => ({ release_to_name: orNull(v) }) },
  release_to_phone: { label: "their phone", set: (v) => ({ release_to_phone: orNull(v) }) },
  release_to2_name: { label: "second person who may collect him", set: (v) => ({ release_to2_name: orNull(v) }) },
  release_to2_phone: { label: "their phone", set: (v) => ({ release_to2_phone: orNull(v) }) },
  dietary: { label: "dietary", set: (v) => ({ dietary: orNull(v) }) },
  medical_notes: { label: "medical notes", set: (v) => ({ medical_notes: orNull(v) }) },
  medications: { label: "medications", set: (v) => ({ medications: orNull(v) }) },
  doctor_name: { label: "doctor", set: (v) => ({ doctor_name: orNull(v) }) },
  doctor_phone: { label: "doctor's phone", set: (v) => ({ doctor_phone: orNull(v) }) },
  notes: { label: "notes", set: (v) => ({ notes: orNull(v) }) },
  payment_method: {
    label: "payment method",
    check: oneOf(["card", "etransfer", "aid"], "card, etransfer or aid"),
    set: (v) => ({ payment_method: trim(v) || "card" }),
  },
  payment_status: {
    label: "payment status",
    check: oneOf(["pending", "paid", "aid_requested", "waived", "refunded", "cancelled"],
      "pending, paid, aid_requested, waived, refunded or cancelled"),
    set: (v) =>
      v.trim() === "paid"
        ? { payment_status: "paid", paid_at: new Date().toISOString() }
        : { payment_status: trim(v) || "pending" },
  },
  _crc: {
    label: "record check",
    check: oneOf(["not started", "submitted", "done", "cleared"], "not started, submitted or done"),
    set: (v, row) => ({ details: { ...((row.details as Record<string, unknown>) || {}), crc_status: v.trim() || "not started" } }),
  },
  _departments: {
    label: "departments",
    set: (v, row) => ({ details: { ...((row.details as Record<string, unknown>) || {}), departments: list(v) } }),
  },
  _skills: {
    label: "skills",
    set: (v, row) => ({ details: { ...((row.details as Record<string, unknown>) || {}), skills: orNull(v) } }),
  },
};

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { token?: string; ref?: string; field?: string; value?: string; who?: string }
    | null;
  if (!body?.token || !body.ref || !body.field) {
    return NextResponse.json({ ok: false, error: "Bad request." }, { status: 400 });
  }

  const db = supabase();
  if (!db) return NextResponse.json({ ok: false, error: "No database." }, { status: 503 });

  const want = await db.from("settings").select("value").eq("key", "sheet_write_token").maybeSingle();
  if (!want.data?.value || body.token !== want.data.value) {
    return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 401 });
  }

  const spec = FIELDS[body.field];
  if (!spec) {
    return NextResponse.json(
      { ok: false, error: "That column is written by the website and can't be edited here." },
      { status: 422 },
    );
  }

  const value = body.value ?? "";
  const complaint = spec.check?.(value);
  if (complaint) return NextResponse.json({ ok: false, error: complaint }, { status: 422 });

  const cur = await db.from("registrations").select("*").eq("ref", body.ref).maybeSingle();
  if (cur.error || !cur.data) {
    return NextResponse.json({ ok: false, error: `No registration called ${body.ref}.` }, { status: 404 });
  }

  const patch = spec.set(value, cur.data as Record<string, unknown>);
  const upd = await db.from("registrations").update(patch).eq("ref", body.ref).select("ref").maybeSingle();
  if (upd.error) return NextResponse.json({ ok: false, error: upd.error.message }, { status: 500 });

  // A line in the record of who changed what, so a disagreement later can be
  // settled by looking rather than by remembering.
  await db
    .from("edits")
    .insert({
      ref: body.ref,
      field: spec.label,
      value: value.slice(0, 500),
      who: (body.who || "the sheet").slice(0, 160),
    })
    .then(
      () => undefined,
      () => undefined,
    );

  return NextResponse.json({ ok: true, ref: body.ref, field: body.field, label: spec.label });
}
