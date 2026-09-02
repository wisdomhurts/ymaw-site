"use client";

export default function PrintButton({ ghost = false }: { ghost?: boolean }) {
  return (
    <button type="button" onClick={() => window.print()} className={`btn ${ghost ? "btn-ghost btn-lg" : "btn-ember"}`}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 9V3h12v6M6 17H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M6 14h12v7H6z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
      Print the field card
    </button>
  );
}
