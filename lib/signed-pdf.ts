// The copy of what you signed.
//
// Under the old paper process a family kept the form they filled in. On a
// website nobody keeps anything unless you hand it to them, so every
// registration produces this: one PDF carrying the full text of each document,
// who put their name to it, when, and from where. It goes to the registrant and
// to the Society, so two independent copies exist outside the database.
import "server-only";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { FACTS } from "./facts";
import type { LegalSnapshot } from "./legal-record";

const PAGE = { w: 612, h: 792 };
const M = { l: 56, r: 56, t: 62, b: 58 };
const INK = rgb(0.09, 0.07, 0.05);
const MUTED = rgb(0.42, 0.4, 0.37);
const FLAME = rgb(0.76, 0.22, 0.09);
const RULE = rgb(0.82, 0.79, 0.74);

export type SignedRecord = {
  ref: string;
  role: "young_man" | "man" | "sponsor";
  snapshot: LegalSnapshot;
  legal_hash: string;
  /** Display name of the person or people the record is about. */
  subject: string;
  submitted_at: string;
  signatures: {
    label: string;
    name: string | null;
    signed_at: string | null;
    ip: string | null;
    /** Present where the signer initialled clause by clause. */
    initials?: string[] | null;
    /** Set when the signature is still outstanding. */
    pending?: string;
  }[];
  facts: [string, string][];
};

const dt = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleString("en-CA", { timeZone: "America/Vancouver", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true }) + " Pacific"
    : "—";

