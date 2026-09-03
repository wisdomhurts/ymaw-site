import type { Metadata } from "next";
import Link from "next/link";
import ThenNow from "@/components/ThenNow";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { PAIRS, OLD_ROLLS, YEARS } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Since 1990",
  description: "The archive of the Young Men's Adventure Weekend: the same moments across the years we have frames from, 2003 to this September, and the old rolls in between.",
};

const HAVE = {
  photos: { bg: "#E8652A", label: "Photographs" },
  film: { bg: "rgba(22,17,12,.5)", label: "Film only" },
  none: { bg: "rgba(22,17,12,.1)", label: "Nothing survives" },
  next: { bg: "transparent", label: "This September" },
} as const;

export default function Since1990() {
  return (
    <>
      <section className="relative overflow-hidden bg-night pb-10 pt-[calc(var(--nav-h)+4rem)] text-bone">
        <div className="wrap">
          <p className="mono text-ember">The archive</p>
          <h1 className="t-chapter mt-3"><Lines lines={["Thirty-six Septembers.", "Same weekend."]} /></h1>
          <p className="t-lede mt-5 max-w-[42rem] text-bone/85">Every photograph on this site was taken at a YMAW weekend. The first years were shot on film and most of it is gone. What survives is here, the same moments set beside each other decades apart. Pull the seam across.</p>
        </div>
      </section>

      {/* Then and now */}
      <section className="bg-night pb-24 text-bone">
        <div className="wrap grid gap-16">
          {PAIRS.map((p, i) => {
            const then = STILLS[p.then], now = STILLS[p.now];
            if (!then || !now) return null;
            return (
              <Reveal key={p.title} className={`grid items-end gap-6 lg:grid-cols-[1fr_1.6fr] ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="lg:pb-4">
                  <p className="mono text-ember">{then.year || "Then"} <span className="text-bone/40">→</span> {now.year || "now"}</p>
                  <h2 className="t-h2 mt-3">{p.title}</h2>
                  <p className="mt-4 max-w-[26rem] text-bone/75">{p.line}</p>
                </div>
                <ThenNow then={then} now={now} title={p.title} />
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* What survives */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-end">
            <div>
              <p className="mono text-flame">What survives</p>
              <h2 className="t-h2 mt-3"><Lines lines={["Thirty-seven years.", "Most of them unphotographed."]} /></h2>
            </div>
            <p className="max-w-[36rem] text-ink/75">Nothing survives from the first thirteen years, and some rolls are undated. If you came as a young man and have a photograph from your year, even one, email <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a> and we'll scan it and light the year up.</p>
          </div>
          <ol className="mt-10 grid grid-cols-[repeat(37,minmax(0,1fr))] gap-[3px]" aria-label="Every year since 1990 and whether photographs survive">
            {YEARS.map((y) => (
              <li key={y.year} className="group relative" title={`${y.year}: ${HAVE[y.have].label}`}>
                <div className="h-14 rounded-sm transition-transform group-hover:-translate-y-1 sm:h-20" style={{ background: HAVE[y.have].bg, outline: y.have === "next" ? "1px dashed rgba(22,17,12,.5)" : "none" }} />
                <span className={`mono mt-2 block text-center text-[9px] text-ink/60 sm:text-[10px] ${y.year % 10 === 0 ? "" : y.have !== "none" ? "invisible sm:visible" : "invisible"}`}>{String(y.year).slice(2)}</span>
              </li>
            ))}
          </ol>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink/70">
            {(Object.keys(HAVE) as (keyof typeof HAVE)[]).map((k) => (
              <span key={k} className="flex items-center gap-2"><span className="inline-block h-3 w-3 rounded-sm" style={{ background: HAVE[k].bg, outline: k === "next" ? "1px dashed rgba(22,17,12,.5)" : "none" }} />{HAVE[k].label}</span>
            ))}
          </div>
        </div>
      </section>

      {/* The old rolls */}
      <section className="bg-night py-20 text-bone">
        <div className="wrap">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="mono text-ember">The old rolls</p>
              <h2 className="t-h2 mt-3"><Lines lines={["2003, 2006, 2007.", "Before the phones."]} /></h2>
            </div>
            <p className="max-w-[30rem] text-sm text-ash">Scanned from the Society's own prints and the founder's camera. The young men in these frames are in their thirties now; some of them are on the production team.</p>
          </div>
          <div className="mt-10 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
            {OLD_ROLLS.map((id, i) => {
              const s = STILLS[id]; if (!s) return null;
              return (
                <Reveal key={id} delay={(i % 3) * 60} className="relative break-inside-avoid overflow-hidden rounded-xl">
                  <Still s={s} sizes="(min-width:768px) 33vw, 50vw" className="!h-auto" />
                  <span className="mono absolute bottom-2 left-2 rounded-full bg-night/70 px-2.5 py-0.5 text-[11px] text-bone backdrop-blur">{s.year}</span>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Then and now, in people */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="mono text-flame">Then and now</p>
            <h2 className="t-h2 mt-3"><Lines lines={["Men who came", "as young men."]} /></h2>
          </div>
          <div className="grid gap-4 text-[1.05rem] text-ink/80">
            <p>{FACTS.founder} started this in {FACTS.since} for his son. That son is on the production team today. So are other men who first arrived on the bus at thirteen, sat in the circle, walked out between the lines, and years later stood in the line themselves.</p>
            <p>The Society counts {FACTS.completed} through the weekend. It has inspired other weekends across North America. Its own count of what matters is simpler: how many come back, as young men, as fathers, as men on the team.</p>
            <p>If you came as a young man and want to write one line for the young man walking out this September, email <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>. Your name goes on the site only if you want it there.</p>
          </div>
        </div>
      </section>

      <section className="bg-night py-20 text-bone">
        <div className="wrap flex flex-wrap items-center justify-between gap-4">
          <p className="t-lede max-w-[30rem]">The next frame is {FACTS.dates.label}.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="btn btn-ember btn-lg">Put him in it</Link>
            <Link href="/media" className="btn btn-ghost btn-lg">All the photos and film</Link>
          </div>
        </div>
      </section>
    </>
  );
}
