import type { Metadata } from "next";
import Link from "next/link";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { PAIRS } from "@/lib/archive";

export const metadata: Metadata = {
  title: "Since 1990",
  description: "The archive of the Young Men's Adventure Weekend: the same moments across the years we have frames from, 2003 to this September, and the old rolls in between.",
};

export default function Since1990() {
  return (
    <>
      <section className="relative overflow-hidden bg-night pb-10 pt-[calc(var(--nav-h)+4rem)] text-bone">
        <div className="wrap">
          <p className="mono text-ember">The archive</p>
          <h1 className="t-chapter mt-3"><Lines lines={["Thirty-six Septembers.", "Same weekend."]} /></h1>
          <p className="t-lede mt-5 max-w-[42rem] text-bone/85">Every photograph on this site was taken at a YMAW weekend. The first years were shot on film and most of it is gone. What survives is here, the same moments set beside each other decades apart.</p>
        </div>
      </section>

      {/* Then and now */}
      <section className="bg-night pb-24 text-bone">
        <div className="wrap grid gap-20">
          {PAIRS.map((p) => {
            const then = STILLS[p.then], now = STILLS[p.now];
            if (!then || !now) return null;
            return (
              <Reveal key={p.title}>
                <div className="grid gap-4 lg:grid-cols-[1fr_1.6fr] lg:items-end">
                  <div>
                    <p className="mono text-ember">{then.year || "Then"} <span className="text-bone/40">→</span> {now.year || "now"}</p>
                    <h2 className="t-h2 mt-3">{p.title}</h2>
                  </div>
                  <p className="max-w-[34rem] text-bone/75 lg:justify-self-end lg:text-right">{p.line}</p>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-2xl bg-char">
                    <Still s={then} sizes="(min-width:640px) 50vw, 100vw" />
                    <figcaption className="mono absolute bottom-3 left-3 rounded-full bg-night/70 px-3 py-1 text-bone backdrop-blur">{then.year || "Then"}</figcaption>
                  </figure>
                  <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-2xl bg-char">
                    <Still s={now} sizes="(min-width:640px) 50vw, 100vw" />
                    <figcaption className="mono absolute bottom-3 left-3 rounded-full bg-night/70 px-3 py-1 text-bone backdrop-blur">{now.year || "Now"}</figcaption>
                  </figure>
                </div>
              </Reveal>
            );
          })}
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
            <Link href="/media" className="btn btn-ghost btn-lg">The photographs</Link>
          </div>
        </div>
      </section>
    </>
  );
}
