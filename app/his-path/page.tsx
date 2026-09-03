import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal, { Lines } from "@/components/Reveal";
import { Still } from "@/components/Media";
import ShareButton from "@/components/ShareButton";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";

export const metadata: Metadata = {
  title: "His Path",
  description: "For the young man: what actually happens at the Young Men's Adventure Weekend, what's hard, what nobody makes you do, and what you come home with.",
};

const HARD = [
  ["Your phone stays home.", "Three days. Everyone survives this, including you. Around Saturday lunch you stop noticing."],
  ["You hike in with your gear.", "It's real work. It's meant to feel a little risky. It is safe: men who've done it before will guide you."],
  ["You build the shelter you sleep in.", "Tarps, rope, a knot manual, your team. Nobody does it for you. It's a better sleep than you'd think."],
  ["The Quests will ask for something you don't have yet.", "Nerve, strength, wits: nobody brings all three. What you're missing, someone on your team has, and what he's missing, you have. That's the whole idea of a team."],
  ["Saturday night you sit in the circle.", "Men talk. Young men who want to, talk. Nobody makes you. What is said there stays there."],
];

const NOBODY = [
  "Nobody makes you speak in the circle.",
  "Nobody makes you swim, climb, or do anything the safety man hasn't checked.",
  "Nobody hazes anyone. That's not what this is, and the men would end it in a second.",
  "Nobody preaches. It's non-denominational. Five values, no creed.",
  "Nobody films the circle or the ceremony. The photos and film the men take are how the next young man finds this; if one of you ever bothers you, say so and it comes down.",
];

const HOME = [
  ["A shirt your whole team signed.", "You'll keep it longer than you think."],
  ["Something a man gave you.", "Your shadow watched you all weekend. On Sunday he tells you what he saw, and gives you something to remember it by."],
  ["A line you wrote yourself.", "At Future Plans you write down what you're claiming and where you're going. It's yours."],
  ["Knots. Fire. An axe you're allowed to use.", "Skills men taught you because you asked."],
  ["Fifty men who'll know your name.", "In a barbershop in ten years. At the bus stop next September."],
];

