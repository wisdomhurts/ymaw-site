/**
 * YMAW 2026 · registrations → Google Sheets
 *
 * Paste this into Extensions → Apps Script of the "YMAW 2026 · Young Men"
 * spreadsheet, set SECRET, then Deploy → New deployment → Web app,
 * Execute as: Me, Who has access: Anyone. Copy the web app URL into Vercel as
 * SHEETS_WEBHOOK_URL and the same SECRET as SHEETS_WEBHOOK_SECRET, redeploy.
 *
 * The site posts { secret, row }. A new registration carries the full row;
 * a later change (paid, signed, admin note) carries { kind: "update", ref, ... }
 * and this script finds the Ref in whichever sheet it lives in and updates it.
 * Health numbers never leave the site.
 */

const SECRET = "choose-a-secret";

const SHEETS = {
  young_man: "1hh0NLECvHJJBs7Hz55rLPISwtEfwIi_BPGIQ_xLGaLY",
  man:       "18q3GFMmM0B2dZrWGtPcgIDJ_ZG8wnmQ9Cd-Jd1oVHyc",
  sponsor:   "1R6n1fk_nBnaAm1xL58i2x5siXdn2xkxLWec8D2Fcu5c",
};

// Column order per sheet. Each entry is [header, function(row) → value].
const yn = (v) => (v === true || v === "true" ? "Yes" : v === false || v === "false" ? "No" : v || "");
const ts = (v) => (v ? String(v).replace("T", " ").slice(0, 16) : "");
const money = (c) => (c == null || c === "" ? "" : (Number(c) / 100).toFixed(2));
const addr = (r) => [r["details.address.street"], r["details.address.city"], r["details.address.province"], r["details.address.postal"]].filter(Boolean).join(", ");

const COLUMNS = {
  young_man: [
    ["Ref", (r) => r.ref], ["Registered", (r) => ts(r.created_at)], ["Young man", (r) => [r.son_first, r.son_last].filter(Boolean).join(" ")],
    ["Age on Sept 11", (r) => r.son_age], ["Date of birth", (r) => r.dob], ["Parent / guardian", (r) => r.parent_name], ["Relationship", (r) => r.relationship],
    ["Email", (r) => r.parent_email], ["Phone", (r) => r.parent_phone], ["Address", addr],
    ["Emergency contact", (r) => r.emergency_name], ["Emergency relationship", (r) => r.emergency_relationship], ["Emergency phone", (r) => r.emergency_phone], ["Alt phone", (r) => r.emergency_alt_phone],
    ["Dietary", (r) => r.dietary], ["Medical notes", (r) => r.medical_notes], ["Medications", (r) => r.medications], ["Doctor", (r) => r.doctor_name], ["Doctor phone", (r) => r.doctor_phone],
    ["Been before", (r) => yn(r.attended_before)], ["Times", (r) => r.times_attended], ["Wilderness experience", (r) => r.wilderness_experience], ["Heard from", (r) => r.heard_from], ["Sponsor", (r) => r.sponsor_name],
    ["Payment method", (r) => r.payment_method], ["Payment status", (r) => r.payment_status], ["Amount CAD", (r) => money(r.amount_cents)], ["Paid at", (r) => ts(r.paid_at)],
    ["Media release", (r) => r.media_consent], ["Guardian signed", (r) => yn(!!r.guardian_signature)], ["Young man signed", (r) => yn(!!r.participant_signed_at)], ["Notes", (r) => r.notes],
  ],
  man: [
    ["Ref", (r) => r.ref], ["Registered", (r) => ts(r.created_at)], ["Name", (r) => r.parent_name], ["Email", (r) => r.parent_email], ["Phone", (r) => r.parent_phone],
    ["Emergency contact", (r) => r.emergency_name], ["Emergency phone", (r) => r.emergency_phone], ["Dietary", (r) => r.dietary],
    ["Been before", (r) => yn(r.attended_before)], ["Times", (r) => r.times_attended], ["Wilderness experience", (r) => r.wilderness_experience],
    ["Payment method", (r) => r.payment_method], ["Payment status", (r) => r.payment_status], ["Amount CAD", (r) => money(r.amount_cents)], ["Paid at", (r) => ts(r.paid_at)],
    ["Signed", (r) => yn(!!r.participant_signed_at)], ["Notes", (r) => r.notes],
  ],
  sponsor: [
    ["Ref", (r) => r.ref], ["Registered", (r) => ts(r.created_at)], ["Name", (r) => r.parent_name], ["Email", (r) => r.parent_email], ["Phone", (r) => r.parent_phone],
    ["Seats", (r) => r.headcount], ["For whom", (r) => r["details.for_whom"]], ["Message", (r) => r["details.message"]],
    ["Payment method", (r) => r.payment_method], ["Payment status", (r) => r.payment_status], ["Amount CAD", (r) => money(r.amount_cents)], ["Paid at", (r) => ts(r.paid_at)], ["Notes", (r) => r.notes],
  ],
};

