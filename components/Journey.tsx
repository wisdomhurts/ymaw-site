"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { STATIONS } from "@/lib/journey";
import { STILLS, CLIPS } from "@/lib/media";
import { Still, Clip } from "./Media";
import { useSite } from "./Providers";
import TrailRail from "./TrailRail";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * The journey: a pinned stage of real frames with the copy scrolling over
 * it. Each station's media fades in as its copy arrives; the active frame
 * eases in scale with scroll; a hand-drawn trail rail tracks progress.
 */
export default function Journey() {
  const { voice, reduced } = useSite();
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const articles = Array.from(el.querySelectorAll<HTMLElement>("[data-station]"));
    const ctx = gsap.context(() => {
      articles.forEach((a, i) => {
        ScrollTrigger.create({
          trigger: a,
          start: "top 60%",
          end: "bottom 60%",
          onEnter: () => setActive(i),
          onEnterBack: () => setActive(i),
        });
      });
      ScrollTrigger.create({
        trigger: el,
        start: "top 80%",
        end: "bottom 20%",
        onUpdate: (st) => setProgress(st.progress),
        onToggle: (st) => setVisible(st.isActive),
      });
      if (!reduced) {
        // slow scale on the whole stage: 1.06 -> 1 across the journey
        gsap.fromTo(
          stageRef.current!.querySelectorAll("[data-layer]"),
          { scale: 1.08 },
          { scale: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 } },
        );
      }
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={root} id="journey" className="relative bg-night text-bone" aria-label="The journey through the weekend">
      {/* Pinned stage */}
      <div ref={stageRef} className="sticky top-0 h-[100svh] overflow-hidden grain">
        {STATIONS.map((s, i) => {
          const isOn = i === active;
          return (
            <div
              key={s.id}
              data-layer
              className="absolute inset-0 transition-opacity duration-[1100ms] ease-out will-change-[opacity,transform]"
              style={{ opacity: isOn ? 1 : 0, zIndex: isOn ? 2 : 1 }}
              aria-hidden={!isOn}
            >
              {s.media.kind === "clip" && CLIPS[s.media.id] ? (
                Math.abs(i - active) <= 1 ? (
                  <Clip c={CLIPS[s.media.id]} />
                ) : (
                  <img src={CLIPS[s.media.id].poster} alt="" className="block h-full w-full object-cover" loading="lazy" />
                )
              ) : (
                <Still s={STILLS[s.media.id]} sizes="100vw" priority={i === 0} />
              )}
            </div>
          );
        })}
        <div className="scrim-b absolute inset-x-0 bottom-0 z-[3] h-[70%]" />
        <div className="scrim-t absolute inset-x-0 top-0 z-[3] h-[35%]" />
        {/* stage label */}
        <div className="absolute left-0 right-0 top-[calc(var(--nav-h)+1rem)] z-[4]">
          <div className="wrap flex items-center justify-between">
            <span className="mono text-ash">
              <span className="text-ember">{STATIONS[active].n}</span>
              <span className="mx-2 text-dust">/</span>
              {STATIONS[active].stage}
            </span>
            <span className="mono text-ash">{STATIONS[active].when}</span>
          </div>
        </div>
      </div>

      {/* Scrolling copy */}
      <div className="relative z-[5] -mt-[100svh]">
        {STATIONS.map((s, i) => (
          <article
            key={s.id}
            data-station={s.id}
            className="flex min-h-[100svh] items-end"
            style={{ paddingBottom: i === STATIONS.length - 1 ? "16vh" : "10vh" }}
          >
            <div className="wrap">
              <div className="max-w-[46rem]">
                <p className="mono mb-3 text-ember">{s.n} · {s.stage}</p>
                <h2 className="t-chapter text-bone text-shadow">{s.title}</h2>
                <div className="text-shadow mt-5 grid gap-3 text-[1.08rem] leading-[1.6] text-bone/90 sm:text-[1.15rem]">
                  {(voice === "him" ? s.him : s.you).map((p, k) => (
                    <p key={k} className="max-w-[40rem]">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      <TrailRail progress={progress} active={active} visible={visible} />
    </section>
  );
}
