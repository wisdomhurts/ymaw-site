import type { Metadata } from "next";
import WitnessFlow from "./WitnessFlow";

export const metadata: Metadata = { title: "Witness a registration", robots: { index: false } };

export default async function WitnessPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="bg-paper text-ink" data-surface="paper">
      <div className="wrap-narrow py-[calc(var(--nav-h)+2rem)]">
        <WitnessFlow token={token} />
      </div>
    </div>
  );
}