export default function HisPath() {
  return (
    <>
      <PageHero
        kicker={`His path · to you, ${FACTS.ages.min} to ${FACTS.ages.max}`}
        lines={["Someone thinks", "you're ready."]}
        lede="They might be wrong. Only one way to find out. Here is exactly what happens, what's hard, what nobody makes you do, and what you come home with."
        still={STILLS["single-file"]}
      />

      {/* What it is */}
      <section className="bg-night py-20 text-bone">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="mono text-ember">Straight</p>
            <h2 className="t-h2 mt-3"><Lines lines={["Not a camp.", "Not a course.", "Not therapy."]} /></h2>
          </div>
          <div className="grid gap-4 text-[1.1rem] leading-relaxed text-bone/85">
            <p>A bus takes you and a bunch of other young men north into the Squamish wilderness on a Friday afternoon. The men are already there. They built the camp that morning. They paid to be here, just like you. Most of them have done this for years; some of them did it as young men.</p>
            <p>For three days you live in a world run by men who take you seriously. You'll work with your hands, compete, fail, eat a lot, sleep outside, and sit around a fire at night. On Sunday you'll be acknowledged in front of your team for what you actually brought, and then you'll walk out between two lines of men and get back on the bus.</p>
            <p>This has happened since {FACTS.since}. {FACTS.completed.charAt(0).toUpperCase() + FACTS.completed.slice(1)} have done it.</p>
          </div>
        </div>
      </section>

      {/* What's hard */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap">
          <p className="mono text-flame">What's hard</p>
          <h2 className="t-h2 mt-3 max-w-[14ch]"><Lines lines={["We'll say the hard", "part first."]} /></h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10 md:grid-cols-2 lg:grid-cols-3">
            {HARD.map(([h, p], i) => (
              <Reveal key={h} delay={i * 50} className="bg-paper p-7">
                <span className="mono text-flame">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="t-h3 mt-2">{h}</h3>
                <p className="mt-3 text-ink/75">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={260} className="relative min-h-[16rem] overflow-hidden bg-ink">
              <Still s={STILLS["shields"]} sizes="(min-width:1024px) 33vw, 100vw" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* What nobody makes you do */}
      <section className="bg-night py-20 text-bone">
        <div className="wrap grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal className="relative aspect-[4/5] overflow-hidden rounded-2xl lg:order-2">
            <Still s={STILLS["stump"]} sizes="(min-width:1024px) 50vw, 100vw" />
          </Reveal>
          <div>
            <p className="mono text-ember">What nobody makes you do</p>
            <h2 className="t-h2 mt-3"><Lines lines={["You're a young man,", "not a hostage."]} /></h2>
            <ul className="mt-8 grid gap-4">
              {NOBODY.map((l) => (
                <li key={l} className="flex gap-4 text-[1.05rem] text-bone/85"><span className="mt-2 h-2 w-2 flex-none rounded-full bg-ember" />{l}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* T.E.A.M.S. — the five questions */}
      <section className="bg-cedar py-20 text-bone">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <p className="mono text-ember">Five questions</p>
            <h2 className="t-h2 mt-3"><Lines lines={["You'll hear these", "all weekend."]} /></h2>
            <p className="mt-4 max-w-[26rem] text-bone/75">The men don't preach. They ask. Five words, one question each, and they let you answer it. By Sunday you'll be asking your team.</p>
            <p className="display mt-8 text-[clamp(3rem,9vw,6rem)] leading-none tracking-wide"><span className="text-ember">T</span>.<span className="text-ember">E</span>.<span className="text-ember">A</span>.<span className="text-ember">M</span>.<span className="text-ember">S</span>.</p>
          </div>
          <ol className="grid gap-3">
            {FACTS.teams.map((v, i) => (
              <Reveal key={v.name} as="li" delay={i * 50} className="grid gap-1 rounded-xl border border-white/10 p-5 sm:grid-cols-[3rem_1fr] sm:gap-4">
                <span className="display text-[2.6rem] leading-none text-ember">{v.letter}</span>
                <div>
                  <p className="display text-2xl leading-none">{v.name}</p>
                  <p className="mt-2 text-sm text-bone/70">{v.line}</p>
                  <p className="mt-2 font-serif text-[1.1rem] italic text-bone">“{v.ask}”</p>
                </div>
              </Reveal>
            ))}
            <li className="rounded-xl border border-ember/40 p-5 text-sm text-bone/80"><span className="display text-xl text-bone">And one more: Team.</span> {FACTS.team.steel}</li>
          </ol>
        </div>
      </section>

      {/* What you come home with */}
      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap">
          <p className="mono text-flame">What you come home with</p>
          <h2 className="t-h2 mt-3 max-w-[16ch]"><Lines lines={["The one who comes home", "isn't the one who left."]} /></h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {HOME.map(([h, p], i) => (
              <Reveal key={h} delay={i * 50} className="rounded-2xl border border-ink/10 p-6">
                <h3 className="display text-2xl leading-none">{h}</h3>
                <p className="mt-3 text-sm text-ink/70">{p}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Your part */}
      <section className="relative overflow-hidden bg-night py-24 text-bone">
        <div className="absolute inset-0 opacity-30"><Still s={STILLS["misty-shore"]} sizes="100vw" className="blur-[1px] brightness-50" /></div>
        <div className="scrim-t absolute inset-x-0 top-0 h-1/2" /><div className="scrim-b absolute inset-x-0 bottom-0 h-1/2" />
        <div className="wrap relative grid gap-10 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mono text-ember">Your part</p>
            <h2 className="t-chapter mt-3">Say yes. Then sign your name.</h2>
            <p className="t-lede mt-4 max-w-[34rem] text-bone/85">Whoever's bringing you fills in the boring parts. Four agreements are yours alone: read them, initial them, sign them. That's how the weekend starts, on a phone, before the bus.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/register?role=young-man" className="btn btn-ember btn-lg">Register</Link>
            <Link href="/what-to-bring" className="btn btn-ghost btn-lg">What to bring</Link>
            <ShareButton text={`Read this. ${FACTS.dates.label}, Squamish. I want to go.`} url="https://ymaw.com/his-path" label="Send this to your dad" />
          </div>
        </div>
      </section>
    </>
  );
}
