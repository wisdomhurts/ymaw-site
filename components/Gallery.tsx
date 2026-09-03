"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { GALLERY, type GalleryItem } from "@/lib/gallery";
import { BEST } from "@/lib/best";

const yearLabel = (y: number) => (y === 0 ? "Archive" : String(y));

/** The thirty photographs, in a plain grid, with a lightbox. No filters. */
export default function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const items = useMemo(() => {
    const byId = new Map(GALLERY.map((i) => [i.id, i]));
    return BEST.map((id) => byId.get(id)).filter((i): i is GalleryItem => !!i && i.kind === "still");
  }, []);

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

  return (
    <div>
      <div className="wrap">
        <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
          {items.map((it, i) => {
            const ratio = it.w && it.h ? `${it.w} / ${it.h}` : "3 / 2";
            const label = `${it.note}${it.year ? `, ${it.year}` : ""}`;
            return (
              <button key={it.id} type="button" onClick={() => setOpen(i)} className="group relative block w-full overflow-hidden rounded-xl bg-char text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-ember/60" style={{ aspectRatio: ratio }} aria-label={`Open: ${label}`}>
                <img src={it.small || it.src} alt={label} loading={i < 6 ? "eager" : "lazy"} decoding="async" className="block h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-night/80 to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="mono text-bone">{yearLabel(it.year)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {open !== null && items[open] && (
        <Lightbox it={items[open]} n={open + 1} total={items.length} onClose={() => setOpen(null)}
          onPrev={() => setOpen((open - 1 + items.length) % items.length)} onNext={() => setOpen((open + 1) % items.length)} />
      )}
    </div>
  );
}

function Lightbox({ it, n, total, onClose, onPrev, onNext }: { it: GalleryItem; n: number; total: number; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  const [startX, setStartX] = useState<number | null>(null);
  const onTouchStart = useCallback((e: React.TouchEvent) => { setStartX(e.touches[0].clientX); }, []);
  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX; setStartX(null);
    if (dx > 50) onPrev(); else if (dx < -50) onNext();
  }, [startX, onPrev, onNext]);
  return (
    <div role="dialog" aria-modal="true" aria-label={it.note} className="fixed inset-0 z-[80] flex flex-col bg-night/95 text-bone backdrop-blur-sm" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <span className="mono text-ash">{n} / {total} · {yearLabel(it.year)}</span>
        <button type="button" onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close">Close ×</button>
      </div>
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-2 pb-2">
        <button type="button" onClick={onPrev} aria-label="Previous" className="absolute left-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-night/60 text-2xl hover:border-ember sm:flex">‹</button>
        <img src={it.src} alt={it.note} className="max-h-full max-w-full rounded-lg object-contain" />
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
