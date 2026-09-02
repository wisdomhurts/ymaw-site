"use client";

import { useEffect, useRef } from "react";

/** Adds .is-in when the element enters the viewport (once). */
export default function Reveal({
  children,
  className = "",
  as: Tag = "div",
  lines = false,
  delay = 0,
  threshold = 0.18,
}: {
  children: React.ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  lines?: boolean;
  delay?: number;
  threshold?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setTimeout(() => el.classList.add("is-in"), delay);
            io.unobserve(el);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, threshold]);
  const C = Tag as React.ElementType;
  return (
    <C ref={ref} className={`${lines ? "reveal-lines" : "reveal"} ${className}`}>
      {children}
    </C>
  );
}

/** Wrap each line of a headline for the masked line reveal. */
export function Lines({ lines, className = "" }: { lines: string[]; className?: string }) {
  return (
    <Reveal lines className={className} as="span">
      {lines.map((l, i) => (
        <span key={i}>
          <span>{l}</span>
        </span>
      ))}
    </Reveal>
  );
}
