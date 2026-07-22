"use client";
/** Diagnostic lab profile: full test menu with booking, timings, map. */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useState } from "react";
import { formatINR, getLab } from "@/lib/data";
import { EmptyState, FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";
import BookingModal from "@/components/BookingModal";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function LabProfile() {
  const { id } = useParams<{ id: string }>();
  const l = getLab(id);
  const [booking, setBooking] = useState<{ test: string; price: number } | null>(null);

  if (!l) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Lab not found">
          <Link href="/diagnostics" className="text-brand-700 underline">Back to diagnostics</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-page animate-fadeUp py-8">
      <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
        <Link href="/diagnostics" className="hover:text-brand-700">Diagnostics</Link> / <span className="text-slate-600">{l.name}</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,340px]">
        <div className="grid gap-6">
          <section className={`card p-6 ${l.featured ? "border-amber-200" : ""}`}>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{l.name}</h1>
              {l.featured && <FeaturedBadge />}
              {l.verified && <VerifiedBadge />}
              {l.nablAccredited && <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">NABL Accredited</span>}
            </div>
            <p className="mt-1 text-sm text-slate-500">{l.address}</p>
            <div className="mt-2"><Stars rating={l.rating} count={l.reviewCount} /></div>
            <div className="mt-3 grid gap-1 text-sm text-slate-600 sm:grid-cols-2">
              <p>🕐 {l.timings}</p>
              <p>📄 Reports: {l.reportTime}</p>
              {l.homeCollection && <p>🏠 Home collection: {l.homeCollectionFee === 0 ? "Free" : formatINR(l.homeCollectionFee)}</p>}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-slate-900">Test menu ({l.tests.length})</h2>
            <div className="mt-4 grid gap-2">
              {l.tests.map((t) => (
                <div key={t.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                  <span className="min-w-0 truncate pr-3 text-slate-700">{t.name}</span>
                  <span className="flex shrink-0 items-center gap-3">
                    {t.mrp && <s className="text-xs text-slate-400">{formatINR(t.mrp)}</s>}
                    <strong className="text-slate-900">{formatINR(t.price)}</strong>
                    <button onClick={() => setBooking({ test: t.name, price: t.price })} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700">
                      Book
                    </button>
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">Prices are indicative. Reports must be interpreted by a qualified doctor.</p>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-20">
          <div className="card p-6">
            <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="btn-primary w-full">📞 Call lab</a>
            <a href={`https://www.openstreetmap.org/directions?to=${l.lat}%2C${l.lng}`} target="_blank" rel="noreferrer" className="btn-secondary mt-2 w-full">🧭 Get directions</a>
          </div>
          <div className="card mt-4 h-56 overflow-hidden p-0">
            <MapView center={{ lat: l.lat, lng: l.lng }} zoom={14} markers={[{ id: l.id, lat: l.lat, lng: l.lng, label: l.name, featured: l.featured }]} />
          </div>
        </aside>
      </div>

      {booking && (
        <BookingModal
          open={!!booking}
          onClose={() => setBooking(null)}
          kind="diagnostic"
          providerId={l.id}
          providerName={l.name}
          detail={booking.test}
          city={l.city}
          amount={booking.price}
          slots={["Today 7:30 AM", "Today 9:00 AM", "Tomorrow 7:00 AM (Home)", "Tomorrow 8:30 AM", "Tomorrow 6:00 PM"]}
        />
      )}
    </div>
  );
}
