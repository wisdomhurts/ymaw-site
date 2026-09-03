"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { STILLS } from "@/lib/media";
import { FACTS } from "@/lib/facts";
import { Still } from "./Media";
import FireMark from "./FireMark";
import { useSite, type Voice } from "./Providers";

export default function Hero() {
  const { setVoice, reduced, lenis, dusk } = useSite();
  const root = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced || !root.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(img.current, { scale: 1.12 }, { scale: 1, duration: 9, ease: "power2.out" });
      gsap.to(img.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.from("[data-hero-line]", { yPercent: 110, duration: 1.3, ease: "expo.out", stagger: 0.09, delay: 0.15 });
      gsap.from("[data-hero-fade]", { opacity: 0, y: 14, duration: 1, ease: "power2.out", stagger: 0.08, delay: 0.75 });
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  const choose = (v: Voice) => {
    setVoice(v);
    const target = document.getElementById("journey");
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
  };

  const bg = STILLS["fire-circle-lake"];

  return (
    <section ref={root} className="relative min-h-[100svh] overflow-hidden bg-night text-bone grain">
      <div ref={img} className="absolute inset-0 will-change-transform">
        <Still s={bg} priority sizes="100vw" className={dusk ? "brightness-[.55] saturate-[.8]" : "brightness-[.7]"} />
      </div>
      <div className="scrim-b absolute inset-x-0 bottom-0 h-[75%]" />
      <div className="scrim-t absolute inset-x-0 top-0 h-[40%]" />

      <div className="wrap relative flex min-h-[100svh] flex-col justify-end pb-10 pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="mb-auto flex items-center gap-3 pt-6" data-hero-fade>
          <FireMark size={30} animate title="" />
          <p className="mono text-ash">{FACTS.region} · {FACTS.dates.label} · ages {FACTS.ages.min}–{FACTS.ages.max}</p>
        </div>

        <h1 className="t-hero text-bone" aria-label="Not a summer camp. A rite of passage.">
          <span className="clip-line"><span className="block" data-hero-line>Not a</span></span>
          <span className="clip-line"><span className="block" data-hero-line>summer camp.</span></span>
          <span className="clip-line"><span className="block text-ember" data-hero-line>A rite of passage.</span></span>
        </h1>

        <p className="t-lede mt-5 max-w-[44rem] text-bone/90 text-shadow" data-hero-fade>
          Three days of fire, water and real work in the Squamish wilderness, for young men aged {FACTS.ages.min} to {FACTS.ages.max},
          with men who have shown up for young men since {FACTS.since}.
        </p>

        {/* Two doors */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 sm:gap-4" data-hero-fade>
          <button
            type="button"
            onClick={() => choose("him")}
            className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-ember/70 hover:bg-white/10"
          >
            <span className="mono text-ember">Door one</span>
            <span className="display mt-1.5 block text-[2.2rem] leading-none sm:text-[2.6rem]">I'm {FACTS.ages.min} to {FACTS.ages.max}.</span>
            <span className="mt-2 block text-bone/75">Walk the weekend the way you'll live it. Then decide.</span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm text-ash transition-colors group-hover:text-bone">
              Start walking <Arrow />
            </span>
          </button>
          <button
            type="button"
            onClick={() => choose("you")}
            className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:border-ember/70 hover:bg-white/10"
          >
            <span className="mono text-ember">Door two</span>
            <span className="display mt-1.5 block text-[2.2rem] leading-none sm:text-[2.6rem]">I'm bringing him.</span>
            <span className="mt-2 block text-bone/75">See exactly what happens, hour by hour, and who's responsible.</span>
            <span className="mt-4 inline-flex items-center gap-2 text-sm text-ash transition-colors group-hover:text-bone">
              Show me <Arrow />
            </span>
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ash" data-hero-fade>
          <Link href="/register" className="btn btn-ember">Register · ${FACTS.priceCAD} CAD</Link>
          <Link href="/his-path" className="link">Read his path</Link>
          <Link href="/bringing-him" className="link">Read about bringing him</Link>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1 text-dust md:flex" aria-hidden>
        <span className="mono">Scroll</span>
        <span className="block h-8 w-px bg-gradient-to-b from-ember to-transparent" />
      </div>
    </section>
  );
}

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
