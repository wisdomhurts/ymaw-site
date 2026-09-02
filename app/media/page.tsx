import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Gallery from "@/components/Gallery";
import { Lines } from "@/components/Reveal";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { GALLERY } from "@/lib/gallery";

export const metadata: Metadata = {
  title: "Photos & Film",
  description: "The Young Men's Adventure Weekend in real frames: the bus, the hike in, camp, the Quests, the fire, the walk out. Photographs and film from the weekend's own archive, by chapter and by year.",
};

export default function MediaPage() {
  const stills = GALLERY.filter((i) => i.kind === "still").length;
  const clips = GALLERY.filter((i) => i.kind === "clip").length;
  return (
    <>
      <PageHero
        kicker="Photos & film · the weekend's own archive"
        lines={["Every frame", "is real."]}
        lede={`${stills} photographs and ${clips} short films, shot at YMAW weekends by the men who were there. Nothing staged, nothing stock. Walk it by chapter, or by year.`}
        still={STILLS["fire-circle-2003"]}
        short
      >
        <p className="mt-6 max-w-[40rem] text-sm text-ash">The circle and the ceremony are never filmed. Young men appear here only from behind, at a distance, or with a release on file; if you see yourself and would rather not, email <a className="link" href={`mailto:${FACTS.email}`}>{FACTS.email}</a> and it comes down the same day.</p>
      </PageHero>

      <section className="bg-night pb-24 pt-10 text-bone">
        <Gallery />
      </section>

      <section className="bg-paper py-20 text-ink" data-surface="paper">
        <div className="wrap grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mono text-flame">Your frame</p>
            <h2 className="t-h2 mt-3"><Lines lines={["The next ring", `is ${FACTS.dates.short}.`]} /></h2>
            <p className="mt-4 max-w-[36rem] text-ink/75">Thirty-six years of these. Fathers in the early frames, sons in the late ones. Put him in this September's.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/register" className="btn btn-ink btn-lg">Register</Link>
            <Link href="/since-1990" className="btn btn-ghost btn-lg" style={{ borderColor: "rgba(22,17,12,.2)" }}>One frame per year</Link>
          </div>
        </div>
      </section>
    </>
  );
}
