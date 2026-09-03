"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { GALLERY, GALLERY_YEARS, type GalleryItem } from "@/lib/gallery";
import { useSite } from "./Providers";

/** Chapter names in the order the weekend runs. */
const CHAPTERS: [string, string][] = [
  ["all", "Everything"],
  ["ordinary", "The ordinary world"],
  ["call", "The call"],
  ["threshold", "The threshold"],
  ["allies", "Allies"],
  ["camp", "Camp"],
  ["trials", "The trials"],
  ["ordeal", "The fire"],
  ["reward", "The reward"],
  ["roadback", "The road back"],
  ["return", "The return"],
  ["men", "The men"],
];

const yearLabel = (y: number) => (y === 0 ? "Archive" : String(y));

export default function Gallery() {
  const { reduced } = useSite();
  const [chapter, setChapter] = useState("all");
  const [kind, setKind] = useState<"all" | "still" | "clip">("all");
  const [year, setYear] = useState<number | "all">("all");
  const [open, setOpen] = useState<number | null>(null);

  const items = useMemo(
    () => GALLERY.filter((i) => (chapter === "all" || i.stage === chapter) && (kind === "all" || i.kind === kind) && (year === "all" || i.year === year)),
    [chapter, kind, year],
  );

  // lightbox keys
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? null : (o + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? null : (o - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [open, items.length]);

  const counts = useMemo(() => ({ stills: GALLERY.filter((i) => i.kind === "still").length, clips: GALLERY.filter((i) => i.kind === "clip").length }), []);

  return (
    <div>
      {/* filters */}
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Chapter">
          {CHAPTERS.map(([k, l]) => (
            <button key={k} type="button" onClick={() => { setChapter(k); setOpen(null); }} aria-pressed={chapter === k}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${chapter === k ? "border-ember bg-ember text-night" : "border-white/15 text-ash hover:border-white/40 hover:text-bone"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <div className="flex gap-2" role="group" aria-label="Kind">
            {([["all", `All`], ["still", `Photos · ${counts.stills}`], ["clip", `Film · ${counts.clips}`]] as const).map(([k, l]) => (
              <button key={k} type="button" onClick={() => { setKind(k); setOpen(null); }} aria-pressed={kind === k} className={`mono transition-colors ${kind === k ? "text-ember" : "text-dust hover:text-bone"}`}>{l}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Year">
            <button type="button" onClick={() => setYear("all")} aria-pressed={year === "all"} className={`mono transition-colors ${year === "all" ? "text-ember" : "text-dust hover:text-bone"}`}>Every year</button>
            {GALLERY_YEARS.map((y) => (
              <button key={y} type="button" onClick={() => { setYear(y); setOpen(null); }} aria-pressed={year === y} className={`mono transition-colors ${year === y ? "text-ember" : "text-dust hover:text-bone"}`}>{yearLabel(y)}</button>
            ))}
          </div>
          <span className="mono ml-auto text-dust" aria-live="polite">{items.length} frames</span>
        </div>
      </div>

      {/* grid */}
      <div className="wrap mt-8">
        {items.length === 0 ? (
          <p className="t-lede py-20 text-center text-ash">Nothing from that year in this chapter yet. The archive grows every September.</p>
        ) : (
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
            {items.map((it, i) => (
              <Tile key={it.id} it={it} onOpen={() => setOpen(i)} reduced={reduced} />
            ))}
          </div>
        )}
      </div>

      {open !== null && items[open] && (
        <Lightbox it={items[open]} n={open + 1} total={items.length} onClose={() => setOpen(null)}
          onPrev={() => setOpen((open - 1 + items.length) % items.length)} onNext={() => setOpen((open + 1) % items.length)} />
      )}
    </div>
  );
}

function Tile({ it, onOpen, reduced }: { it: GalleryItem; onOpen: () => void; reduced: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "10% 0px", threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (inView && !reduced) el.play().catch(() => {}); else el.pause();
  }, [inView, reduced]);
  const ratio = it.w && it.h ? `${it.w} / ${it.h}` : "3 / 2";
  const label = `${it.note}${it.year ? `, ${it.year}` : ""}${it.kind === "clip" ? " (film)" : ""}`;
  return (
    <button type="button" onClick={onOpen} className="group relative block w-full overflow-hidden rounded-xl bg-char text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-ember/60" style={{ aspectRatio: ratio }} aria-label={`Open: ${label}`}>
      {it.kind === "still" ? (
        <img src={it.small || it.src} alt={label} loading="lazy" decoding="async" className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
      ) : (
        <video ref={ref} src={inView ? it.src : undefined} poster={it.poster} muted loop playsInline preload="none" aria-label={label} className="block h-full w-full object-cover" />
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-night/80 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        <span className="mono text-bone">{yearLabel(it.year)}</span>
        {it.kind === "clip" && <span className="mono text-ember">▶ film</span>}
      </span>
      {it.kind === "clip" && <span className="pointer-events-none absolute left-2.5 top-2.5 rounded-full bg-night/70 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-bone backdrop-blur" aria-hidden>film</span>}
    </button>
  );
}

function Lightbox({ it, n, total, onClose, onPrev, onNext }: { it: GalleryItem; n: number; total: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const startX = useRef<number | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => { startX.current = e.touches[0].clientX; }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current; startX.current = null;
    if (dx > 50) onPrev(); else if (dx < -50) onNext();
  }, [onPrev, onNext]);
  const chapter = CHAPTERS.find(([k]) => k === it.stage)?.[1] || it.stage;
  return (
    <div role="dialog" aria-modal="true" aria-label={it.note} className="fixed inset-0 z-[80] flex flex-col bg-night/95 text-bone backdrop-blur-sm" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="mono text-ash">{n} / {total} · {chapter} · {yearLabel(it.year)}</span>
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close">Close ×</button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-2">
        <button type="button" onClick={onPrev} aria-label="Previous" className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-night/60 text-2xl hover:border-ember sm:flex">‹</button>
        {it.kind === "still" ? (
          <img src={it.src} alt={it.note} className="max-h-full max-w-full rounded-lg object-contain" />
        ) : (
          <video key={it.id} src={it.src} poster={it.poster} controls autoPlay muted loop playsInline className="max-h-full max-w-full rounded-lg" aria-label={it.note} />
        )}
        <button type="button" onClick={onNext} aria-label="Next" className="absolute right-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-night/60 text-2xl hover:border-ember sm:flex">›</button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <p className="serif text-lg text-bone/90">{it.note.charAt(0).toUpperCase() + it.note.slice(1)}.</p>
        <div className="flex gap-2 sm:hidden">
          <button type="button" onClick={onPrev} className="btn btn-ghost btn-sm">‹ Prev</button>
          <button type="button" onClick={onNext} className="btn btn-ghost btn-sm">Next ›</button>
        </div>
      </div>
    </div>
  );
}
