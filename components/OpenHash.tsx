"use client";

import { useEffect } from "react";

/** Opens the <details> whose id matches the URL hash, so deep links land on an open answer. */
export default function OpenHash() {
  useEffect(() => {
    const open = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el instanceof HTMLDetailsElement) { el.open = true; el.scrollIntoView({ block: "start" }); }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