export async function signedRecordPdf(r: SignedRecord): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  doc.setTitle(`YMAW ${FACTS.year} signed record · ${r.ref}`);
  doc.setAuthor(FACTS.society);
  doc.setSubject("Signed registration, agreements, release and waiver of liability");
  doc.setProducer("ymaw.com");
  doc.setCreationDate(new Date(r.submitted_at));

  const body = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique);

  const pages: PDFPage[] = [];
  let page = doc.addPage([PAGE.w, PAGE.h]);
  pages.push(page);
  let y = PAGE.h - M.t;
  const width = PAGE.w - M.l - M.r;

  const room = (need: number) => {
    if (y - need >= M.b + 22) return;
    page = doc.addPage([PAGE.w, PAGE.h]);
    pages.push(page);
    y = PAGE.h - M.t;
  };

  const wrap = (text: string, font: PDFFont, size: number, max: number) => {
    const out: string[] = [];
    for (const para of text.split("\n")) {
      let line = "";
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const next = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(next, size) > max && line) {
          out.push(line);
          line = word;
        } else line = next;
      }
      out.push(line);
    }
    return out;
  };

  const text = (
    s: string,
    o: { font?: PDFFont; size?: number; color?: typeof INK; indent?: number; gap?: number; lead?: number } = {},
  ) => {
    const font = o.font || body;
    const size = o.size ?? 9.5;
    const lead = o.lead ?? size * 1.42;
    const indent = o.indent ?? 0;
    for (const line of wrap(s, font, size, width - indent)) {
      room(lead);
      page.drawText(line, { x: M.l + indent, y: y - size, size, font, color: o.color || INK });
      y -= lead;
    }
    y -= o.gap ?? 0;
  };

  const rule = (gap = 10) => {
    room(gap + 2);
    page.drawLine({ start: { x: M.l, y: y - 2 }, end: { x: PAGE.w - M.r, y: y - 2 }, thickness: 0.6, color: RULE });
    y -= gap;
  };

  const heading = (kicker: string, title: string) => {
    room(52);
    text(kicker.toUpperCase(), { font: bold, size: 7.5, color: FLAME, lead: 12 });
    text(title, { font: bold, size: 15, lead: 19, gap: 4 });
  };

  /* ── masthead ── */
  page.drawText("YMAW", { x: M.l, y: y - 20, size: 22, font: bold, color: INK });
  page.drawText(`${FACTS.society}  ·  Incorporation No. ${FACTS.incorporation}`, { x: M.l, y: y - 34, size: 7.5, font: body, color: MUTED });
  const refW = bold.widthOfTextAtSize(r.ref, 12);
  page.drawText(r.ref, { x: PAGE.w - M.r - refW, y: y - 20, size: 12, font: bold, color: FLAME });
  y -= 48;
  rule(16);

  text("Signed record of registration", { font: bold, size: 19, lead: 22, gap: 2 });
  text(`${FACTS.name}, ${FACTS.dates.label}, ${FACTS.region}.`, { size: 10, color: MUTED, gap: 12 });
  text(
    "This document reproduces, in full, every agreement, consent, release and waiver that was shown on screen and agreed to. Keep it. If anything below is not what you intended to agree to, write to " +
      FACTS.email +
      " and we will correct the record.",
    { size: 9, color: MUTED, gap: 16 },
  );

  /* ── the facts of the registration ── */
  heading("Registration", r.subject);
  const rows: [string, string][] = [
    ["Reference", r.ref],
    ["Submitted", dt(r.submitted_at)],
    ...r.facts,
    ["Waiver version", r.snapshot.waiver_version],
    ["Privacy notice", r.snapshot.privacy_version],
    ["Document fingerprint", r.legal_hash],
  ];
  for (const [k, v] of rows) {
    const lines = wrap(v, body, 9, width - 132);
    room(lines.length * 13 + 3);
    page.drawText(k, { x: M.l, y: y - 9, size: 8, font: bold, color: MUTED });
    lines.forEach((line, i) => page.drawText(line, { x: M.l + 132, y: y - 9 - i * 13, size: 9, font: k === "Document fingerprint" ? italic : body, color: INK }));
    y -= lines.length * 13 + 3;
  }
  y -= 8;
  text(
    "The fingerprint is a SHA-256 of the exact wording reproduced below. If a single character of it changed, the fingerprint would not match.",
    { size: 7.5, color: MUTED, gap: 16 },
  );

  /* ── signatures ── */
  rule(14);
  heading("Signatures", "Who put their name to this");
  for (const s of r.signatures) {
    room(46);
    text(s.label, { font: bold, size: 8, color: FLAME, lead: 12 });
    if (s.pending) {
      text(s.pending, { font: italic, size: 10, color: MUTED, lead: 14 });
    } else {
      text(s.name || "—", { font: bold, size: 13, lead: 16 });
      text(`Typed as a signature on ${dt(s.signed_at)}${s.ip ? `, from ${s.ip}` : ""}.`, { size: 8, color: MUTED, lead: 11 });
      if (s.initials?.length) text(`Initialled each clause: ${s.initials.join("  ·  ")}`, { size: 8, color: MUTED, lead: 11 });
    }
    y -= 8;
  }
  y -= 4;
  text(
    "Signatures on this record were typed by the signer. Under British Columbia's Electronic Transactions Act a signature in electronic form has the same effect as one on paper.",
    { size: 7.5, color: MUTED, gap: 6 },
  );

  /* ── the documents, verbatim ── */
  for (const d of r.snapshot.documents) {
    // Enough room that a heading is never stranded above a single clause.
    room(120);
    rule(14);
    const who = d.signed_by === "guardian" ? "Signed by the parent or guardian" : d.signed_by === "participant" ? "Signed by the young man" : "Signed by the volunteer";
    heading(who, d.title);
    if (d.intro) text(d.intro, { size: 9.5, gap: 8 });
    if (d.body) text(d.body, { size: 9.5, gap: 4 });
    if (d.clauses) {
      d.clauses.forEach((c, i) => {
        room(26);
        const label = `${i + 1}.`;
        page.drawText(label, { x: M.l, y: y - 9.5, size: 9.5, font: bold, color: INK });
        const lines = wrap(c, body, 9.5, width - 20);
        lines.forEach((line, j) => page.drawText(line, { x: M.l + 20, y: y - 9.5 - j * 13.5, size: 9.5, font: body, color: INK }));
        y -= lines.length * 13.5 + 6;
      });
    }
  }

  if (!r.snapshot.documents.length) {
    rule(14);
    text("No agreements, waivers or releases were required for this registration.", { font: italic, size: 9.5, color: MUTED });
  }

  /* ── page furniture ── */
  const total = pages.length;
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: M.l, y: M.b - 6 }, end: { x: PAGE.w - M.r, y: M.b - 6 }, thickness: 0.6, color: RULE });
    p.drawText(`${FACTS.society}  ·  Incorporation No. ${FACTS.incorporation}  ·  ymaw.com`, { x: M.l, y: M.b - 20, size: 7, font: body, color: MUTED });
    const tag = `${r.ref}  ·  Page ${i + 1} of ${total}`;
    p.drawText(tag, { x: PAGE.w - M.r - body.widthOfTextAtSize(tag, 7), y: M.b - 20, size: 7, font: body, color: MUTED });
  });

  return doc.save();
}

