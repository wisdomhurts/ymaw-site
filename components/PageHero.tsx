import type { Still as StillT } from "@/lib/media";
import { Still } from "./Media";
import { Lines } from "./Reveal";

/** Inner-page opener: a real frame, a kicker, a big title, a serif lede. */
export default function PageHero({
  kicker, lines, lede, still, tone = "night", children, short = false,
}: {
  kicker: string; lines: string[]; lede?: React.ReactNode; still?: StillT; tone?: "night" | "paper"; children?: React.ReactNode; short?: boolean;
}) {
  const night = tone === "night";
  return (
    <section className={`relative overflow-hidden ${night ? "bg-night text-bone" : "bg-paper text-ink"} ${still ? "grain" : ""}`} data-surface={night ? undefined : "paper"}>
      {still && (
        <>
          <div className="absolute inset-0"><Still s={still} priority sizes="100vw" className="brightness-[.5]" /></div>
          <div className="scrim-b absolute inset-x-0 bottom-0 h-3/4" />
          <div className="scrim-t absolute inset-x-0 top-0 h-1/3" />
        </>
      )}
      <div className={`wrap relative flex flex-col justify-end ${short ? "min-h-[52svh]" : "min-h-[72svh]"} pb-12 pt-[calc(var(--nav-h)+4rem)]`}>
        <p className={`mono ${night ? "text-ember" : "text-flame"}`}>{kicker}</p>
        <h1 className="t-chapter mt-3"><Lines lines={lines} /></h1>
        {lede && <p className={`t-lede mt-5 max-w-[42rem] ${night ? "text-bone/85" : "text-ink/75"}`}>{lede}</p>}
        {children}
      </div>
    </section>
  );
}
