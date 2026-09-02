"use client";

import { STATIONS } from "@/lib/journey";

/**
 * A hand-drawn trail on the right edge (desktop) that draws itself as you
 * walk the weekend, with a waypoint per station. On phones it becomes a
 * hairline at the bottom with a marker.
 */
export default function TrailRail({ progress, active, visible }: { progress: number; active: number; visible: boolean }) {
  const H = 520;
  const n = STATIONS.length;
  // a gently wandering path from top to bottom
  const pts = STATIONS.map((_, i) => {
    const y = 16 + (i * (H - 32)) / (n - 1);
    const x = 20 + Math.sin(i * 1.9) * 9;
    return [x, y] as const;
  });
  const d = pts.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(" ");
  // total length approx (straight segments)
  let len = 0;
  for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);

  return (
    <>
      <div
        className={`pointer-events-none fixed right-4 top-1/2 z-[30] hidden -translate-y-1/2 transition-opacity duration-500 lg:block ${visible ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      >
        <svg width="44" height={H} viewBox={`0 0 44 ${H}`} fill="none">
          <path d={d} stroke="rgba(241,236,225,.18)" strokeWidth="1.5" strokeDasharray="3 5" strokeLinecap="round" />
          <path
            d={d}
            stroke="#E8652A"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={len}
            strokeDashoffset={len * (1 - progress)}
            style={{ transition: "stroke-dashoffset .25s linear" }}
          />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={i === active ? 5 : 3} fill={i <= active ? "#E8652A" : "#0a0d11"} stroke={i <= active ? "#E8652A" : "rgba(241,236,225,.35)"} strokeWidth="1.5" className="trail-dot" />
            </g>
          ))}
          <text x="22" y={H - 2} fontSize="8" fill="rgba(241,236,225,.5)" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" letterSpacing="1">
            {STATIONS[active].n}
          </text>
        </svg>
      </div>
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-[30] h-[3px] transition-opacity duration-500 lg:hidden ${visible ? "opacity-100" : "opacity-0"}`}
        aria-hidden
      >
        <div className="h-full bg-ember" style={{ width: `${progress * 100}%`, transition: "width .2s linear" }} />
      </div>
    </>
  );
}
