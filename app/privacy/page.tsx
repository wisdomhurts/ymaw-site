import type { Metadata } from "next";
import Link from "next/link";
import { Lines } from "@/components/Reveal";
import { FACTS } from "@/lib/facts";
import { PRIVACY_VERSION } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What the Young Men's Adventure Weekend Society collects when you register, why, who sees it, where it is kept, how long it is kept, and how to have it corrected or removed.",
};

// The registration form takes a young man's date of birth, his health number,
// his medications and his doctor. BC's Personal Information Protection Act says
// an organization has to tell people what it is collecting and why, and destroy
// it once that purpose is done. This page is that notice, written to be read by
// a parent rather than a lawyer.

function Section({ kicker, title, children }: { kicker: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-ink/10 pt-8">
      <p className="mono text-flame">{kicker}</p>
      <h2 className="t-h3 mt-2">{title}</h2>
      <div className="mt-4 grid gap-4 text-[1.02rem] text-ink/80">{children}</div>
    </section>
  );
}

export default function Privacy() {
  return (
    <>
      <section className="bg-paper pt-[calc(var(--nav-h)+4rem)] pb-10 text-ink" data-surface="paper">
        <div className="wrap-narrow">
          <p className="mono text-flame">Privacy</p>
          <h1 className="t-chapter mt-3"><Lines lines={["What we hold,", "and why."]} /></h1>
          <p className="t-lede mt-6 max-w-[46rem] text-ink/75">
            You are handing a volunteer non-profit your son's date of birth, his health number and his doctor's phone number. Here is exactly what happens to it.
          </p>
        </div>
      </section>

      <section className="bg-paper pb-24 text-ink" data-surface="paper">
        <div className="wrap-narrow grid gap-10">
          <div className="rounded-2xl border border-ink/15 p-6">
            <p className="mono text-flame">The short version</p>
            <ul className="mt-3 grid gap-2 text-[1.02rem] text-ink/80">
              <li>We collect what we need to put a young man on a bus and keep him safe, and nothing else.</li>
              <li>We do not sell it, rent it, or share it with anyone who isn't producing the weekend.</li>
              <li>The medical file is erased after the weekend it was given for.</li>
              <li>You can ask to see it, correct it, or have it removed: <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>.</li>
            </ul>
          </div>

          <Section kicker="Who we are" title="The Society is the one holding it.">
            <p>
              {FACTS.society}, incorporated in British Columbia, No. {FACTS.incorporation}. We are a volunteer non-profit. Nobody here is paid, including the men who handle your registration.
            </p>
            <p>
              Questions about your information, or a request to see or change it, go to the Society's privacy officer at <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>.
            </p>
          </Section>

          <Section kicker="What we collect" title="And what each thing is for.">
            <p><strong>Registering a young man.</strong> His name, age and date of birth, so we know who is on the bus and which team he belongs to. Your name, relationship, email, phone and address, so we can reach you. An emergency contact and their phones. His dietary needs, allergies, medical conditions, medications, BC health number, and his doctor's name and phone — these exist for one reason: so the safety team can act, and hospital staff can be told the truth, if something happens on a mountain two hours from a road.</p>
            <p><strong>Joining the production team.</strong> Your name, contact details, address, emergency contact, dietary needs, vehicle details for the convoy, the departments you'd serve in, and whether your criminal record check is done. The check itself is run by the BC Criminal Records Review Program; the Society is told the result, and does not hold the report.</p>
            <p><strong>Sponsoring a seat.</strong> Your name, email, phone, and who the seat is for.</p>
            <p><strong>Asking a question or joining the mailing list.</strong> Your name and email, and whatever you write to us.</p>
            <p><strong>Signing.</strong> When you type your name as a signature we record the time, the version of the document you were shown, its full text, and the IP address the signature came from. That is what makes the signature worth anything later. The same is recorded when a young man signs his own agreements.</p>
            <p><strong>Visiting the site.</strong> Standard web server logs kept by our host. There is no advertising, no tracking pixel, and no analytics that follows you anywhere else.</p>
          </Section>

          <Section kicker="Who sees it" title="A small number of named men.">
            <p>The enrolment manager and the registration and finance men see registrations. The safety manager and the first-aid men see the medical file, and carry the relevant part of it on paper for the weekend. Team leaders see the names, ages and dietary needs of the young men on their team. Nobody else.</p>
            <p>We do not sell, rent or trade personal information, and we do not give it to anyone for their own purposes.</p>
          </Section>

          <Section kicker="Where it lives" title="Named services, some of them in the United States.">
            <p>The Society runs on a handful of ordinary services rather than its own servers. Each one holds only what it needs:</p>
            <ul className="grid gap-2 pl-5 [&>li]:list-disc">
              <li><strong>Supabase</strong> — the registration database, hosted in <strong>Oregon, United States</strong>. This is where the form and the signed agreements are stored.</li>
              <li><strong>Vercel</strong> — hosts ymaw.com and keeps short-lived server logs.</li>
              <li><strong>Stripe</strong> — takes card payments. Card numbers go to Stripe and are never seen by the Society or stored on this site.</li>
              <li><strong>Resend</strong> — sends the confirmation and the notifications to the Society's inbox.</li>
              <li><strong>Google Workspace</strong> — the Society's email, and the enrolment spreadsheet.</li>
              <li><strong>GoHighLevel</strong> — the mailing list, if you join it. Name and email only.</li>
            </ul>
            <p>
              Because these services are in the United States, information stored with them can be reached by American authorities under American law, including its foreign intelligence legislation. British Columbia's Personal Information Protection Act permits a private organization to store information outside Canada. We are telling you plainly because you are entitled to weigh it. If you would rather not have your son's medical details in a database at all, write to us before you register and we will take them on paper instead.
            </p>
          </Section>

          <Section kicker="How long" title="The medical file goes; the signature stays.">
            <p><strong>Medical information</strong> — health number, medications, conditions, doctor's details — is erased within ninety days of the weekend it was given for. It exists for that weekend and no other.</p>
            <p><strong>Registrations and signed agreements</strong> are kept for ten years. A release signed for a young man has to be produceable for as long as a claim could be made, and for someone under nineteen the clock does not start until he turns nineteen.</p>
            <p><strong>Mailing list</strong> — until you unsubscribe, which is one tap in any email we send.</p>
          </Section>

          <Section kicker="Photographs" title="How the next young man finds this.">
            <p>The men photograph and film the weekend, and a photo and video release is part of registration. The circle and the ceremony are never filmed. If a particular frame of your son ever bothers you, email us and it comes down the same day — you do not have to explain why.</p>
          </Section>

          <Section kicker="Your rights" title="Ask, and we answer.">
            <p>Under the Personal Information Protection Act you can ask what personal information the Society holds about you or your son, ask for a copy, and ask us to correct anything that's wrong. Write to <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>. We answer within thirty days, free.</p>
            <p>You can withdraw consent at any time, though there are things we then can't do — we can't take a young man into the wilderness without medical information and a signed release.</p>
            <p>If we get it wrong and you aren't satisfied with how we've handled it, you can complain to the Office of the Information and Privacy Commissioner for British Columbia, at oipc.bc.ca.</p>
          </Section>

          <Section kicker="If something goes wrong" title="You'll hear it from us.">
            <p>If information is lost or exposed in a way that could reasonably cause you harm, we will tell the people affected and the Commissioner, promptly, and say what we know rather than what sounds best.</p>
          </Section>

          <div className="border-t border-ink/10 pt-8">
            <p className="mono text-dust">Version {PRIVACY_VERSION} · {FACTS.society} · Incorporation No. {FACTS.incorporation}</p>
            <p className="mt-4 text-sm text-ink/60">Questions a parent asks most are answered on the <Link className="link" href="/faq">FAQ</Link>. Anything else: <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>. A man writes back, not a bot.</p>
          </div>
        </div>
      </section>
    </>
  );
}
