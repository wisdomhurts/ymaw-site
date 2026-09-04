import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { ARC } from "@/lib/arc";

export const metadata: Metadata = {
  title: "The Weekend",
  description: "How the Young Men's Adventure Weekend runs, in six parts: the bus north, the hike in and camp, the Quests, the circle, the acknowledgments and the game, the walk out and the bus home.",
};

export default function TheWeekend() {
  return (
    <>
      <PageHero
        kicker="The weekend · how it runs"
        lines={["Six parts.", "Three days."]}
        still={STILLS["single-file"]}
        short
      />

      <section className="bg-night py-6 text-bone">
        <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-ash">
          <span><span className="text-ember">●</span> Friday · Separation</span>
          <span><span className="text-ember">●</span> Saturday · Trial</span>
          <span><span className="text-ember">●</span> Sunday · Return</span>
          <span className="ml-auto">{FACTS.dates.label} · {FACTS.region}</span>
        </div>
      </section>

      {ARC.map((b, i) => {
        const paper = i % 2 === 1;
        const s = STILLS[b.still];
        return (
          <section key={b.name} className={`${paper ? "bg-paper text-ink" : "bg-night text-bone"} py-16 sm:py-20`} data-surface={paper ? "paper" : undefined}>
            <div className={`wrap grid items-center gap-10 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
              <Reveal className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-char">
                {s && <Still s={s} sizes="(min-width:1024px) 50vw, 100vw" />}
              </Reveal>
              <div>
                <p className={`mono ${paper ? "text-flame" : "text-ember"}`}>{String(i + 1).padStart(2, "0")} · {b.when} · {b.name}</p>
                <h2 className="t-h2 mt-3 max-w-[16ch]"><Lines lines={[b.title]} /></h2>
                <div className={`mt-5 grid max-w-[36rem] gap-4 text-[1.05rem] ${paper ? "text-ink/80" : "text-bone/80"}`}>
                  {b.body.map((p) => <p key={p}>{p}</p>)}
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <section className="bg-cedar py-14 text-bone">
        <div className="wrap grid gap-6 sm:grid-cols-3">
          <div>
            <p className="mono text-ember">Friday · out</p>
            <p className="display mt-2 text-2xl leading-none">Langley 3:00 pm</p>
            <p className="mt-1 text-sm text-bone/70">McDonald's, 20394 88 Ave</p>
            <p className="display mt-4 text-2xl leading-none">Burnaby 4:00 pm</p>
            <p className="mt-1 text-sm text-bone/70">Christine Sinclair Community Centre, south lot, 3713 Kensington Ave</p>
          </div>
          <div>
            <p className="mono text-ember">Sunday · back</p>
            <p className="display mt-2 text-2xl leading-none">Burnaby after 1:30 pm</p>
            <p className="display mt-4 text-2xl leading-none">Langley after 2:30 pm</p>
            <p className="mt-1 text-sm text-bone/70">The men text as the bus gets close.</p>
          </div>
          <div>
            <p className="mono text-ember">In his bag</p>
            <p className="mt-2 text-sm text-bone/80">Packed lunch, full water bottle, sleeping bag and mat, clothes for cold and wet. No phone. The whole list fits on one card.</p>
            <Link href="/what-to-bring" className="btn btn-ghost btn-sm mt-4">What to bring</Link>
          </div>
        </div>
      </section>

      <section className="bg-night py-20 text-bone">
        <div className="wrap grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mono text-ember">What isn't on this page</p>
            <h2 className="t-h2 mt-3"><Lines lines={["The circle, the ceremony,", "and what's said there."]} /></h2>
            <p className="mt-4 max-w-[36rem] text-bone/80">On purpose. Confidentiality is a standard every man signs. The young men who came before say it was the part that mattered. Your son may tell you. That's his.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/register" className="btn btn-ember btn-lg">Register</Link>
            <Link href="/what-to-bring" className="btn btn-ghost btn-lg">What to bring</Link>
          </div>
        </div>
      </section>
    </>
  );
}
