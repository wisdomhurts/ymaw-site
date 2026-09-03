import Link from "next/link";
import Hero from "@/components/Hero";
import Journey from "@/components/Journey";
import Countdown from "@/components/Countdown";
import Teams from "@/components/Teams";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import FireMark from "@/components/FireMark";
import { V } from "@/components/Providers";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";

export default function Home() {
  return (
    <>
      <Hero />
      <Journey />

      {/* Values marquee */}
      <div className="hairline overflow-hidden border-b border-white/10 bg-night py-4 text-bone">
        <div className="marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center gap-10 pr-10">
              {FACTS.teams.map((v) => (
                <span key={v.name + k} className="display flex items-center gap-10 text-[2rem] uppercase tracking-wide">
                  <span><span className="text-ember">{v.letter}</span>{v.name.slice(1)}</span> <span className="text-ember">✦</span>
                </span>
              ))}
              <span className="display flex items-center gap-10 text-[2rem] uppercase tracking-wide">
                Since {FACTS.since} <span className="text-ember">✦</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <Teams />

      {/* Countdown + stops */}
      <section className="relative bg-night py-24 text-bone" aria-labelledby="bus">
        <div className="wrap grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="mono text-ember">The bus leaves in</p>
            <div className="mt-4"><Countdown /></div>
            <h2 id="bus" className="t-h2 mt-8">
              <Lines lines={["Friday, September 11.", "Two stops. One bus. North."]} />
            </h2>
            <p className="mt-5 max-w-[40rem] text-bone/80">
              <V
                him="Packed lunch. Water bottle. Sleeping bag. Your phone stays with whoever drops you off. The ride is about three hours and you'll want the lunch."
                you="A packed lunch and a filled water bottle for the ride, a sleeping bag, and no phone. The ride is about three hours. Pick-up is Sunday afternoon at the same stop."
              />
            </p>
          </div>
          <Reveal className="grid gap-3">
            {FACTS.stops.map((s) => (
              <div key={s.town} className="card p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="display text-3xl">{s.town}</span>
                  <span className="mono text-ember">{s.depart}</span>
                </div>
                <p className="mt-1 text-bone/80">{s.place}</p>
                <p className="text-sm text-ash">{s.address}</p>
                <p className="mono mt-3 text-dust">Return · {s.return}</p>
              </div>
            ))}
            <p className="text-sm text-ash">
              Coming from Squamish, the Island, or further? Email <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a> and we'll sort the ride.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Manifesto */}
      <section className="relative bg-paper py-24 text-ink" data-surface="paper" aria-labelledby="what">
        <div className="wrap">
          <p className="mono text-flame">What it is</p>
          <h2 id="what" className="t-h2 mt-3 max-w-[16ch]">
            <Lines lines={["A weekend that asks", "something of him."]} />
          </h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-3">
            {[
              ["No phones.", "Everyone survives this. What he gets instead is three days of men's full attention and his own."],
              ["Real tools. Real fire.", "Axes, knots, shelters, water, the Quests. Skills taught by men who use them, with a safety man at every station."],
              ["A circle, not a lecture.", "Saturday night the men sit with the young men. Nobody is made to speak. What is said there stays there."],
              ["Since 1990.", `${FACTS.completed} have completed the weekend. Many of their fathers did too.`],
              ["Non-denominational.", "No creed. Five values the men coach by, T.E.A.M.S.: truthful, excellence, accountable, mindful, service. And the Man Code the men live by."],
              [`$${FACTS.priceCAD}, all in.`, "Bus, food, tools, shirt, the lot. If money is the reason he'd stay home, tell us. Work-to-earn and assistance exist for exactly that."],
            ].map(([h, p], i) => (
              <Reveal key={h} delay={i * 60} className="bg-paper p-7">
                <h3 className="t-h3">{h}</h3>
                <p className="mt-3 text-ink/75">{p}</p>
              </Reveal>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/bringing-him" className="btn btn-ink">For the person bringing him</Link>
            <Link href="/the-weekend" className="btn btn-ghost" style={{ borderColor: "rgba(22,17,12,.2)" }}>Hour by hour</Link>
          </div>
        </div>
      </section>

      {/* The men */}
      <section className="relative overflow-hidden bg-night py-24 text-bone" aria-labelledby="men">
        <div className="wrap grid items-center gap-12 lg:grid-cols-2">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Still s={STILLS["brad-dorian"]} sizes="(min-width:1024px) 50vw, 100vw" />
            <p className="mono absolute bottom-3 left-3 rounded-full bg-night/70 px-3 py-1 text-ash backdrop-blur">The founder and his son</p>
          </Reveal>
          <div>
            <p className="mono text-ember">The men</p>
            <h2 id="men" className="t-h2 mt-3">
              <Lines lines={["Volunteers.", "Every one of them."]} />
            </h2>
            <p className="mt-5 max-w-[38rem] text-bone/80">
              {FACTS.founder} started this in {FACTS.since} for his own son and for the next generation. Thirty-six years on,
              the men who produce the weekend still do it for nothing but the young men. Fathers, tradesmen, teachers, men
              who came through the weekend themselves. Criminal record checks, the buddy system, and a code they hold each other to.
            </p>
            <p className="mt-4 max-w-[38rem] text-bone/80">
              If you're a man reading this: the weekend needs you more than it needs another sentence about it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/the-men" className="btn btn-bone">Meet the men</Link>
              <Link href="/register?role=man" className="btn btn-ghost">Join the production team</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Register */}
      <section className="relative overflow-hidden bg-night py-28 text-bone" aria-labelledby="go">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <Still s={STILLS["arms-up-lake"]} sizes="100vw" className="blur-[2px] brightness-50" />
        </div>
        <div className="scrim-t absolute inset-x-0 top-0 h-1/2" />
        <div className="scrim-b absolute inset-x-0 bottom-0 h-1/2" />
        <div className="wrap relative text-center">
          <div className="mx-auto w-fit"><FireMark size={54} animate title="" /></div>
          <h2 id="go" className="t-chapter mt-6">
            <V him="Say yes." you="He needs this now." />
          </h2>
          <p className="t-lede mx-auto mt-5 max-w-[36rem] text-bone/85">
            <V
              him="Five minutes on a phone. Your part, then the person bringing you does theirs. Then a bus."
              you={`One form, five minutes on a phone, his signature and yours. $${FACTS.priceCAD} CAD by card, Apple Pay, or e-transfer. Assistance if you need it.`}
            />
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/register" className="btn btn-ember btn-lg">Register for {FACTS.dates.short}</Link>
            <Link href="/what-to-bring" className="btn btn-ghost btn-lg">What to bring</Link>
            <Link href="/media" className="btn btn-ghost btn-lg">Photos &amp; film</Link>
          </div>
        </div>
      </section>
    </>
  );
}
