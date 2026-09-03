"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV, FACTS } from "@/lib/facts";
import FireMark from "./FireMark";
import { useSite } from "./Providers";

export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [paper, setPaper] = useState(false);
  const { lenis } = useSite();

  useEffect(() => {
    const first = document.querySelector("main > *");
    setPaper(first?.getAttribute("data-surface") === "paper");
  }, [path]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    if (!lenis) return;
    if (open) lenis.stop(); else lenis.start();
  }, [open, lenis]);

  const onRegister = path?.startsWith("/register");

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,backdrop-filter,border-color,color] duration-500 ${
          open ? "bg-night/85 backdrop-blur-md border-b border-white/10 text-bone" :
          scrolled ? (paper ? "bg-paper/85 backdrop-blur-md border-b border-ink/10 text-ink" : "bg-night/75 backdrop-blur-md border-b border-white/10 text-bone") :
          (paper ? "border-b border-transparent text-ink" : "border-b border-transparent text-bone")
        }`}
        style={{ height: "var(--nav-h)" }}
      >
        <div className="wrap flex h-full items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5" aria-label="YMAW home">
            <FireMark size={18} title="" />
            <span className="display text-[1.6rem] tracking-wide">YMAW</span>
          </Link>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`whitespace-nowrap text-[0.92rem] transition-opacity hover:opacity-100 ${path === n.href ? "opacity-100" : "opacity-65"}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {!onRegister && (
              <Link href="/register" className="btn btn-ember btn-sm">
                Register
              </Link>
            )}
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full border border-current/20 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="relative block h-3 w-5">
                <span className={`absolute left-0 top-0 h-[2px] w-5 bg-current transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
                <span className={`absolute left-0 bottom-0 h-[2px] w-5 bg-current transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
        {/* trail progress */}
        <div className="absolute inset-x-0 bottom-[-1px] h-[2px] bg-transparent">
          <div className="h-full bg-ember transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
        </div>
      </header>

      <div
        id="mobile-nav"
        className={`fixed inset-0 z-40 bg-night/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        aria-hidden={!open}
      >
        <div className="wrap flex h-full flex-col justify-center gap-2 pt-16">
          {NAV.map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              className="display text-[2.8rem] leading-none text-bone transition-transform hover:translate-x-2"
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              {n.label}
            </Link>
          ))}
          <Link href="/what-to-bring" className="display text-[2.8rem] leading-none text-bone">What to Bring</Link>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="btn btn-ember">Register</Link>
            <a href={`mailto:${FACTS.email}`} className="btn btn-ghost">Email us</a>
          </div>
        </div>
      </div>
    </>
  );
}
