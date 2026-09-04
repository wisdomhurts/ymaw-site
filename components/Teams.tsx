"use client";

import { useEffect, useRef, useState } from "react";
import { FACTS } from "@/lib/facts";
import { useSite } from "./Providers";

const BEAT = 4200; // ms per letter

/**
 * T.E.A.M.S. — one letter lights at a time, each with the value and the
 * question the men actually ask. The sixth beat is the word itself: Team.
 * It advances on its own once it is on screen, and any letter can be tapped.
 * Reduced motion: all five, static.
 */
export default function Teams() {
  const root = useRef<HTMLElement>(null);
  const { reduced, voice } = useSite();
  const [i, setI] = useState(0);
  const [live, setLive] = useState(false);
  const [held, setHeld] = useState(false);
  const values = FACTS.teams;
  const n = values.length + 1; // five letters, then the team

  // only run while the section is on screen
  useEffect(() => {
    if (reduced || !root.current) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { threshold: 0.35 });
    io.observe(root.current);
    return () => io.disconnect();
  }, [reduced]);

  useEffect(() => {
    if (reduced || !live || held) return;
    const t = setInterval(() => setI((k) => (k + 1) % n), BEAT);
    return () => clearInterval(t);
  }, [reduced, live, held, n]);

  const pick = (k: number) => { setI(k); setHeld(true); };

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
    <section ref={root} className="relative bg-cedar py-24 text-bone" aria-label="The five values, T.E.A.M.S.">
      <div className="wrap grid items-center gap-10 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="mono text-ember">{him ? "Five words the men will ask you about" : "Five values the men coach by"}</p>
          {/* the letters */}
          <div className="mt-5 flex items-end gap-[0.06em]" role="tablist" aria-label="T.E.A.M.S.">
            {values.map((v, k) => (
              <button
                key={v.letter}
                type="button"
                role="tab"
                aria-selected={k === i}
                aria-label={v.name}
                onClick={() => pick(k)}
                className="display cursor-pointer bg-transparent p-0 text-[clamp(4.2rem,17vw,13rem)] leading-[.85] transition-[opacity,transform,color] duration-700 ease-out focus:outline-none focus-visible:text-ember"
                style={{
                  opacity: k <= i ? 1 : 0.14,
                  color: k === i && !onTeam ? "var(--color-ember)" : "var(--color-bone)",
                  transform: k === i && !onTeam ? "translateY(-4px)" : "translateY(0)",
                }}
              >
                {v.letter}
              </button>
            ))}
          </div>
          <div className="relative mt-3 h-[clamp(2rem,5vw,3.8rem)]">
            {values.map((v, k) => (
              <p key={v.name} className="display text-[clamp(1.8rem,4.5vw,3.4rem)] leading-none transition-[opacity,transform] duration-500" style={{ position: "absolute", opacity: k === i ? 1 : 0, transform: k === i ? "translateY(0)" : "translateY(10px)" }} aria-hidden={k !== i}>
                {v.name}
              </p>
            ))}
            <button type="button" onClick={() => pick(values.length)} className="display cursor-pointer bg-transparent p-0 text-[clamp(1.8rem,4.5vw,3.4rem)] leading-none transition-[opacity,transform] duration-500" style={{ position: "absolute", opacity: onTeam ? 1 : 0, transform: onTeam ? "translateY(0)" : "translateY(10px)", pointerEvents: onTeam ? "auto" : "none" }} aria-hidden={!onTeam}>
              Team.
            </button>
          </div>
          {/* the beats */}
          <div className="mt-8 flex gap-2" aria-hidden>
            {Array.from({ length: n }).map((_, k) => (
              <button key={k} type="button" tabIndex={-1} onClick={() => pick(k)} className="h-[3px] flex-1 cursor-pointer rounded-full transition-colors duration-500" style={{ background: k <= i ? "#E8652A" : "rgba(241,236,225,.15)" }} />
            ))}
          </div>
        </div>

        <div className="relative min-h-[21rem] sm:min-h-[17rem]">
          {values.map((v, k) => (
            <div key={v.name} className="absolute inset-x-0 top-0 transition-opacity duration-700" style={{ opacity: k === i ? 1 : 0, pointerEvents: k === i ? "auto" : "none" }} aria-hidden={k !== i}>
              <p className="t-lede text-bone/90">{v.def}</p>
              <p className="mt-4 max-w-[34rem] text-bone/70">{v.line}</p>
              <p className="mono mt-6 text-ember">{him ? "A man will ask you: " : "The men ask him: "}<span className="serif normal-case tracking-normal text-[1.25rem] text-bone">“{v.ask}”</span></p>
            </div>
          ))}
          <div className="absolute inset-x-0 top-0 transition-opacity duration-700" style={{ opacity: onTeam ? 1 : 0, pointerEvents: onTeam ? "auto" : "none" }} aria-hidden={!onTeam}>
            <p className="t-lede text-bone/90">{FACTS.team.unequal}</p>
            <p className="mt-4 max-w-[34rem] text-bone/70">{FACTS.team.carbon}</p>
            <p className="t-quote mt-6 text-ember">{FACTS.team.steel}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
