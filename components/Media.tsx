"use client";

import { useEffect, useRef, useState } from "react";
import type { Clip as ClipT, Still as StillT } from "@/lib/media";
import { useSite } from "./Providers";

/** A real photograph. Small source on phones, full on larger screens. */
export function Still({
  s,
  className = "",
  priority = false,
  sizes = "100vw",
  style,
}: {
  s: StillT;
  className?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  return (
    <picture>
      {s.srcSmall && <source media="(max-width: 640px)" srcSet={s.srcSmall} />}
      <img
        src={s.src}
        alt={s.alt}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        sizes={sizes}
        className={`block h-full w-full object-cover ${className}`}
        style={style}
        draggable={false}
      />
    </picture>
  );
}

/**
 * A real clip. Muted, looping, plays only while in view, and only when the
 * visitor hasn't asked for reduced motion (then it is a still).
 */
export function Clip({
  c,
  className = "",
  scrub = false,
  style,
}: {
  c: ClipT;
  className?: string;
  scrub?: boolean;
  style?: React.CSSProperties;
}) {
  const { reduced } = useSite();
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { if (inView && !loaded) setLoaded(true); }, [inView, loaded]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "40% 0px 40% 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || scrub) return;
    if (inView && !reduced) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [inView, reduced, scrub]);

  if (reduced) {
    return <img src={c.poster} alt={c.alt} className={`block h-full w-full object-cover ${className}`} style={style} />;
  }

  return (
    <video
      ref={ref}
      className={`block h-full w-full object-cover ${className}`}
      style={style}
      src={loaded || scrub ? c.src : undefined}
      poster={c.poster}
      muted
      loop={!scrub}
      playsInline
      preload={scrub ? "auto" : "metadata"}
      aria-label={c.alt}
      disablePictureInPicture
    />
  );
}
