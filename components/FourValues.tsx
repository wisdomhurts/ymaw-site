"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FACTS } from "@/lib/facts";
import { useSite } from "./Providers";
import FireMark from "./FireMark";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * The four values, pinned. Scrolling lights each word in turn and brings up
 * the Society's own line for it. Reduced motion: all four, lit, static.
 */
export default function FourValues() {
  const root = useRef<HTMLElement>(null);
  const { reduced } = useSite();
  const [i, setI] = useState(0);
  const n = FACTS.values.length;

  useEffect(() => {
    if (reduced || !root.current) return;
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (s) => setI(Math.min(n - 1, Math.floor(s.progress * n))),
    });
    return () => st.kill();
  }, [reduced, n]);

  if (reduced) {
    return (
      <section className="bg-cedar py-24 text-bone">
        <div className="wrap grid gap-8 md:grid-cols-2">
          {FACTS.values.map((v) => (
            <div key={v.name}><h2 className="t-h2">{v.name}</h2><p className="mt-3 max-w-[30rem] text-bone/80">{v.line}</p></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className="relative bg-cedar text-bone" style={{ height: `${n * 100}svh` }} aria-label="The four values">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mono text-ember">Four values · the men's, and by Sunday, his</p>
            <ul className="mt-4 grid gap-1">
              {FACTS.values.map((v, k) => (
                <li key={v.name} className="display text-[clamp(2.6rem,8.5vw,7.5rem)] leading-[.95] transition-[opacity,transform] duration-700 ease-out" style={{ opacity: k === i ? 1 : 0.16, transform: k === i ? "translateX(0)" : "translateX(-6px)" }}>
                  {v.name}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[10rem]">
            {FACTS.values.map((v, k) => (
              <p key={v.name} className="t-lede absolute inset-x-0 top-0 text-bone/90 transition-opacity duration-700" style={{ opacity: k === i ? 1 : 0 }} aria-hidden={k !== i}>
                {v.line}
              </p>
            ))}
            <div className="absolute -bottom-24 right-0 hidden opacity-70 lg:block" style={{ transform: `scale(${1 + i * 0.12})`, transition: "transform .7s ease-out" }}>
              <FireMark size={40} animate title="" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0">
          <div className="wrap flex gap-2">
            {FACTS.values.map((v, k) => <span key={v.name} className="h-[3px] flex-1 rounded-full transition-colors duration-500" style={{ background: k <= i ? "#E8652A" : "rgba(241,236,225,.15)" }} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
