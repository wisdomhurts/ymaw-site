import type { Metadata } from "next";
import { Suspense } from "react";
import RegisterFlow from "@/components/register/RegisterFlow";
import { FACTS } from "@/lib/facts";
import { STILLS } from "@/lib/media";
import { Still } from "@/components/Media";

export const metadata: Metadata = {
  title: "Register",
  description: `Register a young man (${FACTS.ages.min}–${FACTS.ages.max}), join the production team, or sponsor a seat. ${FACTS.dates.label}, ${FACTS.region}. $${FACTS.priceCAD} CAD.`,
};

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ role?: string; canceled?: string; ref?: string }> }) {
  const sp = await searchParams;
  return (
    <div className="bg-paper text-ink" data-surface="paper">
      <div className="grid min-h-[100svh] lg:grid-cols-[1fr_minmax(0,720px)_1fr]">
        {/* left: the reason */}
        <aside className="relative hidden lg:block">
          <div className="sticky top-0 h-[100svh] overflow-hidden">
            <Still s={STILLS["arms-up-lake"]} sizes="33vw" className="brightness-[.8]" />
            <div className="scrim-b absolute inset-x-0 bottom-0 h-1/2" />
            <div className="absolute bottom-8 left-8 right-8 text-bone">
              <p className="mono text-ember">{FACTS.dates.label}</p>
              <p className="display mt-2 text-[2.6rem] leading-none">Every hand goes up on Sunday.</p>
              <p className="mt-2 text-bone/75">${FACTS.priceCAD} CAD · {FACTS.region} · ages {FACTS.ages.min}–{FACTS.ages.max}</p>
            </div>
          </div>
        </aside>

        <div className="wrap-narrow w-full py-[calc(var(--nav-h)+2rem)] lg:px-10">
          <Suspense>
            <RegisterFlow initialRole={sp.role} canceledRef={sp.canceled ? sp.ref : undefined} />
          </Suspense>
        </div>

        <aside className="hidden lg:block" />
      </div>
    </div>
  );
}
