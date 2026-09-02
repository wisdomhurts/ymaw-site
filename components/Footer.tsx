import Link from "next/link";
import { FACTS, NAV } from "@/lib/facts";
import FireMark from "./FireMark";

export default function Footer() {
  return (
    <footer className="relative bg-night text-bone" data-surface="night">
      <div className="hairline" />
      <div className="wrap grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <FireMark size={26} animate title="" />
            <span className="display text-3xl">YMAW</span>
          </div>
          <p className="mt-4 max-w-sm text-ash">
            {FACTS.name}. A rite of passage for young men aged {FACTS.ages.min}–{FACTS.ages.max}, in the {FACTS.region}, run by volunteer men since {FACTS.since}.
          </p>
          <p className="mono mt-4 text-dust">{FACTS.society}</p>
        </div>
        <div>
          <p className="mono mb-3 text-dust">The trail</p>
          <ul className="grid gap-2 text-ash">
            {NAV.map((n) => (
              <li key={n.href}><Link className="hover:text-bone" href={n.href}>{n.label}</Link></li>
            ))}
            <li><Link className="hover:text-bone" href="/what-to-bring">What to bring</Link></li>
          </ul>
        </div>
        <div>
          <p className="mono mb-3 text-dust">Register</p>
          <ul className="grid gap-2 text-ash">
            <li><Link className="hover:text-bone" href="/register?role=young-man">A young man</Link></li>
            <li><Link className="hover:text-bone" href="/register?role=man">A production man</Link></li>
            <li><Link className="hover:text-bone" href="/register?role=sponsor">Sponsor a seat</Link></li>
            <li><Link className="hover:text-bone" href="/support">Support the weekend</Link></li>
          </ul>
        </div>
        <div>
          <p className="mono mb-3 text-dust">Reach a man</p>
          <ul className="grid gap-2 text-ash">
            <li><a className="hover:text-bone" href={`mailto:${FACTS.email}`}>{FACTS.email}</a></li>
            <li><a className="hover:text-bone" href={FACTS.instagram} rel="noopener" target="_blank">Instagram</a></li>
            <li><a className="hover:text-bone" href={FACTS.facebook} rel="noopener" target="_blank">Facebook</a></li>
          </ul>
          <p className="mt-6 text-sm text-dust">{FACTS.dates.label} · ${FACTS.priceCAD} CAD · Non-denominational · No phones.</p>
        </div>
      </div>
      <div className="hairline" />
      <div className="wrap flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-dust">
        <span>© {FACTS.year} {FACTS.society}</span>
        <span>Every frame on this site was taken at a YMAW weekend.</span>
      </div>
    </footer>
  );
}
