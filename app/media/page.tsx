import type { Metadata } from "next";
import Link from "next/link";
import Gallery from "@/components/Gallery";
import { Lines } from "@/components/Reveal";
import { FACTS } from "@/lib/facts";

export const metadata: Metadata = {
  title: "Photos",
  description: "Thirty photographs from the Young Men's Adventure Weekend: the bus, the hike in, camp, the Quests, the fire, the walk out. Every frame is real.",
};

export default function MediaPage() {
  return (
    <>
      <section className="bg-night pb-24 pt-[calc(var(--nav-h)+2.5rem)] text-bone">
        <div className="wrap mb-6"><h1 className="mono text-ember">Photos</h1></div>
        <Gallery />
      </section>

      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mono text-flame">Your frame</p>
            <h2 className="t-h2 mt-3"><Lines lines={["The next frame", `is ${FACTS.dates.short}.`]} /></h2>
            <p className="mt-4 max-w-[36rem] text-ink/75">Thirty-six years of these. Fathers in the early frames, sons in the late ones. Put him in this September's.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/register" className="btn btn-ink btn-lg">Register</Link>
            <Link href="/since-1990" className="btn btn-ghost btn-lg" style={{ borderColor: "rgba(22,17,12,.2)" }}>Then and now</Link>
          </div>
        </div>
      </section>
    </>
  );
}
