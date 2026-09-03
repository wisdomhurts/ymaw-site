import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";

export const metadata: Metadata = {
  title: "The Men",
  description: "Who produces the Young Men's Adventure Weekend: volunteer men, the departments, the five values (T.E.A.M.S.), the fourteen standards, the Man Code, and how to join the production team.",
};

export default function TheMen() {
  return (
    <>
      <PageHero
        kicker="The men · the production team"
        lines={["Fifty men.", "Nobody paid.", "Every year since 1990."]}
        lede="Fathers, tradesmen, teachers, men who came through the weekend as young men. They build a camp on Thursday and Friday, run it for three days, strike it on Sunday, and go to work Monday."
        still={STILLS["men-shore"]}
      />

      {/* Founder */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <Reveal className="relative aspect-[2/1] overflow-hidden rounded-2xl">
            <Still s={STILLS["brad-points"]} sizes="(min-width:1024px) 55vw, 100vw" />
            <p className="mono absolute bottom-3 left-3 rounded-full bg-night/70 px-3 py-1 text-bone backdrop-blur">Brad Leslie, founder</p>
          </Reveal>
          <div>
            <p className="mono text-flame">Since {FACTS.since}</p>
            <h2 className="t-h2 mt-3"><Lines lines={["A father started it", "for his son."]} /></h2>
            <div className="mt-5 grid gap-4 text-[1.05rem] text-ink/80">
              <p>{FACTS.founder} founded the Young Men's Adventure Weekend in {FACTS.since}, for his own son and for the next generation. He has been at every one since. His son Dorian has been at more than twenty, and today helps carry it forward.</p>
              <p>Brad's reason hasn't changed: to make a difference in the world by supporting men and young men to be their best, to live lives of integrity and service, and to hold high standards for themselves and their communities.</p>
              <p>The weekend is produced by the {FACTS.society}, a volunteer non-profit with a board, a Production Team Manager for each weekend, and departments led by men who've held the role for years.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="bg-night py-20 text-bone">
        <div className="wrap">
          <p className="mono text-ember">The departments</p>
          <h2 className="t-h2 mt-3 max-w-[16ch]"><Lines lines={["Where a man", "can serve."]} /></h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.departments.map((d, i) => (
              <Reveal key={d.name} delay={i * 40} className="bg-night p-6">
                <h3 className="display text-2xl leading-none">{d.name}</h3>
                <p className="mt-3 text-sm text-bone/70">{d.line}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-[46rem] text-ash">First weekend? You'll most likely be a shadow: alongside a team of young men all weekend, in an observational role. The men call it the best seat in the house, and it's how every one of them started. Do not panic. You will be well supported.</p>
        </div>
      </section>

      {/* 2026 team */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap">
          <p className="mono text-flame">The {FACTS.year} team</p>
          <h2 className="t-h2 mt-3 max-w-[16ch]"><Lines lines={["Men you can", "call by name."]} /></h2>
          <p className="mt-4 max-w-[40rem] text-ink/70">The leadership of this September's weekend, and about forty more men on the departments. Ask any of them anything at the bus stop.</p>
          <ul className="mt-10 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {FACTS.team2026.map((m, i) => (
              <Reveal key={m.name} as="li" delay={i * 30} className="border-t border-ink/15 pt-3">
                <p className="display text-2xl leading-none">{m.name}</p>
                <p className="mono mt-1 text-flame">{m.role}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* T.E.A.M.S. */}
      <section className="bg-night py-20 text-bone">
        <div className="wrap">
          <p className="mono text-ember">The five values · T.E.A.M.S.</p>
          <h2 className="t-h2 mt-3 max-w-[18ch]"><Lines lines={["Five words every man", "coaches by. Out loud."]} /></h2>
          <p className="mt-4 max-w-[44rem] text-ash">Truthful, Excellence, Accountable, Mindful, Service. The men don't lecture them; they ask them. When a young man cuts a corner, blames a teammate, or drifts off, a man asks one question and lets him answer it. When he gets it right, a man says so, by name. By Sunday the young men are asking each other.</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-5">
            {FACTS.teams.map((v, i) => (
              <Reveal key={v.name} delay={i * 50} className="bg-night p-6">
                <p className="display text-[4rem] leading-none text-ember">{v.letter}</p>
                <h3 className="display mt-1 text-2xl leading-none">{v.name}</h3>
                <p className="mt-3 text-sm text-bone/75">{v.def}</p>
                <p className="mt-4 border-t border-white/10 pt-3 font-serif text-[1.05rem] italic text-bone/90">“{v.ask}”</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="mono text-ember">And the word itself</p>
              <h3 className="t-h3 mt-2">Team.</h3>
              <p className="mt-3 text-bone/80">{FACTS.team.unequal}</p>
              <p className="mono mt-4 text-ember">The men ask: <span className="serif normal-case tracking-normal text-[1.15rem] text-bone">“{FACTS.team.ask}”</span></p>
            </div>
            <div>
              <p className="t-quote text-bone/90">{FACTS.team.carbon}</p>
              <p className="t-lede mt-6 text-ember">{FACTS.team.steel}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Man Code */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mono text-flame">The Man Code</p>
            <p className="t-quote mt-6">“{FACTS.manCode.line}”</p>
          </div>
          <div>
            <p className="mono text-flame">Core values of the Man Code</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {FACTS.manCode.virtues.map((v) => <span key={v} className="rounded-full border border-ink/15 px-3 py-1 text-sm">{v}</span>)}
            </div>
            <p className="mt-6 text-sm text-ink/60">Over the weekend, the young men are invited to create their own shared standards to live by. As men, we already hold ourselves to high standards. This is a chance to raise them.</p>
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="bg-night py-20 text-bone">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+2rem)] lg:self-start">
            <p className="mono text-ember">The fourteen standards</p>
            <h2 className="t-h2 mt-3"><Lines lines={["What every man", "signs and keeps."]} /></h2>
            <p className="mt-4 max-w-[26rem] text-ash">Read them before you register. You'll initial the ones that matter most to a parent, and you'll hear all of them at the Thursday meetings.</p>
          </div>
          <ol className="grid gap-3">
            {FACTS.standards.map((s, i) => (
              <Reveal key={s} as="li" delay={Math.min(i * 30, 200)} className="flex gap-4 rounded-xl border border-white/10 p-4 text-[1rem] text-bone/85">
                <span className="mono mt-1 text-ember">{String(i + 1).padStart(2, "0")}</span>{s}
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Straight talk + join */}
      <section className="relative overflow-hidden bg-night py-24 text-bone">
        <div className="absolute inset-0 opacity-30"><Still s={STILLS["men-circle-arms"]} sizes="100vw" className="blur-[1px] brightness-50" /></div>
        <div className="scrim-t absolute inset-x-0 top-0 h-1/2" /><div className="scrim-b absolute inset-x-0 bottom-0 h-1/2" />
        <div className="wrap relative grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mono text-ember">Straight talk for men</p>
            <h2 className="t-chapter mt-3">We need men like you.</h2>
            <div className="mt-5 grid gap-3 max-w-[36rem] text-bone/85">
              <p>You'll be challenged mentally, physically, emotionally and spiritually. The team meets every other Thursday at Central Park in Burnaby, and on the off weeks by Zoom with men from Alberta to Washington State. Training is Friday morning, September 11, in Squamish. Load is Thursday, September 10. Strike offload is Sunday evening in Abbotsford. You'll pay ${FACTS.priceCAD} like everyone else, get a criminal record check, and keep the standards.</p>
              <p>In return: young men are watching, and they learn more from what we do than what we say. Most men who staff once describe it as one of the most meaningful things they've done. Many come back for twenty years.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/register?role=man" className="btn btn-ember btn-lg">Join the production team</Link>
            <a href={`mailto:${FACTS.email}?subject=Production%20team`} className="btn btn-ghost btn-lg">Ask a man first</a>
          </div>
        </div>
      </section>
    </>
  );
}
