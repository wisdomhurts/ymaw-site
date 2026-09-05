import type { Metadata } from "next";
import Link from "next/link";
import { Lines } from "@/components/Reveal";
import OpenHash from "@/components/OpenHash";
import InquiryForm from "@/components/InquiryForm";
import NewsletterForm from "@/components/NewsletterForm";
import { FACTS } from "@/lib/facts";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Is he ready? Is it safe? What does $320 cover? What if we can't afford it? What about phones, food, medication, the weather, and getting there?",
};

const QA: [string, string, string][] = [
  ["Readiness", "Is my son ready for this?", "If he's 12 to 17 and you're asking, probably. The weekend is built for young men who've never done anything like it, and for ones who have. He doesn't need to be outdoorsy, athletic, or confident. He needs to be willing to get on the bus. The men take it from there. If he's anxious, that's normal; most are. Read His Path with him."],
  ["Safety", "Who is responsible for him?", "Fifty volunteer men, every one with a criminal record check through the BC Criminal Records Review Program. The buddy system: no man is ever alone with a young man. A safety manager, first-aid trained men at every Quest station and at the water, an emergency plan, and your emergency contact and his health information on paper before the bus leaves. No drugs, alcohol or tobacco for anyone, including the men."],
  ["Phones", "Really no phones?", "Really. It stays with whoever drops him off. In more than thirty years no one has failed to survive it. What he gets instead is three days of men's full attention and his own. If you need to reach him in an emergency, the men have a phone and a plan; you'll have the number."],
  ["Money", `What does $${FACTS.priceCAD} cover?`, "Everything. The bus from Langley or Burnaby and back, eight meals, tools and gear for camp, and the Quests. The fee covers costs and nothing else. It's non-refundable unless the weekend is cancelled."],
  ["Money", "What if we can't afford it?", "Tell us. Choose assistance at the end of registration and a man from the enrolment team will call. There are sponsored seats, there's financial assistance, and there's work-to-earn, where a young man earns his own seat through community service. Money is never the reason a young man stays home."],
  ["Food", "What about allergies and dietary needs?", "Tell us at registration. The kitchen crew cooks eight meals for fifty over fire and handles vegetarian, vegan, halal, allergies and intolerances as a matter of course, labelled and never made a special case at the table."],
  ["Health", "He takes medication.", "List it at registration: name, purpose, dose. He brings it in a labelled bag. The safety man can hold it and manage timing if you'd prefer. The health number and doctor's details you give us stay with the safety team."],
  ["Weather", "What if it rains?", "It will, at some point. The weekend runs in rain. Pack for cold and wet per the list and he'll be fine. The site has tarped common areas and the shelters the teams build are real shelters."],
  ["Getting there", "Where is it, exactly?", "The Squamish region. The exact site isn't published. The bus leaves Langley (McDonald's, 20394 88 Ave) at 3:00 pm Friday and Burnaby (Christine Sinclair Community Centre, south lot) at 4:00 pm, and returns Sunday afternoon to the same stops. Coming from elsewhere? Email us and we'll sort the ride."],
  ["The circle", "What happens Saturday night?", "The men sit with the young men around the fire and the work shifts from the body to whatever he's been carrying. Nobody is made to speak. It's never filmed or recorded and what's said there stays there. Your son may tell you about it; that's his to decide."],
  ["Faith", "Is it religious?", "No. It's non-denominational. There's no creed. There are five values the men coach by, T.E.A.M.S.: truthful, excellence, accountable, mindful, service. And the men hold themselves to a code. Families of every faith and none send young men."],
  ["Pictures", "Will he be photographed?", "Yes. The men photograph and film the weekend, and a photo and video release is part of registration; it's how the next young man finds this. Everything on this website was taken at a real weekend. The circle and the ceremony are never filmed, and if a particular frame of him ever bothers you, email us and it comes down the same day."],
  ["Signing", "Why does he have to sign something?", "Because four of the agreements are his: the wilderness is demanding, he won't bring what he shouldn't, he'll look after himself and others, and he knows what happens if he doesn't. He signs them on your phone, or from a link we email him. It's the first act of the weekend."],
  ["Men", "I'm a father. Can I come?", "Yes, and many do. You come as a production man like everyone else: the Thursday meetings, the criminal record check, the same $320, the load and the strike. The one difference is a standard written for you: trust the process. For the weekend your son belongs to his team and his shadows, not to you. You're placed away from his team, you're not his shadow, you don't sit with him in the circle, and you don't check on him. Other men give your son the weekend; you give it to somebody else's son. Most fathers say it was harder than they expected and the best thing they did."],
  ["After", "What happens after?", "He comes home tired and, often, different. The Society hosts gatherings for the men through the year. Many families come back the next September; many fathers end up on the team. Ask at the bus stop."],
];

export default function FAQ() {
  return (
    <>
      <section className="bg-paper pt-[calc(var(--nav-h)+4rem)] pb-14 text-ink" data-surface="paper">
        <div className="wrap">
          <p className="mono text-flame">Questions</p>
          <h1 className="t-chapter mt-3"><Lines lines={["Ask anything.", "Here's what parents", "ask most."]} /></h1>
        </div>
      </section>
      <section className="bg-paper pb-20 text-ink" data-surface="paper">
        <OpenHash />
        <div className="wrap grid gap-3">
          {QA.map(([tag, q, a]) => (
            <details key={q} id={q.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")} className="group scroll-mt-24 rounded-2xl border border-ink/10 open:border-ink/25 target:border-flame target:[&>summary]:text-flame">
              {/* On a phone the tag sits above the question; squeezing both onto
                  one line cost the question half its width and wrapped it badly. */}
              <summary className="flex cursor-pointer list-none items-start gap-4 p-5 sm:items-center">
                <span className="mono hidden w-20 flex-none text-flame sm:block">{tag}</span>
                <span className="flex-1">
                  <span className="mono block text-flame sm:hidden">{tag}</span>
                  <span className="display mt-1 block text-[1.5rem] leading-none sm:mt-0">{q}</span>
                </span>
                <span className="mt-1 text-ink/40 transition-transform group-open:rotate-45 sm:mt-0" aria-hidden>+</span>
              </summary>
              <p className="px-5 pb-6 text-ink/80 sm:pl-[6.5rem]">{a}</p>
            </details>
          ))}
        </div>
        <div className="wrap mt-14 grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="t-h2"><Lines lines={["Still a question?", "Ask a man."]} /></h2>
            <p className="mt-4 text-ink/75">Or email <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>. A man from the team writes back, not a bot.</p>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/register" className="btn btn-ink">Register</Link><Link href="/sending-him" className="btn btn-ghost" style={{ borderColor: "rgba(22,17,12,.2)" }}>Sending him</Link></div>
            <div className="mt-10 rounded-2xl border border-ink/10 p-6">
              <p className="mono text-flame">Stay in the circle</p>
              <h3 className="t-h3 mt-2">Join the mailing list.</h3>
              <p className="mt-2 text-sm text-ink/70">The weekend, the monthly gatherings, the stories. A few times a year, never more.</p>
              <div className="mt-4"><NewsletterForm where="faq" /></div>
            </div>
          </div>
          <InquiryForm kinds={["question", "aid", "partner", "media"]} />
        </div>
      </section>
    </>
  );
}
