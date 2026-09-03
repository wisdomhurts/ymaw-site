"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FACTS } from "@/lib/facts";
import { useSite } from "./Providers";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * T.E.A.M.S. — pinned. Scrolling lights one letter at a time until the word
 * is spelled, each with the value and the question the men actually ask.
 * The sixth beat is the word itself: Team. Reduced motion: all five, static.
 */
export default function Teams() {
  const root = useRef<HTMLElement>(null);
  const { reduced, voice } = useSite();
  const [i, setI] = useState(0);
  const values = FACTS.teams;
  const n = values.length + 1; // five letters, then the team

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

  const him = voice === "him";
  const onTeam = i === values.length;

  if (reduced) {
    return (
      <section className="bg-cedar py-24 text-bone" aria-label="The five values, T.E.A.M.S.">
        <div className="wrap">
          <p className="mono text-ember">Five values · T.E.A.M.S.</p>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {values.map((v) => (
              <div key={v.name}>
                <h2 className="t-h2"><span className="text-ember">{v.letter}</span>{v.name.slice(1)}</h2>
                <p className="mt-3 max-w-[30rem] text-bone/80">{v.def}</p>
                <p className="mono mt-2 text-ember">“{v.ask}”</p>
              </div>
            ))}
            <div>
              <h2 className="t-h2">Team</h2>
              <p className="mt-3 max-w-[30rem] text-bone/80">{FACTS.team.steel}</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className="relative bg-cedar text-bone" style={{ height: `${n * 100}svh` }} aria-label="The five values, T.E.A.M.S.">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="wrap grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="mono text-ember">{him ? "Five words the men will ask you about" : "Five values the men coach by"}</p>
            {/* the letters */}
            <div className="mt-5 flex items-end gap-[0.06em]" aria-hidden>
              {values.map((v, k) => (
                <span
                  key={v.letter}
                  className="display text-[clamp(4.2rem,17vw,13rem)] leading-[.85] transition-[opacity,transform,color] duration-700 ease-out"
                  style={{
                    opacity: k <= i ? 1 : 0.14,
                    color: k === i && !onTeam ? "var(--color-ember)" : "var(--color-bone)",
                    transform: k === i && !onTeam ? "translateY(-4px)" : "translateY(0)",
                  }}
                >
                  {v.letter}
                </span>
              ))}
            </div>
            <div className="relative mt-3 h-[clamp(2rem,5vw,3.8rem)]">
              {values.map((v, k) => (
                <p key={v.name} className="display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-none transition-[opacity,transform] duration-500" style={{ position: "absolute", opacity: k === i ? 1 : 0, transform: k === i ? "translateY(0)" : "translateY(10px)" }} aria-hidden={k !== i}>
                  {v.name}
                </p>
              ))}
              <p className="display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-none transition-[opacity,transform] duration-500" style={{ position: "absolute", opacity: onTeam ? 1 : 0, transform: onTeam ? "translateY(0)" : "translateY(10px)" }} aria-hidden={!onTeam}>
                Team.
              </p>
            </div>
          </div>

          <div className="relative min-h-[14rem]">
            {values.map((v, k) => (
              <div key={v.name} className="absolute inset-x-0 top-0 transition-opacity duration-700" style={{ opacity: k === i ? 1 : 0 }} aria-hidden={k !== i}>
                <p className="t-lede text-bone/90">{v.def}</p>
                <p className="mt-4 max-w-[34rem] text-bone/70">{v.line}</p>
                <p className="mono mt-6 text-ember">{him ? "A man will ask you: " : "The men ask him: "}<span className="serif normal-case tracking-normal text-[1.25rem] text-bone">“{v.ask}”</span></p>
              </div>
            ))}
            <div className="absolute inset-x-0 top-0 transition-opacity duration-700" style={{ opacity: onTeam ? 1 : 0 }} aria-hidden={!onTeam}>
              <p className="t-lede text-bone/90">{FACTS.team.unequal}</p>
              <p className="mt-4 max-w-[34rem] text-bone/70">{FACTS.team.carbon}</p>
              <p className="t-quote mt-6 text-ember">{FACTS.team.steel}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-0 right-0">
          <div className="wrap flex gap-2">
            {Array.from({ length: n }).map((_, k) => <span key={k} className="h-[3px] flex-1 rounded-full transition-colors duration-500" style={{ background: k <= i ? "#E8652A" : "rgba(241,236,225,.15)" }} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
