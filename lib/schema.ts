// Shared registration schema (client + server), with zod.
import { z } from "zod";
import { FACTS, PICKUPS } from "./facts";

const phone = z.string().trim().min(7, "Add a phone number").max(40);
const email = z.string().trim().email("That email doesn't look right").max(160);
const name = z.string().trim().min(1, "Required").max(120);
const short = z.string().trim().max(200).optional().or(z.literal(""));
const long = z.string().trim().max(2000).optional().or(z.literal(""));

export const Address = z.object({
  street: z.string().trim().min(3, "Street address").max(160),
  city: z.string().trim().min(2, "City").max(80),
  province: z.string().trim().min(2, "Province").max(40),
  postal: z.string().trim().min(3, "Postal code").max(12),
});

export const YoungMan = z.object({
  role: z.literal("young_man"),
  // him
  son_first: name,
  son_last: name,
  son_age: z.coerce.number().int().min(FACTS.agesAccepted.min, `YMAW is for young men ${FACTS.agesAccepted.min}–${FACTS.agesAccepted.max}`).max(FACTS.agesAccepted.max, `YMAW is for young men ${FACTS.agesAccepted.min}–${FACTS.agesAccepted.max}`),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth"),
  attended_before: z.enum(["yes", "no"]),
  times_attended: z.coerce.number().int().min(0).max(10).optional(),
  shirt_size: z.enum(FACTS.shirtSizes, { message: "Pick a shirt size" }),
  // Which stop he boards at, so the men on that bus have a list with his name
  // on it. Validated against the stops actually being run this year.
  pickup: z.string().refine((v) => (PICKUPS as string[]).includes(v), "Choose where he gets on the bus"),
  wilderness_experience: long,
  dietary: long,
  medical_notes: long,
  medications: long,
  health_number: z.string().trim().min(4, "BC Services Card / health number").max(40),
  doctor_name: z.string().trim().min(2, "Doctor's name").max(120),
  doctor_phone: phone,
  // you
  parent_name: name,
  relationship: z.string().trim().min(2, "Relationship").max(60),
  parent_email: email,
  parent_phone: phone,
  address: Address,
  emergency_name: name,
  emergency_relationship: z.string().trim().min(2, "Relationship").max(60),
  emergency_phone: phone,
  emergency_alt_phone: short,
  heard_from: short,
  sponsor_name: short,
  sponsor_phone: short,
  // his agreements
  participant_mode: z.enum(["here", "link"]),
  participant_initials: z.array(z.string().trim().min(1).max(6)).optional(),
  participant_signature: z.string().trim().max(120).optional(),
  participant_email: z.string().trim().email().max(160).optional().or(z.literal("")),
  // He signs the release itself, not only his own four agreements — as he did
  // on every paper form the Society has used.
  participant_consent_waiver: z.boolean().optional(),
  // your consents
  consent_medical: z.literal(true, { message: "Please confirm the medical consent" }),
  consent_waiver: z.literal(true, { message: "Please confirm the release and waiver" }),
  consent_media: z.literal(true, { message: "Please agree to the photo and video release" }),
  // A witness is offered, never required: a parent alone at ten at night can
  // still finish, and the record says plainly that nobody witnessed it.
  witness_mode: z.enum(["none", "here", "link"]).optional(),
  witness_name: z.string().trim().max(120).optional().or(z.literal("")),
  witness_email: z.string().trim().email().max(160).optional().or(z.literal("")),
  witness_signature: z.string().trim().max(120).optional().or(z.literal("")),
  guardian_signature: z.string().trim().min(2, "Type your full name as your signature").max(120),
  // payment
  payment_method: z.enum(["card", "etransfer", "aid"]),
  aid_note: long,
  website: z.string().max(0).optional(), // honeypot
});

export const Man = z.object({
  role: z.literal("man"),
  first: name,
  last: name,
  email,
  phone,
  address: Address,
  dietary: long,
  attended_before: z.enum(["yes", "no"]),
  times_attended: z.coerce.number().int().min(0).max(40).optional(),
  shirt_size: z.enum(FACTS.shirtSizes, { message: "Pick a shirt size" }),
  wilderness_experience: long,
  departments: z.array(z.string().max(40)).max(8).optional(),
  skills: long,
  emergency_name: name,
  emergency_phone: phone,
  vehicle: z.object({
    make: short,
    year: short,
    fourByFour: z.enum(["yes", "no"]).optional(),
    driveToSite: z.enum(["yes", "no"]).optional(),
    passengers: short,
  }),
  initials: z.array(z.string().trim().min(1).max(6)).length(5, "Initial each agreement"),
  crc_status: z.enum(["done", "will"]),
  consent_waiver: z.literal(true, { message: "Please confirm the release and waiver" }),
  // A witness is offered, never required: a parent alone at ten at night can
  // still finish, and the record says plainly that nobody witnessed it.
  witness_mode: z.enum(["none", "here", "link"]).optional(),
  witness_name: z.string().trim().max(120).optional().or(z.literal("")),
  witness_email: z.string().trim().email().max(160).optional().or(z.literal("")),
  witness_signature: z.string().trim().max(120).optional().or(z.literal("")),
  signature: z.string().trim().min(2, "Type your full name as your signature").max(120),
  payment_method: z.enum(["card", "etransfer", "aid"]),
  aid_note: long,
  website: z.string().max(0).optional(),
});

export const Sponsor = z.object({
  role: z.literal("sponsor"),
  name,
  email,
  phone: short,
  seats: z.coerce.number().int().min(1).max(20),
  amount_cents: z.coerce.number().int().min(1000).max(2_000_000),
  for_whom: long,
  message: long,
  payment_method: z.enum(["card", "etransfer"]),
  website: z.string().max(0).optional(),
});

const witnessComplete = (d: { witness_mode?: string; witness_name?: string; witness_email?: string; witness_signature?: string; participant_mode?: string; participant_consent_waiver?: boolean }, ctx: z.RefinementCtx) => {
  if (d.participant_mode === "here" && !d.participant_consent_waiver) {
    ctx.addIssue({ code: "custom", path: ["participant_consent_waiver"], message: "He needs to agree to the release too" });
  }
  if (d.witness_mode === "here") {
    if (!d.witness_name?.trim()) ctx.addIssue({ code: "custom", path: ["witness_name"], message: "Their name" });
    if (!d.witness_signature?.trim()) ctx.addIssue({ code: "custom", path: ["witness_signature"], message: "Ask them to type their name" });
  }
  if (d.witness_mode === "link" && !d.witness_email?.trim()) {
    ctx.addIssue({ code: "custom", path: ["witness_email"], message: "Where do we send it?" });
    if (!d.witness_name?.trim()) ctx.addIssue({ code: "custom", path: ["witness_name"], message: "Their name" });
  }
};

export const Registration = z.discriminatedUnion("role", [
  YoungMan.superRefine(witnessComplete),
  Man.superRefine(witnessComplete),
  Sponsor,
]);
export type YoungManT = z.infer<typeof YoungMan>;
export type ManT = z.infer<typeof Man>;
export type SponsorT = z.infer<typeof Sponsor>;
export type RegistrationT = z.infer<typeof Registration>;
