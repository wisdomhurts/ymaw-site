"use client";

import { useEffect, useState } from "react";
import { FACTS } from "@/lib/facts";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

export default function Countdown({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const target = new Date(FACTS.dates.busISO).getTime();
  const end = new Date("2026-09-13T15:00:00-07:00").getTime();
  if (now === null) return <div className="h-16" aria-hidden />;

  if (now > end) {
    return (
      <p className="t-lede">The 2026 weekend is complete. The next one opens for enrolment in January.</p>
    );
  }
  if (now >= target) {
    return (
      <div>
        <p className="mono text-ember">Right now</p>
        <p className="t-lede mt-1">The bus has left. He is at the weekend.</p>
      </div>
    );
  }
  const p = parts(target - now);
  const cell = (n: number, l: string) => (
    <div className="flex flex-col items-center" key={l}>
      <span className={`display tabular-nums ${compact ? "text-4xl" : "text-[clamp(2.6rem,7vw,5.5rem)]"} leading-none`}>{String(n).padStart(2, "0")}</span>
      <span className="mono mt-1 text-dust">{l}</span>
    </div>
  );
  return (
    <div className="flex items-end gap-5 sm:gap-8" role="timer" aria-live="off" aria-label="Time until the bus leaves">
      {cell(p.d, "days")}
      {cell(p.h, "hours")}
      {cell(p.m, "min")}
      {!compact && cell(p.s, "sec")}
    </div>
  );
}
