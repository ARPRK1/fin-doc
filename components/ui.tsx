"use client";
/** Small shared UI primitives: badges, star ratings, empty states. */
import type { ReactNode } from "react";

/**
 * Paid-placement label. Transparency rule: any provider paying for visibility
 * MUST carry this badge wherever they appear. Amber is reserved for sponsorship
 * so it is never confused with clinical/trust colors.
 */
export function FeaturedBadge() {
  return (
    <span
      className="chip bg-amber-100 text-amber-800 border border-amber-200"
      title="This provider pays for higher visibility. Ranking chosen by you (price/rating/distance) is never affected."
    >
      ★ Featured
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="chip bg-brand-50 text-brand-700 border border-brand-200" title="Sample data for this demo — not a real, credential-verified provider.">
      ✓ Verified (demo)
    </span>
  );
}

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rated ${rating} out of 5`}>
      <span className="font-semibold text-emerald-700">{rating.toFixed(1)}</span>
      <span aria-hidden className="text-amber-500">
        {"★".repeat(Math.round(rating))}
        <span className="text-slate-300">{"★".repeat(5 - Math.round(rating))}</span>
      </span>
      {count !== undefined && <span className="text-slate-500">({count.toLocaleString("en-IN")})</span>}
    </span>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card p-10 text-center">
      <p className="text-lg font-semibold text-slate-700">{title}</p>
      {children && <div className="mt-2 text-sm text-slate-500">{children}</div>}
    </div>
  );
}

export function SectionTitle({ children, sub }: { children: ReactNode; sub?: string }) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold tracking-tight text-slate-900">{children}</h2>
      {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
    </div>
  );
}
