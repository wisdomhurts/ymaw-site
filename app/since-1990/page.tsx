import type { Metadata } from "next";
import Link from "next/link";
import Timeline from "@/components/Timeline";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Since 1990",
  description: "The archive of the Young Men's Adventure Weekend: one frame per year, from the founder's first weekend in 1990 to this September.",
};

export default function Since1990() {
  return (
    <>
      <section className="relative overflow-hidden bg-night pb-16 pt-[calc(var(--nav-h)+4rem)] text-bone">
        <div className="wrap">
          <p className="mono text-ember">The archive</p>
          <h1 className="t-chapter mt-3"><Lines lines={["Thirty-six years.", "One frame each."]} /></h1>
          <p className="t-lede mt-5 max-w-[40rem] text-bone/85">Every photograph on this site was taken at a YMAW weekend. Here, one per year, scrubbed through time. The men in the early frames are men now; their faces appear only with their permission. The site grows a ring every September.</p>
        </div>
        <div className="mt-14"><Timeline /></div>
      </section>

      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="mono text-flame">Then and now</p>
            <h2 className="t-h2 mt-3"><Lines lines={["Men who came", "as young men."]} /></h2>
          </div>
          <div className="grid gap-4 text-[1.05rem] text-ink/80">
            <p>{FACTS.founder} started this in {FACTS.since} for his son. That son is on the production team today. So are other men who first arrived on the bus at thirteen, sat in the circle, walked out between the lines, and years later stood in the line themselves.</p>
            <p>The Society counts {FACTS.completed} through the weekend. It has inspired other weekends across North America. Its own count of what matters is simpler: how many come back, as young men, as fathers, as men on the team.</p>
            <p>If you came as a young man and want your year on this page, or want to write one line for the young man walking out this September, email <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>. Your name goes on the site only if you want it there.</p>
          </div>
        </div>
      </section>

      <section className="bg-night py-20 text-bone">
        <div className="wrap grid gap-4 md:grid-cols-3">
          {(["arch-2003", "arch-2006", "arch-2025"] as const).map((id, i) => (
            <Reveal key={id} delay={i * 60} className="relative aspect-[3/2] overflow-hidden rounded-2xl">
              <Still s={STILLS[id]} sizes="(min-width:768px) 33vw, 100vw" />
              <span className="mono absolute bottom-3 left-3 rounded-full bg-night/70 px-3 py-1 text-bone backdrop-blur">{STILLS[id].year}</span>
            </Reveal>
          ))}
        </div>
        <div className="wrap mt-12 flex flex-wrap items-center justify-between gap-4">
          <p className="t-lede max-w-[30rem]">The next ring is {FACTS.dates.label}.</p>
          <Link href="/register" className="btn btn-ember btn-lg">Put him in it</Link>
        </div>
      </section>
    </>
  );
}
