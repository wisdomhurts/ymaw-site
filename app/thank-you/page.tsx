import type { Metadata } from "next";
import Link from "next/link";
import { FACTS, STOPS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { Still } from "@/components/Media";
import FireMark from "@/components/FireMark";

export const metadata: Metadata = { title: "The walk out", robots: { index: false } };

export default async function ThankYou({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const ref = sp.ref || "";
  const paid = sp.paid === "1";
  const path = sp.path || (paid ? "card" : "");
  const role = sp.role || "young_man";
  const first = sp.first;
  const demo = sp.demo === "1";
  const needsSign = sp.sign === "1";

  const title = role === "man" ? "You're on the team." : role === "sponsor" ? "Thank you." : first ? `${first} is on the list.` : "He's on the list.";

  return (
    <div className="bg-night text-bone">
      <section className="relative min-h-[70svh] overflow-hidden">
        <div className="absolute inset-0"><Still s={STILLS["men-line"]} sizes="100vw" className="brightness-[.45]" priority /></div>
        <div className="scrim-b absolute inset-x-0 bottom-0 h-3/4" />
        <div className="wrap relative flex min-h-[70svh] flex-col justify-end pb-12 pt-[calc(var(--nav-h)+3rem)]">
          <FireMark size={40} animate title="" />
          <p className="mono mt-6 text-ember">The walk out{ref ? ` · ${ref}` : ""}</p>
          <h1 className="t-chapter mt-2">{title}</h1>
          <p className="t-lede mt-4 max-w-[40rem] text-bone/85">
            {role === "young_man"
              ? "On Sunday he'll walk out between two lines of men, each one looking him in the eye. Today, from here, every one of those men says: good. We'll be there."
              : role === "man"
                ? "Every other Thursday the production team meets. Load is the Thursday before the weekend. Thank you for showing up for young men."
                : "A seat exists now that didn't before. That's the whole thing."}
          </p>
        </div>
      </section>

      <section className="wrap grid gap-8 py-14 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-5">
          {demo && <div className="card border-sun/40 p-5 text-sm"><span className="mono text-sun">Preview mode</span><p className="mt-1">This site isn't connected to its database yet, so nothing was stored. Once it's live, this page confirms a real registration.</p></div>}

          {path === "card" && (
            <div className="card p-6">
              <p className="mono text-ember">Paid by card</p>
              <p className="mt-2">Your receipt is on its way from Stripe and a confirmation from us. Reference <span className="mono">{ref}</span>.</p>
            </div>
          )}
          {path === "etransfer" && (
            <div className="card p-6">
              <p className="mono text-ember">One thing left: the e-transfer</p>
              <p className="mt-2 text-lg">Send <strong>${role === "sponsor" ? "" : FACTS.priceCAD} CAD</strong> to <strong>{FACTS.email}</strong> with the message <strong className="mono">{ref}</strong>.</p>
              <p className="mt-2 text-sm text-ash">Auto-deposit is on, no security question needed. We mark the seat paid when it lands and email you.</p>
            </div>
          )}
          {path === "aid" && (
            <div className="card p-6">
              <p className="mono text-ember">Communication</p>
              <p className="mt-2">A man from the enrolment team will call or write within a couple of days. Nothing else to do right now.</p>
            </div>
          )}
          {needsSign && (
            <div className="card border-ember/40 p-6">
              <p className="mono text-ember">His part</p>
              <p className="mt-2">We've emailed {first || "him"} a link to read and sign his four agreements. His seat is held; it's confirmed when he signs. Nudge him.</p>
            </div>
          )}

          {role === "young_man" && (
            <div className="card p-6">
              <p className="mono text-ember">The bus</p>
              <ul className="mt-2 grid gap-2">
                {STOPS.map((s) => (
                  <li key={s.town}><strong>{s.town}</strong> · {s.place}, {s.address} · <span className="text-ember">{s.depart}</span> · back {s.return}</li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-ash">Packed lunch and a full water bottle for the ride. No phone. The list of everything else is one tap away.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/what-to-bring" className="btn btn-bone btn-sm">What to bring · printable</Link>
                <Link href="/his-path" className="btn btn-ghost btn-sm">What happens, in his words</Link>
              </div>
            </div>
          )}
          {role === "man" && (
            <div className="card p-6">
              <p className="mono text-ember">Before the weekend</p>
              <p className="mt-2">Criminal record check at <a className="link" href={FACTS.crc.portal} target="_blank" rel="noopener">{FACTS.crc.portal}</a> with access code <span className="mono text-ember">{FACTS.crc.code}</span>. Read the standards and the Man Code on <Link className="link" href="/the-men">The Men</Link>. Bring your own gear; the list on <Link className="link" href="/what-to-bring">What to bring</Link> applies to you too.</p>
            </div>
          )}
        </div>

        <div className="grid content-start gap-5">
          <div className="card p-6">
            <p className="mono text-ember">Reach a man</p>
            <p className="mt-2"><a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a></p>
          </div>
        </div>
      </section>
    </div>
  );
}
