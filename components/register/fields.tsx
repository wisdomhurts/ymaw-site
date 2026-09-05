"use client";

import type { ReactNode } from "react";

export function Field({
  label, name, value, onChange, type = "text", required, placeholder, hint, error, autoComplete, inputMode, pattern, min, max, className = "", textarea, half,
}: {
  label: string; name: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string; hint?: string; error?: string;
  autoComplete?: string; inputMode?: "text" | "tel" | "email" | "numeric" | "decimal"; pattern?: string; min?: string; max?: string; className?: string; textarea?: boolean; half?: boolean;
}) {
  const id = `f-${name}`;
  return (
    <div className={`field ${half ? "sm:col-span-1" : "sm:col-span-2"} ${className}`}>
      <label htmlFor={id}>
        {label}
        {required ? <span className="text-ember"> *</span> : <span className="text-dust"> · optional</span>}
      </label>
      {textarea ? (
        <textarea id={id} name={name} className="textarea" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      ) : (
        <input id={id} name={name} type={type} className="input" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} autoComplete={autoComplete} inputMode={inputMode} pattern={pattern} min={min} max={max} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} />
      )}
      {hint && !error && <p className="text-xs text-dust">{hint}</p>}
      {error && <p id={`${id}-err`} className="text-sm text-flame">{error}</p>}
    </div>
  );
}

export function Select({ label, name, value, onChange, options, required, error, half, hint }: { label: string; name: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean; error?: string; half?: boolean; hint?: string }) {
  const id = `f-${name}`;
  return (
    <div className={`field ${half ? "sm:col-span-1" : "sm:col-span-2"}`}>
      <label htmlFor={id}>{label}{required ? <span className="text-ember"> *</span> : null}</label>
      <select id={id} name={name} className="select" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error}>
        <option value="">Choose…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {hint && !error && <p className="text-xs text-dust">{hint}</p>}
      {error && <p className="text-sm text-flame">{error}</p>}
    </div>
  );
}

export function YesNo({ label, value, onChange, error }: { label: string; value: string; onChange: (v: "yes" | "no") => void; error?: string }) {
  return (
    <div className="field sm:col-span-2">
      <span className="lbl">{label}<span className="text-ember"> *</span></span>
      <div className="grid grid-cols-2 gap-2">
        {(["yes", "no"] as const).map((o) => (
          <button key={o} type="button" className="choice text-center capitalize" data-on={value === o} onClick={() => onChange(o)} aria-pressed={value === o}>
            {o}
          </button>
        ))}
      </div>
      {error && <p className="text-sm text-flame">{error}</p>}
    </div>
  );
}

export function Choice({ on, onClick, title, line, badge, children }: { on: boolean; onClick: () => void; title: string; line?: string; badge?: string; children?: ReactNode }) {
  return (
    <button type="button" className="choice text-left" data-on={on} onClick={onClick} aria-pressed={on}>
      <span className="flex items-start justify-between gap-3">
        <span className="display text-2xl leading-none">{title}</span>
        {badge && <span className="mono text-ember">{badge}</span>}
      </span>
      {line && <span className="mt-1.5 block text-sm text-[color:var(--muted)]">{line}</span>}
      {children}
    </button>
  );
}

export function Check({ checked, onChange, children, error }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string }) {
  return (
    <div>
      <label className="check">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error} />
        <span className="text-[0.98rem] leading-snug">{children}</span>
      </label>
      {error && <p className="mt-1 text-sm text-flame">{error}</p>}
    </div>
  );
}

export function Agreement({ n, text, initials, onChange, error }: { n: number; text: string; initials: string; onChange: (v: string) => void; error?: string }) {
  return (
    <div className="agree grid gap-2 py-3 sm:grid-cols-[1fr_7rem] sm:items-center">
      <p className="text-[1rem] leading-snug"><span className="mono mr-2 text-ember">{n}</span>{text}</p>
      <div>
        <input aria-label={`Initials for agreement ${n}`} className="input sig !text-[1.2rem] !py-2 text-center uppercase" placeholder="Initials" maxLength={6} value={initials} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
      </div>
    </div>
  );
}

export function Signature({ label, value, onChange, hint, error }: { label: string; value: string; onChange: (v: string) => void; hint?: string; error?: string }) {
  return (
    <div className="field">
      <label htmlFor="sig">{label}<span className="text-ember"> *</span></label>
      <input id="sig" className="input sig" value={value} onChange={(e) => onChange(e.target.value)} placeholder="Type your full name" autoComplete="off" aria-invalid={!!error} />
      <p className="text-xs text-dust">{hint || "Typing your name here is your signature. We record the date, time and network address with it."}</p>
      {error && <p className="text-sm text-flame">{error}</p>}
    </div>
  );
}

export function StepHead({ kicker, title, lede }: { kicker: string; title: string; lede?: ReactNode }) {
  return (
    <header className="mb-8">
      <p className="mono text-ember">{kicker}</p>
      <h1 className="t-h2 mt-2">{title}</h1>
      {lede && <p className="t-lede mt-3 max-w-[38rem] text-[color:var(--muted)]">{lede}</p>}
    </header>
  );
}
