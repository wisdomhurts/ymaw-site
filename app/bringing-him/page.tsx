import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import Countdown from "@/components/Countdown";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Bringing Him",
  description: `For parents and guardians: why the Young Men's Adventure Weekend exists, how it's kept safe, what $${FACTS.priceCAD} covers, how the weekend runs, and what to expect Sunday night.`,
};

const SAFETY = [
  ["Every man has a criminal record check.", "Through the BC Criminal Records Review Program. No CRC, no weekend. No exceptions."],
  ["Never alone with a young man.", "The buddy system is the first standard the men sign. Every man is visible to another man at all times."],
  ["A safety team, first aid, and a plan.", "A designated safety manager, first-aid trained men at the Quest stations and the water, an emergency plan, and your emergency contact on paper before the bus leaves."],
  ["No drugs, alcohol, or tobacco.", "Not at the weekend, not in the 24 hours before it. For the men as much as the young men."],
  ["Confidentiality.", "What your son says in the circle stays there. What he chooses to tell you afterwards is his to decide."],
  ["Fathers on the team step back.", "If you volunteer, your son belongs to his team and his shadows for the weekend, not to you: you're placed on another team, and you don't hover. It's one of the men's fourteen standards, and other men give him the weekend while you give it to someone else's son."],
];

const COVERS = [
  ["The bus", "Langley and Burnaby, there and back."],
  ["Eight meals", "Cooked over fire for fifty by a kitchen crew. Dietary needs handled, labelled, never made a special case at the table."],
  ["Tools and gear for camp", "Tarps, rope, axes, saws, first aid, water. He brings his own sleeping bag and clothes."],
  ["The Quests", "Designed and run by the program team with safety men at every station."],
];

const SUNDAY = [
  "He'll be tired. Properly tired. Feed him and let him sleep.",
  "He may not want to talk about it right away. That's normal and it's not about you.",
  "He may want to talk about it for three hours. Also normal.",
  "Ask what he wrote at Future Plans. He may show you. Don't push.",
  "Watch for the small things in the weeks after: how he speaks to his sister, whether he keeps his word, what he picks up without being asked.",
  "Many families come back. Many fathers end up on the production team. The men will tell you how.",
];

