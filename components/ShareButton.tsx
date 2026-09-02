"use client";

import { useState } from "react";

/** "Send this to a dad": one tap writes the message. Built for a text. */
export default function ShareButton({ text, url, label = "Send this to a dad", className = "" }: { text: string; url: string; label?: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");
  const share = async () => {
    const full = `${text} ${url}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      try { await navigator.share({ title: "YMAW", text, url }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(full);
      setState("copied");
      setTimeout(() => setState("idle"), 2200);
    } catch {
      window.location.href = `sms:?&body=${encodeURIComponent(full)}`;
    }
  };
  return (
    <button type="button" onClick={share} className={`btn btn-ghost btn-sm ${className}`}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 15V3m0 0L8 7m4-4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {state === "copied" ? "Copied. Paste it in a text." : label}
    </button>
  );
}
