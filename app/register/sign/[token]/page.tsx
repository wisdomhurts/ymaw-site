import type { Metadata } from "next";
import SignFlow from "./SignFlow";

export const metadata: Metadata = { title: "Sign your part", robots: { index: false } };

export default async function SignPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="bg-paper text-ink" data-surface="paper">
      <div className="wrap-narrow py-[calc(var(--nav-h)+2rem)]">
        <SignFlow token={token} />
      </div>
    </div>
  );
}
