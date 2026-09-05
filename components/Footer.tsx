import Link from "next/link";
import { FACTS, NAV, STOPS } from "@/lib/facts";
import FireMark from "./FireMark";

// Every page ends here, so the footer does three jobs: it forks the two
// audiences one last time, it carries the navigation, and it answers the
// question a parent actually asks at the bottom of a page — where does the
// bus leave from. The fire mark is stamped into the dark behind it and the
// ember glow rises from below the fold, so the site ends the way it opens.

const LINK = "inline-block text-ash transition-colors duration-200 hover:text-bone";

// Labels stay single-sourced from NAV; the footer only decides the grouping.
// Nine links in one column left the row lopsided and told the reader nothing;
// split in two it says what the site actually is: his journey, and the Society.
const LABEL: Record<string, string> = { ...Object.fromEntries(NAV.map((n) => [n.href, n.label])), "/what-to-bring": "What to bring" };
const TRAIL = ["/his-path", "/sending-him", "/the-weekend", "/what-to-bring"];
const SOCIETY = ["/since-1990", "/the-men", "/media", "/faq", "/support"];

function Head({ children }: { children: React.ReactNode }) {
  return (
    <p className="mono mb-4 flex items-center gap-2 text-dust">
      <span aria-hidden className="h-px w-5 flex-none bg-ember/60" />
      {children}
    </p>
  );
}

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-night text-bone" data-surface="night">
      {/* The top edge is the last light, not a flat rule. */}
      <div aria-hidden className="h-px w-full bg-[linear-gradient(90deg,transparent,rgba(232,101,42,.5)_18%,rgba(232,101,42,.14)_56%,transparent)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-48 -z-10 mx-auto h-96 w-[min(130%,88rem)] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(232,101,42,.22),rgba(232,101,42,0)_70%)] blur-2xl"
      />
      <FireMark size={230} mono="#e8652a" title="" className="pointer-events-none absolute -right-12 top-4 -z-10 hidden opacity-[0.045] md:block" />

      <div className="wrap py-12 sm:py-16">
        {/* The fork the whole site runs on. */}
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mono text-ember">Two ways in</p>
            <p className="display mt-3 text-[clamp(2.1rem,4.6vw,3.5rem)] leading-[0.9]">
              Send a young man.
              <br />
              Or come as a man.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?role=young-man" className="btn btn-ember">Register him</Link>
            <Link href="/register?role=man" className="btn btn-ghost">Join the team</Link>
          </div>
        </div>

        <div className="hairline mt-12" />

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-[1.4fr_0.9fr_0.9fr_0.9fr_1.05fr] lg:gap-10">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <FireMark size={26} animate title="" />
              <span className="display text-3xl leading-none">YMAW</span>
            </div>
            <p className="mt-4 max-w-sm text-ash">
              {FACTS.name}. A rite of passage for young men aged {FACTS.ages.min}–{FACTS.ages.max}, in the {FACTS.region}, run by volunteer men since {FACTS.since}.
            </p>
          </div>

          <div>
            <Head>His trail</Head>
            <ul className="grid gap-2">
              {TRAIL.map((h) => (
                <li key={h}><Link className={LINK} href={h}>{LABEL[h]}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <Head>The Society</Head>
            <ul className="grid gap-2">
              {SOCIETY.map((h) => (
                <li key={h}><Link className={LINK} href={h}>{LABEL[h]}</Link></li>
              ))}
              <li><Link className={LINK} href="/privacy">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <Head>Register</Head>
            <ul className="grid gap-2">
              <li><Link className={LINK} href="/register?role=young-man">A young man</Link></li>
              <li><Link className={LINK} href="/register?role=man">A production man</Link></li>
              <li><Link className={LINK} href="/register?role=sponsor">Sponsor a seat</Link></li>
            </ul>
          </div>

          <div>
            <Head>Reach a man</Head>
            <ul className="grid gap-2">
              <li><a className={LINK} href={`mailto:${FACTS.email}`}>{FACTS.email}</a></li>
              <li><a className={LINK} href={FACTS.instagram} rel="noopener" target="_blank">Instagram</a></li>
              <li><a className={LINK} href={FACTS.facebook} rel="noopener" target="_blank">Facebook</a></li>
            </ul>
          </div>
        </div>

        <div className="hairline mt-12" />

        {/* What a parent scrolls to the bottom looking for. */}
        <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-[auto_1fr_1fr] lg:items-start lg:gap-12">
          <Head>The bus</Head>
          {STOPS.map((s) => (
            <div key={s.town}>
              <p className="display text-2xl leading-none">{s.town}</p>
              <p className="mt-2 text-sm text-ash">{s.place}, {s.address.replace(/,\s*[^,]+$/, "")}</p>
              <p className="mono mt-2 text-ember/90">{s.depart}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="hairline" />
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-5 text-xs text-dust">
        <span>© {FACTS.year} {FACTS.society} · Incorporation No. {FACTS.incorporation}</span>
        <span className="mono flex flex-wrap items-center gap-3 text-[0.68rem]">
          <span className="text-ember">T.E.A.M.S.</span>
          <span aria-hidden className="h-px w-4 bg-white/20" />
          <span>{FACTS.teams.map((v) => v.name).join(" · ")}</span>
        </span>
      </div>
    </footer>
  );
}
