"use client";
/**
 * Diagnostics: search tests across labs, compare prices, discover centers,
 * and book a slot or home sample collection (simulation).
 */
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { allTests, CITIES, distanceKm, formatINR, labs, relevanceSort } from "@/lib/data";
import { getCity } from "@/lib/storage";
import { EmptyState, FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";
import BookingModal from "@/components/BookingModal";
import type { Lab } from "@/lib/types";

export default function DiagnosticsPage() {
  const [city, setCity] = useState("Mumbai");
  const [q, setQ] = useState("");
  const [homeOnly, setHomeOnly] = useState(false);
  const [nablOnly, setNablOnly] = useState(false);
  const [booking, setBooking] = useState<{ lab: Lab; test: string; price: number; home: boolean } | null>(null);

  useEffect(() => {
    setCity(getCity());
    const refresh = () => setCity(getCity());
    window.addEventListener("finddoc:storage", refresh);
    return () => window.removeEventListener("finddoc:storage", refresh);
  }, []);

  const cityCenter = CITIES.find((c) => c.name === city) ?? CITIES[0];
  const tests = useMemo(() => allTests(), []);

  const cityLabs = useMemo(() => {
    let list = labs.filter((l) => l.city === city);
    if (homeOnly) list = list.filter((l) => l.homeCollection);
    if (nablOnly) list = list.filter((l) => l.nablAccredited);
    if (q.trim()) {
      const s = q.toLowerCase();
      list = list.filter((l) => l.name.toLowerCase().includes(s) || l.tests.some((t) => t.name.toLowerCase().includes(s)));
    }
    return relevanceSort(list);
  }, [city, q, homeOnly, nablOnly]);

  return (
    <div className="container-page animate-fadeUp py-8">
      <h1 className="text-2xl font-bold text-slate-900">Diagnostics & Labs in {city}</h1>
      <p className="text-sm text-slate-500">Compare test prices across labs. Book a centre visit or home sample collection — free for you.</p>

      {/* Popular tests price comparison */}
      <section className="card mt-6 p-5">
        <h2 className="font-bold text-slate-900">Popular tests (lowest price across labs)</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {tests.slice(0, 9).map((t) => (
            <button
              key={t.name}
              onClick={() => setQ(t.name)}
              className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-left text-sm transition hover:border-brand-400 hover:bg-brand-50"
            >
              <span className="min-w-0 truncate pr-2 text-slate-700">{t.name}</span>
              <span className="shrink-0 font-bold text-slate-900">from {formatINR(t.minPrice)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a test or lab (e.g. CBC, Thyroid, MRI)…"
          aria-label="Search tests and labs"
          className="w-full max-w-md rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm"
        />
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={homeOnly} onChange={(e) => setHomeOnly(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          Home collection
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input type="checkbox" checked={nablOnly} onChange={(e) => setNablOnly(e.target.checked)} className="h-4 w-4 accent-brand-600" />
          NABL accredited
        </label>
      </div>

      {/* Lab cards */}
      {cityLabs.length === 0 ? (
        <div className="mt-6"><EmptyState title="No labs match — try clearing filters" /></div>
      ) : (
        <div className="mt-6 grid gap-4">
          {cityLabs.map((l) => {
            const s = q.toLowerCase().trim();
            const matched = s ? l.tests.filter((t) => t.name.toLowerCase().includes(s)) : l.tests.slice(0, 4);
            return (
              <div key={l.id} className={`card p-5 ${l.featured ? "border-amber-200" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/lab/${l.id}`} className="font-bold text-slate-900 hover:text-brand-700">{l.name}</Link>
                      {l.featured && <FeaturedBadge />}
                      {l.verified && <VerifiedBadge />}
                      {l.nablAccredited && <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">NABL</span>}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {l.area} · {distanceKm(cityCenter.lat, cityCenter.lng, l.lat, l.lng)} km · Reports: {l.reportTime}
                      {l.homeCollection && <> · 🏠 Home collection {l.homeCollectionFee === 0 ? "free" : formatINR(l.homeCollectionFee)}</>}
                    </p>
                    <div className="mt-1"><Stars rating={l.rating} count={l.reviewCount} /></div>
                  </div>
                  <Link href={`/lab/${l.id}`} className="btn-secondary">All {l.tests.length} tests →</Link>
                </div>

                {matched.length > 0 && (
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {matched.slice(0, 4).map((t) => (
                      <div key={t.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-sm">
                        <span className="min-w-0 truncate pr-2 text-slate-700">{t.name}</span>
                        <span className="flex shrink-0 items-center gap-2">
                          {t.mrp && <s className="text-xs text-slate-400">{formatINR(t.mrp)}</s>}
                          <strong>{formatINR(t.price)}</strong>
                          <button onClick={() => setBooking({ lab: l, test: t.name, price: t.price, home: false })} className="rounded-lg bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-brand-700">
                            Book
                          </button>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-slate-400">
        Test prices are indicative and confirmed by the lab at booking. Diagnostic reports must always be interpreted by
        a qualified doctor — FindDoc does not interpret results or provide medical advice.
      </p>

      {booking && (
        <BookingModal
          open={!!booking}
          onClose={() => setBooking(null)}
          kind="diagnostic"
          providerId={booking.lab.id}
          providerName={booking.lab.name}
          detail={booking.test}
          city={booking.lab.city}
          amount={booking.price}
          slots={["Today 7:30 AM", "Today 9:00 AM", "Tomorrow 7:00 AM (Home)", "Tomorrow 8:30 AM", "Tomorrow 6:00 PM"]}
        />
      )}
    </div>
  );
}
