import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal, { Lines } from "@/components/Reveal";
import PrintButton from "@/components/PrintButton";
import FireMark from "@/components/FireMark";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { PACKING, LEAVE_HOME, CONFISCATION } from "@/lib/packing";

export const metadata: Metadata = {
  title: "What to Bring",
  description: "The YMAW packing list: clothes for three days of cold and wet, sleeping bag and mat, plate and mug, a packed lunch for the bus. What stays home: phones, knives, tents, lighters.",
};

export default function WhatToBring() {
  return (
    <>
      <div className="no-print">
        <PageHero
          kicker="What to bring · the field card"
          lines={["Pack for cold", "and wet. Leave", "the phone."]}
          lede="Everything fits in one bag you can carry up a trail in the dark. Print this, pin it to the fridge, tick it off together the night before."
          still={STILLS["axe"]}
          short
        >
          <div className="mt-6 flex flex-wrap gap-3">
            <PrintButton />
            <Link href="/register" className="btn btn-ghost">Register</Link>
          </div>
        </PageHero>
      </div>

      {/* Printable card */}
      <section className="bg-paper py-16 text-ink print:py-0" data-surface="paper">
        <div className="wrap">
          <div className="hidden items-center justify-between print:flex">
            <div className="flex items-center gap-3"><FireMark size={20} title="" /><span className="display text-3xl">YMAW</span><span className="mono">Field card · {FACTS.dates.label}</span></div>
            <span className="mono">ymaw.com</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[2fr_1fr] print:grid-cols-[2fr_1fr] print:gap-6">
            <div className="grid gap-10 print:gap-5">
              {PACKING.map((g, gi) => (
                <Reveal key={g.name} delay={gi * 40} className="break-inside-avoid">
                  <div className="flex items-baseline justify-between gap-4 border-b border-ink/15 pb-2">
                    <h2 className="display text-[2rem] leading-none print:text-2xl">{g.name}</h2>
                    <p className="hidden text-sm text-ink/60 sm:block print:hidden">{g.why}</p>
                  </div>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2 print:gap-1">
                    {g.items.map((it) => (
                      <li key={it.item} className="flex gap-3">
                        <span className="mt-[3px] h-[1.05rem] w-[1.05rem] flex-none rounded-[4px] border border-ink/40 print:border-black" aria-hidden />
                        <span>
                          <span className="font-bold">{it.item}</span>
                          {it.note && <span className="block text-sm text-ink/65 print:text-xs">{it.note}</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>

            <div className="grid content-start gap-6">
              <Reveal className="rounded-2xl border-2 border-flame p-6 print:rounded-lg print:p-4">
                <h2 className="display text-[2rem] leading-none text-flame print:text-2xl">Leaves home</h2>
                <ul className="mt-3 grid gap-2">
                  {LEAVE_HOME.map((it) => (
                    <li key={it.item}>
                      <span className="font-bold">{it.item}</span>
                      {it.note && <span className="block text-sm text-ink/65 print:text-xs">{it.note}</span>}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs text-ink/60">{CONFISCATION}</p>
              </Reveal>

              <Reveal className="rounded-2xl border border-ink/15 p-6 print:rounded-lg print:p-4">
                <h2 className="display text-[2rem] leading-none print:text-2xl">The bus</h2>
                <ul className="mt-3 grid gap-3">
                  {FACTS.stops.map((s) => (
                    <li key={s.town}>
                      <p className="font-bold">{s.town} · <span className="text-flame">{s.depart}</span></p>
                      <p className="text-sm text-ink/70">{s.place}, {s.address}</p>
                      <p className="text-xs text-ink/60">Back {s.return}</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-ink/60">Be there fifteen minutes early. Packed lunch and full water bottle in hand. Phone handed to whoever drops you off.</p>
              </Reveal>

              <Reveal className="rounded-2xl border border-ink/15 p-6 print:rounded-lg print:p-4">
                <h2 className="display text-[2rem] leading-none print:text-2xl">The arc</h2>
                <ol className="mt-3 grid gap-1.5 text-sm">
                  <li><span className="mono mr-2 text-flame">Fri</span>Bus. Hike in. Teams. Build camp.</li>
                  <li><span className="mono mr-2 text-flame">Sat</span>The Quests. The afternoon. The circle.</li>
                  <li><span className="mono mr-2 text-flame">Sun</span>Acknowledgment. The game. The walk out.</li>
                </ol>
                <div className="mt-5">
                  <p className="mono">The standard I'm bringing</p>
                  <div className="mt-6 border-b border-ink/40" />
                  <p className="mt-1 text-xs text-ink/50">Write it Friday night. Keep it.</p>
                </div>
              </Reveal>
            </div>
          </div>

          <p className="mt-10 text-sm text-ink/60 print:mt-4 print:text-xs">Questions about gear: <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a>. Don't buy new. Borrow, and bring what you have.</p>
        </div>
      </section>

      <section className="no-print bg-night py-20 text-bone">
        <div className="wrap grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mono text-ember">Everything else</p>
            <h2 className="t-h2 mt-3"><Lines lines={["The Society brings", "the rest."]} /></h2>
            <p className="mt-4 max-w-[36rem] text-bone/80">Tarps, rope, tools, first aid, water, the kitchen, eight meals, the shirt. He brings himself, the bag above, and whatever he's been carrying that a weekend in the woods with fifty men might help him put down.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <PrintButton ghost />
            <Link href="/register" className="btn btn-ember btn-lg">Register</Link>
          </div>
        </div>
      </section>
    </>
  );
}