// Which incoming keys map to which header when a row is updated later.
const UPDATE_MAP = { payment_status: "Payment status", paid_at: "Paid at", notes: "Notes", participant_signed_at: ["Young man signed", "Signed"] };

function doPost(e) {
  const body = JSON.parse((e.postData && e.postData.contents) || "{}");
  if (body.secret !== SECRET) return out("no");
  const row = body.row || {};
  try {
    if (row.kind === "update") return out(update(row) ? "ok" : "not found");
    return out(append(row) ? "ok" : "no role");
  } catch (err) {
    return out("error: " + err);
  }
}

function sheetFor(role) {
  const id = SHEETS[role];
  if (!id) return null;
  const ss = SpreadsheetApp.openById(id);
  return ss.getSheets()[0];
}

function ensureHeader(sh, cols) {
  const want = cols.map((c) => c[0]);
  if (sh.getLastRow() === 0) { sh.appendRow(want); sh.setFrozenRows(1); return want; }
  const have = sh.getRange(1, 1, 1, Math.max(sh.getLastColumn(), 1)).getValues()[0].filter(String);
  const missing = want.filter((h) => have.indexOf(h) < 0);
  if (missing.length) sh.getRange(1, have.length + 1, 1, missing.length).setValues([missing]);
  return have.concat(missing);
}

function append(row) {
  const role = row.role === "man" ? "man" : row.role === "sponsor" ? "sponsor" : row.role === "young_man" ? "young_man" : null;
  if (!role) return false;
  const sh = sheetFor(role);
  const cols = COLUMNS[role];
  const header = ensureHeader(sh, cols);
  const byName = {};
  cols.forEach((c) => { byName[c[0]] = c[1](row); });
  sh.appendRow(header.map((h) => (byName[h] == null ? "" : byName[h])));
  return true;
}

function update(row) {
  const ref = String(row.ref || "");
  if (!ref) return false;
  for (const role of Object.keys(SHEETS)) {
    const sh = sheetFor(role);
    if (!sh || sh.getLastRow() < 2) continue;
    const header = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    const refCol = header.indexOf("Ref");
    if (refCol < 0) continue;
    const refs = sh.getRange(2, refCol + 1, sh.getLastRow() - 1, 1).getValues().map((r) => String(r[0]));
    const i = refs.indexOf(ref);
    if (i < 0) continue;
    const r = i + 2;
    Object.keys(UPDATE_MAP).forEach((k) => {
      if (row[k] === undefined) return;
      const names = [].concat(UPDATE_MAP[k]);
      names.forEach((name) => {
        const c = header.indexOf(name);
        if (c < 0) return;
        let v = row[k];
        if (k === "paid_at") v = ts(v);
        if (k === "participant_signed_at") v = v ? "Yes" : "No";
        sh.getRange(r, c + 1).setValue(v == null ? "" : v);
      });
    });
    return true;
  }
  return false;
}

function out(text) {
  return ContentService.createTextOutput(text);
}
