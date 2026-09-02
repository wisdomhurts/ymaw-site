import type { Metadata } from "next";
import Admin from "./Admin";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return (
    <div className="bg-paper text-ink" data-surface="paper">
      <div className="wrap py-[calc(var(--nav-h)+2rem)]">
        <Admin />
      </div>
    </div>
  );
}
