// What a signature is evidence OF.
//
// The record used to say `waiver_version: "v2026-3"` and nothing more, which
// means the text a family agreed to lived only in this repository. If the
// wording were edited — even innocently — nothing on the record would show what
// was actually on screen that night. So every registration now carries the
// verbatim text of every document put in front of the signer, plus a SHA-256 of
// it, and the record stands on its own.
import "server-only";
import { createHash } from "node:crypto";
import {
  WAIVER_VERSION, PRIVACY_VERSION,
  YM_AGREEMENTS, MEN_AGREEMENTS, MEDICAL_CONSENT, MEDIA_RELEASE,
  YM_WAIVER, YM_WAIVER_INTRO, MEN_WAIVER, MEN_WAIVER_INTRO, WITNESS_ATTESTATION,
} from "./legal";

export type LegalDoc = {
  id: string;
  title: string;
  /** Everyone who put their name to this document. The release is signed by
   *  the guardian AND the young man, as it was on the paper forms. */
  signed_by: ("guardian" | "participant" | "volunteer" | "witness")[];
  intro?: string;
  body?: string;
  clauses?: readonly string[];
  /** True where the signer initialled each clause one at a time. */
  initialled?: boolean;
};

export type LegalSnapshot = {
  waiver_version: string;
  privacy_version: string;
  captured_at: string;
  documents: LegalDoc[];
};

export function buildSnapshot(role: "young_man" | "man" | "sponsor"): LegalSnapshot {
  const documents: LegalDoc[] =
    role === "young_man"
      ? [
          { id: "ym_agreements", title: "The young man's agreements", signed_by: ["participant"], initialled: true, clauses: YM_AGREEMENTS },
          { id: "medical_consent", title: "Consent to medical treatment", signed_by: ["guardian"], body: MEDICAL_CONSENT },
          { id: "release_waiver", title: "Release and waiver of liability", signed_by: ["guardian", "participant"], intro: YM_WAIVER_INTRO, clauses: YM_WAIVER },
          { id: "media_release", title: "Photo and video release", signed_by: ["guardian"], body: MEDIA_RELEASE },
          { id: "witness", title: "Witness", signed_by: ["witness"], body: WITNESS_ATTESTATION },
        ]
      : role === "man"
        ? [
            { id: "men_agreements", title: "The standards", signed_by: ["volunteer"], initialled: true, clauses: MEN_AGREEMENTS },
            { id: "men_release_waiver", title: "Release and waiver of liability", signed_by: ["volunteer"], intro: MEN_WAIVER_INTRO, clauses: MEN_WAIVER },
            { id: "witness", title: "Witness", signed_by: ["witness"], body: WITNESS_ATTESTATION },
          ]
        : // A sponsor buys a seat. He signs nothing, and the record should not
          // pretend otherwise.
          [];
  return { waiver_version: WAIVER_VERSION, privacy_version: PRIVACY_VERSION, captured_at: new Date().toISOString(), documents };
}

// Stable stringify: key order must not depend on how the object was built, or
// the same text would hash two ways.
function canonical(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(canonical).join(",")}]`;
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(",")}}`;
  }
  return JSON.stringify(v ?? null);
}

/** SHA-256 of the documents, excluding the capture time so identical text hashes identically. */
export function hashSnapshot(s: LegalSnapshot): string {
  return createHash("sha256")
    .update(canonical({ waiver_version: s.waiver_version, privacy_version: s.privacy_version, documents: s.documents }))
    .digest("hex");
}
