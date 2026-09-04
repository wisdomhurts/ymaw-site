import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal, { Lines } from "@/components/Reveal";
import InquiryForm from "@/components/InquiryForm";
import NewsletterForm from "@/components/NewsletterForm";
import ShareButton from "@/components/ShareButton";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";

export const metadata: Metadata = {
  title: "Support",
  description: "Send a young man, sponsor a seat, give a weekend on the load and strike crews, partner as a school or youth organisation, or spread the word.",
};

const WAYS = [
  { h: "Sponsor a seat", p: `$${FACTS.priceCAD} sends one young man. Any amount helps. Sponsor one you know, or one you don't.`, href: "/register?role=sponsor", cta: "Sponsor" },
  { h: "Donate", p: "A gift of any size goes to gear, food, the bus, and seats for young men whose families can't cover the fee.", href: FACTS.donateLink, cta: "Give", ext: true },
  { h: "Join the production team", p: "Fifty men make the weekend. Load Thursday, the weekend, strike Sunday. Criminal record check required.", href: "/register?role=man", cta: "Register as a man" },
  { h: "Give a day", p: "Can't do the whole weekend? Truck load-up is Thursday, September 10. Strike offload is Sunday evening, September 13, in Abbotsford. Shopping for supplies happens the week before.", href: "#ask", cta: "Tell us" },
];

const PARTNERS = [
  ["Schools and counsellors", "Refer a young man. Pin the field card in the office. Twenty minutes with the enrolment team to see if a few seats should be earmarked."],
  ["Youth organisations", "Send young men; send your mentors to the production team. Work-to-earn means cost is never the barrier."],
  ["Treatment and recovery", "Not a therapy program, not a lecture: a shared experience that shifts how a young man carries himself. Referrals welcome."],
  ["Faith communities", "Non-denominational and deeply intentional about character. It complements your values rather than competing with them."],
];

export default function Support() {
  return (
    <>
      <PageHero
        kicker="Support · send a young man"
        lines={["Money is never", "the reason he", "stays home."]}
        lede="The Society is volunteer-run. Every dollar goes to the weekend. Every hour goes to a young man. Here are the ways in."
        still={STILLS["griddle"]}
      />

      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-4 md:grid-cols-2">
          {WAYS.map((w, i) => (
            <Reveal key={w.h} delay={i * 50} className="flex flex-col rounded-2xl border border-ink/10 p-7">
              <h2 className="t-h3">{w.h}</h2>
              <p className="mt-3 flex-1 text-ink/75">{w.p}</p>
              {w.ext ? (
                <a href={w.href} target="_blank" rel="noopener" className="btn btn-ink mt-6 w-fit">{w.cta}</a>
              ) : (
                <Link href={w.href} className="btn btn-ink mt-6 w-fit">{w.cta}</Link>
              )}
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-night py-20 text-bone">
        <div className="wrap grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="mono text-ember">Work-to-earn</p>
            <h2 className="t-h2 mt-3"><Lines lines={["He earns", "his own seat."]} /></h2>
            <p className="mt-4 text-bone/80">A young man whose family can't cover the fee can earn his seat instead of being given it. It isn't charity; it's the first part of the initiation. He takes responsibility for his own journey before the bus ever leaves.</p>
            <ol className="mt-6 grid gap-3">
              {[
                ["Register him and choose assistance", "at the end of the form. Nothing to pay. A man from the enrolment team calls within a few days."],
                ["Agree on the work", "on that call: community service hours with an organisation near him, a school, a church, a community group, the Society's own load day. The man and the young man set the hours together."],
                ["He does the hours, he gets the seat", "and the Society covers the $320. He arrives at the bus having already paid his way, and every man there knows it."],
              ].map(([h, p], i) => (
                <li key={h} className="flex gap-4 text-bone/80"><span className="display text-2xl leading-none text-ember">{i + 1}</span><span><b className="text-bone">{h}</b> {p}</span></li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-ash">If his family's situation is simpler than that, a sponsored seat covers him with no hours and no fuss. Both are chosen the same way, at the end of registration.</p>
          </div>
          <div>
            <p className="mono text-ember">Partners</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PARTNERS.map(([h, p]) => (
                <Reveal key={h} className="rounded-xl border border-white/10 p-5">
                  <h3 className="display text-xl leading-none">{h}</h3>
                  <p className="mt-2 text-sm text-bone/70">{p}</p>
                </Reveal>
              ))}
            </div>
            <p className="mt-4 text-sm text-ash">The enrolment team will come to you for twenty minutes with the arc-of-the-weekend manual. Ask below.</p>
          </div>
        </div>
      </section>

      <section id="ask" className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-10 lg:grid-cols-2">
          <div>
            <p className="mono text-flame">Spread the word</p>
            <h2 className="t-h2 mt-3"><Lines lines={["Most young men arrive", "because a man told", "their parents."]} /></h2>
            <p className="mt-4 max-w-[32rem] text-ink/75">Not a brochure. A conversation. One tap writes it.</p>
            <div className="mt-6"><ShareButton text={`This is the weekend I wish I'd had. Young Men's Adventure Weekend, ${FACTS.dates.label}, Squamish. Ages 12–17.`} url="https://ymaw.com" className="!border-ink/20" /></div>
            <p className="mt-8 text-sm text-ink/60">Follow along: <a className="link" href={FACTS.instagram} target="_blank" rel="noopener">Instagram</a> · <a className="link" href={FACTS.facebook} target="_blank" rel="noopener">Facebook</a></p>
            <div className="mt-8 rounded-2xl border border-ink/10 p-6">
              <p className="mono text-flame">Two newsletters</p>
              <h3 className="t-h3 mt-2">Stay in the circle.</h3>
              <p className="mt-2 text-sm text-ink/70"><strong>Rising the Man Within</strong> for families and young men: fireside stories, the monthly gatherings, the weekend. <strong>The Forged Circle</strong> for the men: the board, the roster, the work. Say which, or both.</p>
              <div className="mt-4"><NewsletterForm /></div>
            </div>
          </div>
          <div>
            <p className="mono text-flame">Ask a man</p>
            <h2 className="t-h3 mt-3">Partnerships, a day of work, a question.</h2>
            <div className="mt-5"><InquiryForm kinds={["partner", "volunteer", "sponsor", "question"]} /></div>
          </div>
        </div>
      </section>
    </>
  );
}
