"use client";

import { useEffect, useRef, useState } from "react";
import { RINGS } from "@/lib/archive";
import { STILLS } from "@/lib/media";
import { Still } from "./Media";
import { FACTS } from "@/lib/facts";

/**
 * Since 1990: a horizontal timeline you scrub with your thumb. Snap per year,
 * the year counter follows the scroll, the ring line fills as you go.
 */
export default function Timeline() {
  const rail = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const years = RINGS.map((r) => r.year);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const onScroll = () => {
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-ring]"));
      const mid = el.scrollLeft + el.clientWidth / 2;
      let best = 0, bd = Infinity;
      cards.forEach((c, k) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = k; } });
      setI(best);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const go = (k: number) => {
    const el = rail.current; if (!el) return;
    const c = el.querySelectorAll<HTMLElement>("[data-ring]")[k];
    if (c) el.scrollTo({ left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2, behavior: "smooth" });
  };

  const span = years[years.length - 1] - years[0];
  const pct = ((years[i] - years[0]) / span) * 100;

  return (
    <div className="relative">
      <div className="wrap flex items-end justify-between gap-6">
        <div>
          <p className="mono text-ember">Since {FACTS.since}</p>
          <p className="display text-[clamp(4rem,14vw,10rem)] leading-none tabular-nums">{years[i]}</p>
        </div>
        <p className="mb-3 hidden max-w-[22rem] text-right text-sm text-ash sm:block">Scrub with your thumb. One frame per year we have. The men in the early photographs are men now.</p>
      </div>

      {/* ring line */}
      <div className="wrap mt-4">
        <div className="relative h-px bg-white/15">
          <div className="absolute left-0 top-0 h-px bg-ember transition-[width] duration-300" style={{ width: `${pct}%` }} />
          {years.map((y, k) => (
            <button key={y} type="button" onClick={() => go(k)} aria-label={`Go to ${y}`} className="absolute -top-[5px] h-[11px] w-[11px] -translate-x-1/2 rounded-full border border-ember transition-colors" style={{ left: `${((y - years[0]) / span) * 100}%`, background: k <= i ? "#E8652A" : "#0a0d11" }} />
          ))}
        </div>
      </div>

      <div ref={rail} className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-[max(1.25rem,calc((100vw-1280px)/2))] pb-4" data-lenis-prevent tabIndex={0} aria-label="Timeline, one frame per year">
        {RINGS.map((r, k) => {
          const s = r.still ? STILLS[r.still] : null;
          return (
            <article key={r.year} data-ring className={`relative w-[min(78vw,520px)] flex-none snap-center overflow-hidden rounded-2xl border border-white/10 transition-opacity duration-500 ${k === i ? "opacity-100" : "opacity-75"}`}>
              <div className="aspect-[4/3] bg-char">
                {s ? <Still s={s} sizes="(min-width:1024px) 40vw, 80vw" /> : (
                  <div className="flex h-full items-center justify-center p-8 text-center">
                    <p className="t-lede text-bone/85">{r.year === FACTS.year ? "This frame is taken in September." : "No photograph survives from this year. The men do."}</p>
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-4 p-4">
                <span className="display text-2xl">{r.year}</span>
                <span className="text-right text-sm text-ash">{r.line}</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
