"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/** Who is reading: the young man, or the person sending him. */
export type Voice = "him" | "you";

type Ctx = {
  voice: Voice;
  setVoice: (v: Voice) => void;
  reduced: boolean;
  dusk: boolean;
  lenis: Lenis | null;
};

const SiteContext = createContext<Ctx>({ voice: "him", setVoice: () => {}, reduced: false, dusk: false, lenis: null });
export const useSite = () => useContext(SiteContext);

export default function Providers({ children }: { children: React.ReactNode }) {
  const [voice, setVoiceState] = useState<Voice>("him");
  const [reduced, setReduced] = useState(false);
  const [dusk, setDusk] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    try {
      const v = localStorage.getItem("ymaw:voice");
      if (v === "him" || v === "you") setVoiceState(v);
    } catch {}
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setReduced(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    // Dusk mode: after 7pm or before 6am local time the paper goes to night.
    const h = new Date().getHours();
    setDusk(h >= 19 || h < 6);
    return () => mq.removeEventListener("change", upd);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.voice = voice;
  }, [voice]);

  useEffect(() => {
    if (reduced) return;
    const l = new Lenis({ lerp: 0.11, wheelMultiplier: 1, touchMultiplier: 1.2, smoothWheel: true });
    lenisRef.current = l;
    setLenis(l);
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, [reduced]);

  const value = useMemo<Ctx>(
    () => ({
      voice,
      setVoice: (v) => {
        setVoiceState(v);
        try { localStorage.setItem("ymaw:voice", v); } catch {}
      },
      reduced,
      dusk,
      lenis,
    }),
    [voice, reduced, dusk, lenis],
  );

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

/** Renders one of two lines depending on who is reading. */
export function V({ him, you }: { him: React.ReactNode; you: React.ReactNode }) {
  const { voice } = useSite();
  return <>{voice === "him" ? him : you}</>;
}
