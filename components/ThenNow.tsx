"use client";

import { useCallback, useId, useRef, useState } from "react";
import type { Still as StillT } from "@/lib/media";
import { Still } from "./Media";

/**
 * Then and now: two real frames of the same moment, years apart, under one
 * wipe. Drag anywhere on the picture, or use the slider with a keyboard.
 * Starts on the old roll; the handle invites you to pull the years across.
 */
export default function ThenNow({ then, now, title }: { then: StillT; now: StillT; title: string }) {
  const [x, setX] = useState(62); // percent of the width showing "then"
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const id = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = box.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    setX(Math.round(p * 10) / 10);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => { if (dragging.current) setFromClientX(e.clientX); };
  const onPointerUp = () => { dragging.current = false; };

  return (
    <figure className="relative">
      <div
        ref={box}
        className="relative aspect-[3/2] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-2xl bg-char"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* now, underneath */}
        <Still s={now} sizes="(min-width:1024px) 60vw, 100vw" />
        {/* then, clipped from the right */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - x}% 0 0)` }} aria-hidden>
          <Still s={then} sizes="(min-width:1024px) 60vw, 100vw" />
        </div>
        {/* the seam */}
        <div className="pointer-events-none absolute inset-y-0 w-px bg-bone/90 shadow-[0_0_0_1px_rgba(0,0,0,.35)]" style={{ left: `${x}%` }} aria-hidden>
          <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-bone/70 bg-night/70 text-bone backdrop-blur">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 1 1 6l5 5M12 1l5 5-5 5" /></svg>
          </span>
        </div>
        {/* year tags */}
        <span className="mono absolute bottom-3 left-3 rounded-full bg-night/70 px-3 py-1 text-bone backdrop-blur" style={{ opacity: x > 12 ? 1 : 0, transition: "opacity .2s" }}>{then.year || "then"}</span>
        <span className="mono absolute bottom-3 right-3 rounded-full bg-night/70 px-3 py-1 text-bone backdrop-blur" style={{ opacity: x < 88 ? 1 : 0, transition: "opacity .2s" }}>{now.year || "now"}</span>
      </div>
      <label htmlFor={id} className="sr-only">{title}: slide between the old frame and the recent one</label>
      <input
        id={id}
        type="range"
        min={0}
        max={100}
        step={1}
        value={x}
        onChange={(e) => setX(Number(e.target.value))}
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-2 focus-visible:left-1/2 focus-visible:w-1/2 focus-visible:-translate-x-1/2"
        aria-valuetext={`${Math.round(x)}% of the old frame`}
      />
      <figcaption className="sr-only">Left, {then.alt}. Right, {now.alt}.</figcaption>
    </figure>
  );
}