export default function BringingHim() {
  return (
    <>
      <PageHero
        kicker="Bringing him · for parents and guardians"
        lines={["He needs this", "now."]}
        lede="Plain, unhurried, specific. Why the weekend exists, who is responsible for him, what the money covers, how the three days run, and what to expect when he gets off the bus."
        still={STILLS["lake-watch"]}
      />

      {/* Why */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="mono text-flame">Why this exists</p>
            <h2 className="t-h2 mt-3"><Lines lines={["Young men need", "to be initiated", "into something."]} /></h2>
          </div>
          <div className="grid gap-4 text-[1.1rem] leading-relaxed text-ink/80">
            <p>Every culture that lasted had a way of marking the passage from boyhood to manhood, witnessed by men, involving real challenge, ending in a return to the community as someone new. Most of us grew up without one. Many of the men on this team did.</p>
            <p>{FACTS.founder} started the Young Men's Adventure Weekend in {FACTS.since} for his own son and for the next generation. The Society's purpose, in its own words, is to provide the leadership, community and environment for young men to discover themselves and test their limits, to build their confidence, to create a safe space in which to be vulnerable, and to awaken the power in a young man that lets him overcome life's challenges.</p>
            <p>It is non-denominational and it is deliberate about character. Five values run through everything, and the men coach by them all weekend. T.E.A.M.S.: truthful, excellence, accountable, mindful, service. The men hold themselves to a code and to fourteen written standards, and they hold each other to them out loud.</p>
            <p>It is not therapy, not a boot camp, not a church retreat, and not a summer camp. It is a rite of passage, built on the shape of the hero's journey, run by volunteers, for thirty-six years.</p>
          </div>
        </div>
      </section>

      {/* Safety */}
      <section className="bg-night py-20 text-bone">
        <div className="wrap">
          <p className="mono text-ember">Safety and standards</p>
          <h2 className="t-h2 mt-3 max-w-[16ch]"><Lines lines={["Who is responsible", "for him."]} /></h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
            {SAFETY.map(([h, p], i) => (
              <Reveal key={h} delay={i * 50} className="bg-night p-7">
                <h3 className="t-h3">{h}</h3>
                <p className="mt-3 text-bone/70">{p}</p>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-[48rem] text-sm text-ash">The full list of the men's fourteen standards, and the Man Code they live by, is on <Link className="link" href="/the-men">The Men</Link>. Thinking of coming as a father? <Link className="link" href="/faq#i-m-a-father-can-i-come">Here's how that works</Link>. Ask any of them about it at the bus stop; they'll be glad you did.</p>
        </div>
      </section>

      {/* Money */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <p className="mono text-flame">What ${FACTS.priceCAD} covers</p>
            <h2 className="t-h2 mt-3"><Lines lines={["Everything.", "To the meal."]} /></h2>
            <p className="mt-5 max-w-[34rem] text-ink/75">One flat fee, ${FACTS.priceCAD} CAD, by card, Apple Pay, Google Pay, or e-transfer. Non-refundable unless the weekend is cancelled. The Society is a volunteer non-profit; the fee covers costs and nothing else.</p>
            <div className="mt-6 rounded-2xl border border-flame/40 bg-flame/5 p-6">
              <h3 className="t-h3">If money is the reason he'd stay home</h3>
              <p className="mt-2 text-ink/75">Tell us. There is financial assistance, there are sponsored seats, and there is work-to-earn, where a young man earns his own seat through community service. Many young men choose it. It's part of the initiation: taking responsibility for his own journey. Choose "assistance" at the end of registration and a man will call.</p>
            </div>
          </div>
          <Reveal className="grid gap-3 self-start">
            {COVERS.map(([h, p]) => (
              <div key={h} className="flex gap-4 rounded-xl border border-ink/10 p-4">
                <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-flame" />
                <div><p className="display text-xl leading-none">{h}</p><p className="mt-1 text-sm text-ink/70">{p}</p></div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Hour by hour teaser */}
      <section className="relative overflow-hidden bg-night py-20 text-bone">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Still s={STILLS["meadow-circle"]} sizes="(min-width:1024px) 50vw, 100vw" />
          </Reveal>
          <div>
            <p className="mono text-ember">How the weekend runs</p>
            <h2 className="t-h2 mt-3"><Lines lines={["Friday dusk", "to Sunday lunch."]} /></h2>
            <p className="mt-5 max-w-[34rem] text-bone/80">The bus, the hike in, teams and shelters Friday night. Morning circle, breakfast, the Quests all day Saturday, the summer-camp afternoon, dinner, then the circle. Sunday: Future Plans, the acknowledgments, the game, the walk out, the bus. The whole shape of it, in six parts with a real frame from each, is on its own page.</p>
            <Link href="/the-weekend" className="btn btn-bone mt-7">How the weekend runs</Link>
          </div>
        </div>
      </section>

      {/* Sunday night */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="mono text-flame">Sunday night</p>
            <h2 className="t-h2 mt-3"><Lines lines={["When he gets", "off the bus."]} /></h2>
          </div>
          <ol className="grid gap-4">
            {SUNDAY.map((l, i) => (
              <Reveal key={l} as="li" delay={i * 40} className="flex gap-4 text-[1.05rem] text-ink/80"><span className="mono mt-1.5 text-flame">{String(i + 1).padStart(2, "0")}</span>{l}</Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Register */}
      <section className="bg-night py-24 text-bone">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mono text-ember">The bus leaves in</p>
            <div className="mt-3"><Countdown compact /></div>
            <h2 className="t-chapter mt-6">Register him.</h2>
            <p className="t-lede mt-4 max-w-[34rem] text-bone/85">One form, five minutes on a phone. His four agreements are his to sign: hand him the phone, or we email him a link. Your consents and the payment are yours.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/register?role=young-man" className="btn btn-ember btn-lg">Register a young man</Link>
            <Link href="/register?role=sponsor" className="btn btn-ghost btn-lg">Sponsor a seat</Link>
            <Link href="/faq" className="btn btn-ghost btn-lg">Questions</Link>
          </div>
        </div>
      </section>
    </>
  );
}
