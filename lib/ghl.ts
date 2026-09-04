// GoHighLevel (GHL): the Society's CRM and mailing list.
//
// Two ways in, pick whichever Dorian sets up first:
//   1. API  — GHL_API_KEY (a Private Integration token with contacts.write)
//             + GHL_LOCATION_ID. Upserts the contact with tags, no workflow needed.
//   2. Hook — GHL_WEBHOOK_URL: an "Inbound Webhook" trigger URL from a GHL
//             workflow. We POST a flat JSON body; the workflow maps the fields.
// If neither is set the call is a no-op that says so, and the record still
// lands in Supabase (inquiries) and the team email, so nothing is lost.
import "server-only";

export type GhlContact = {
  email: string;
  name?: string;
  phone?: string;
  tags: string[];      // e.g. ["ymaw-mailing-list", "rising-the-man-within"]
  source: string;      // "ymaw.com · homepage mailing list"
  fields?: Record<string, string | number | boolean | null | undefined>;
};

const API = "https://services.leadconnectorhq.com";

function splitName(name?: string) {
  const n = (name || "").trim();
  if (!n || n === "—") return { firstName: undefined, lastName: undefined };
  const i = n.lastIndexOf(" ");
  return i < 0 ? { firstName: n, lastName: undefined } : { firstName: n.slice(0, i), lastName: n.slice(i + 1) };
}

export async function ghlUpsertContact(c: GhlContact): Promise<{ ok: boolean; via?: "api" | "webhook"; id?: string; error?: string }> {
  const key = process.env.GHL_API_KEY;
  const locationId = process.env.GHL_LOCATION_ID;
  const hook = process.env.GHL_WEBHOOK_URL;
  const { firstName, lastName } = splitName(c.name);

  if (key && locationId) {
    const headers = { Authorization: `Bearer ${key}`, Version: "2021-07-28", "Content-Type": "application/json", Accept: "application/json" };
    try {
      // Upsert WITHOUT tags: GHL's upsert replaces the tag list wholesale, and a
      // person who joined the list last month must not lose that tag because
      // they sent a question today. Tags are appended in a second call.
      const r = await fetch(`${API}/contacts/upsert`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          locationId,
          email: c.email,
          firstName,
          lastName,
          name: c.name && c.name !== "—" ? c.name : undefined,
          phone: c.phone || undefined,
          source: c.source,
        }),
      });
      const j = (await r.json().catch(() => ({}))) as { contact?: { id?: string }; message?: string; error?: string };
      if (!r.ok) return { ok: false, via: "api", error: j.message || j.error || `ghl ${r.status}` };
      const id = j.contact?.id;
      if (id && c.tags.length) {
        const t = await fetch(`${API}/contacts/${id}/tags`, { method: "POST", headers, body: JSON.stringify({ tags: c.tags }) });
        if (!t.ok) {
          const tj = (await t.json().catch(() => ({}))) as { message?: string };
          return { ok: false, via: "api", id, error: `tags: ${tj.message || t.status}` };
        }
      }
      return { ok: true, via: "api", id };
    } catch (e) {
      return { ok: false, via: "api", error: String(e) };
    }
  }

  if (hook) {
    try {
      const r = await fetch(hook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: c.email,
          name: c.name && c.name !== "—" ? c.name : "",
          first_name: firstName || "",
          last_name: lastName || "",
          phone: c.phone || "",
          tags: c.tags.join(","),
          source: c.source,
          ...(c.fields || {}),
        }),
      });
      return r.ok ? { ok: true, via: "webhook" } : { ok: false, via: "webhook", error: `ghl webhook ${r.status}` };
    } catch (e) {
      return { ok: false, via: "webhook", error: String(e) };
    }
  }

  return { ok: false, error: "GHL not configured (GHL_API_KEY + GHL_LOCATION_ID, or GHL_WEBHOOK_URL)" };
}

export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
