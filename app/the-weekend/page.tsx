import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { SCHEDULE } from "@/lib/schedule";

export const metadata: Metadata = {
  title: "The Weekend",
  description: "The Young Men's Adventure Weekend hour by hour: Friday's bus and hike in, Saturday's Quests and circle, Sunday's acknowledgments, the game and the walk out.",
};

export default function TheWeekend() {
  return (
    <>
      <PageHero
        kicker="The weekend · the field log"
        lines={["Hour by hour.", "Friday dusk to", "Sunday afternoon."]}
        lede="From the Society's own arc-of-the-weekend document. The map is never the territory: the men follow the energy of the young men, and this shifts. But it's close."
        still={STILLS["kayaks"]}
      />

      <section className="bg-night py-6 text-bone">
        <div className="wrap flex flex-wrap items-center gap-x-8 gap-y-2 text-sm text-ash">
          <span><span className="text-ember">●</span> Separation</span>
          <span><span className="text-ember">●</span> Trial</span>
          <span><span className="text-ember">●</span> Return</span>
          <span className="ml-auto">{FACTS.dates.label} · {FACTS.region}</span>
        </div>
      </section>

      {SCHEDULE.map((day, di) => (
        <section key={day.day} className={`${di % 2 === 0 ? "bg-night text-bone" : "bg-paper text-ink"} py-16`} data-surface={di % 2 === 0 ? undefined : "paper"}>
          <div className="wrap grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
              <p className={`mono ${di % 2 === 0 ? "text-ember" : "text-flame"}`}>{day.sub}</p>
              <h2 className="t-chapter mt-2">{day.day}</h2>
              <p className={`mt-3 max-w-[24rem] text-sm ${di % 2 === 0 ? "text-ash" : "text-ink/60"}`}>
                {di === 0 && "Leave what's known: home, friends, routine. Board the bus and head into the wilderness."}
                {di === 1 && "Challenges at the Quest stations test mind and body. By evening the focus shifts from effort to depth."}
                {di === 2 && "Connection, acknowledgment, and a gradual return to the world he left, witnessed by his shadows."}
              </p>
            </div>
            <ol className={`relative grid gap-0 border-l ${di % 2 === 0 ? "border-white/15" : "border-ink/15"}`}>
              {day.hours.map((h, i) => (
                <Reveal key={h.t + h.what} as="li" delay={Math.min(i * 30, 240)} className="relative grid gap-3 py-5 pl-8 sm:grid-cols-[7rem_1fr]">
                  <span className={`absolute -left-[5px] top-7 h-[9px] w-[9px] rounded-full ${h.mark ? "bg-ember ring-4 ring-ember/25" : di % 2 === 0 ? "bg-white/40" : "bg-ink/40"}`} />
                  <span className="mono pt-1">{h.t}</span>
                  <div>
                    <p className={`display text-[1.6rem] leading-none ${h.mark ? (di % 2 === 0 ? "text-ember" : "text-flame") : ""}`}>{h.what}</p>
                    {h.note && <p className={`mt-2 max-w-[38rem] text-[0.98rem] ${di % 2 === 0 ? "text-bone/70" : "text-ink/70"}`}>{h.note}</p>}
                    {h.still && STILLS[h.still] && (
                      <div className="mt-4 aspect-[16/9] max-w-[38rem] overflow-hidden rounded-xl"><Still s={STILLS[h.still]} sizes="(min-width:1024px) 40vw, 100vw" /></div>
                    )}
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>
      ))}

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