/* ─────────────────────────────────────────────────────────────
   Turning a stored registration back into a signed record. Both
   /api/register (at submission) and /api/sign (when a young man signs his own
   agreements days later) build the PDF from the same row, so the copy the
   family keeps and the copy the Society keeps are the same document.
   ───────────────────────────────────────────────────────────── */

type Row = Record<string, unknown>;
const str = (v: unknown) => (v == null ? null : String(v));
const money = (c: unknown) => `$${((Number(c) || 0) / 100).toFixed(2)} CAD`;
const PAY: Record<string, string> = { card: "Card, through Stripe", etransfer: "Interac e-transfer", aid: "Financial assistance requested" };

export function buildSignedRecord(row: Row): SignedRecord | null {
  const role = String(row.role) as SignedRecord["role"];
  const snapshot = row.legal_snapshot as LegalSnapshot | null;
  // Older rows, and sponsors, have nothing to reproduce.
  if (!snapshot || !snapshot.documents?.length) return null;
  const details = (row.details || {}) as Record<string, unknown>;
  const initials = Array.isArray(row.participant_initials) ? (row.participant_initials as string[]) : null;

  if (role === "young_man") {
    return {
      ref: String(row.ref), role, snapshot, legal_hash: String(row.legal_hash || ""),
      subject: `${row.son_first} ${row.son_last}`,
      submitted_at: String(row.created_at || row.consented_at || new Date().toISOString()),
      facts: [
        ["Young man", `${row.son_first} ${row.son_last}, age ${row.son_age}, born ${row.dob}`],
        ["Parent or guardian", `${row.parent_name} (${row.relationship})`],
        ["Contact", `${row.parent_email} · ${row.parent_phone}`],
        ["Emergency contact", `${row.emergency_name} (${row.emergency_relationship}) · ${row.emergency_phone}`],
        ["Fee", `${money(row.amount_cents)} — ${PAY[String(row.payment_method)] || String(row.payment_method)}`],
      ],
      signatures: [
        { label: "Parent or guardian", name: str(row.guardian_signature), signed_at: str(row.consented_at), ip: str(row.signer_ip) },
        row.participant_signed_at
          ? { label: "The young man, for his own agreements", name: str(row.participant_signature), signed_at: str(row.participant_signed_at), ip: str(row.participant_signer_ip) || str(row.signer_ip), initials }
          : { label: "The young man, for his own agreements", name: null, signed_at: null, ip: null, pending: "Not yet signed. A link was emailed to him; his seat is confirmed when he signs." },
      ],
    };
  }

  if (role === "man") {
    const depts = Array.isArray(details.departments) ? (details.departments as string[]).join(", ") : "";
    return {
      ref: String(row.ref), role, snapshot, legal_hash: String(row.legal_hash || ""),
      subject: `${row.son_first} ${row.son_last}`,
      submitted_at: String(row.created_at || row.consented_at || new Date().toISOString()),
      facts: [
        ["Volunteer", `${row.son_first} ${row.son_last}`],
        ["Contact", `${row.parent_email} · ${row.parent_phone}`],
        ["Emergency contact", `${row.emergency_name} · ${row.emergency_phone}`],
        ...(depts ? ([["Departments", depts]] as [string, string][]) : []),
        ["Criminal record check", details.crc_status === "done" ? "On file with the Society, or submitted" : "Undertaken to complete before the weekend"],
        ["Fee", `${money(row.amount_cents)} — ${PAY[String(row.payment_method)] || String(row.payment_method)}`],
      ],
      signatures: [
        { label: "Volunteer", name: str(row.guardian_signature), signed_at: str(row.consented_at), ip: str(row.signer_ip), initials },
      ],
    };
  }

  return null;
}

export async function signedRecordPdfFor(row: Row): Promise<{ filename: string; content: Uint8Array } | null> {
  const rec = buildSignedRecord(row);
  if (!rec) return null;
  try {
    return { filename: `YMAW-${FACTS.year}-signed-record-${rec.ref}.pdf`, content: await signedRecordPdf(rec) };
  } catch (e) {
    // A PDF that won't render must never cost someone their registration.
    console.error("signed record pdf failed", e);
    return null;
  }
}
