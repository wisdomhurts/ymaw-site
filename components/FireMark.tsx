// The fire mark: spark, flame, crossed logs. Redrawn as clean SVG from the
// Society's logo so it can live at any size and, when allowed, breathe.
type Props = {
  size?: number;
  animate?: boolean;
  mono?: string; // one-colour version (e.g. "currentColor")
  className?: string;
  title?: string;
};

export default function FireMark({ size = 56, animate = false, mono, className = "", title = "YMAW fire mark" }: Props) {
  const sun = mono ?? "#F2C21B";
  const flame = mono ?? "#D9421D";
  const log = mono ?? "#5B4A47";
  const h = Math.round(size * (276 / 128));
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 128 276"
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={className}
      style={{ overflow: "visible" }}
    >
      {/* spark / sun: 8 rays */}
      <g transform="translate(64 48)" fill={sun}>
        {[0, 45, 90, 135].map((r) => (
          <rect key={r} x={-7} y={-42} width={14} height={84} rx={2} transform={`rotate(${r})`} />
        ))}
      </g>
      {animate && (
        <g fill={sun} opacity="0.9">
          <circle className="fire-spark" cx="52" cy="112" r="2.2" />
          <circle className="fire-spark" cx="70" cy="118" r="1.8" />
          <circle className="fire-spark" cx="62" cy="106" r="1.5" />
        </g>
      )}
      {/* flame with inner diamond, notched base */}
      <path
        className={animate ? "fire-flame" : undefined}
        fill={flame}
        fillRule="evenodd"
        d="M64 96 L114 206 L86 222 L64 194 L42 222 L14 206 Z M64 150 L80 176 L64 196 L48 176 Z"
      />
      {/* crossed logs */}
      <g fill={log} transform="translate(64 246)">
        <rect x={-62} y={-9} width={124} height={18} rx={3} transform="rotate(20)" />
        <rect x={-62} y={-9} width={124} height={18} rx={3} transform="rotate(-20)" />
      </g>
    </svg>
  );
}

export function Wordmark({ className = "", markSize = 22, light = true }: { className?: string; markSize?: number; light?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <FireMark size={markSize} title="" />
      <span
        className="display"
        style={{ fontSize: markSize * 1.9, letterSpacing: "0.02em", lineHeight: 1, color: light ? "var(--fg)" : "var(--color-ink)" }}
      >
        YMAW
      </span>
    </span>
  );
}
