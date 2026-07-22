"use client";
/** Hospital / clinic profile: facilities, specialties, timings, reviews, map, contact. */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatINR, getHospital } from "@/lib/data";
import { isFavorite, toggleFavorite } from "@/lib/storage";
import { EmptyState, FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function HospitalProfile() {
  const { id } = useParams<{ id: string }>();
  const h = getHospital(id);
  const [fav, setFav] = useState(false);
  useEffect(() => {
    if (h) setFav(isFavorite(h.id));
  }, [h]);

  if (!h) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Hospital not found">
          <Link href="/hospitals" className="text-brand-700 underline">Back to hospitals</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-page animate-fadeUp py-8">
      <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
        <Link href="/hospitals" className="hover:text-brand-700">Hospitals</Link> / <span className="text-slate-600">{h.name}</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,340px]">
        <div className="grid gap-6">
          <section className={`card p-6 ${h.featured ? "border-amber-200" : ""}`}>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold text-slate-900">{h.name}</h1>
              {h.featured && <FeaturedBadge />}
              {h.verified && <VerifiedBadge />}
            </div>
            <p className="mt-1 text-slate-600">{h.type}{h.beds > 0 ? ` · ${h.beds} beds` : ""}</p>
            <p className="text-sm text-slate-500">{h.address}</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Stars rating={h.rating} count={h.reviewCount} />
              {h.emergency24x7 && <span className="chip bg-red-50 text-red-700 border border-red-200">24×7 Emergency</span>}
            </div>
            <p className="mt-3 text-sm text-slate-600">{h.opdTimings} · OPD fees typically {formatINR(h.opdFeeRange[0])}–{formatINR(h.opdFeeRange[1])}</p>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-slate-900">Specialties</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {h.specialties.map((s) => (
                <span key={s} className="chip bg-brand-50 text-brand-700 border border-brand-100">{s}</span>
              ))}
            </div>
            <h2 className="mt-6 font-bold text-slate-900">Facilities</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {h.facilities.map((f) => (
                <span key={f} className="chip bg-slate-100 text-slate-600">{f}</span>
              ))}
            </div>
          </section>

          <section className="card p-6">
            <h2 className="font-bold text-slate-900">Patient reviews</h2>
            <div className="mt-4 grid gap-4">
              {h.reviews.map((r, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{r.author}</p>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <p className="text-xs text-amber-500">{"★".repeat(r.rating)}</p>
                  <p className="mt-1 text-sm text-slate-600">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit lg:sticky lg:top-20">
          <div className="card p-6">
            <a href={`tel:${h.phone.replace(/\s/g, "")}`} className="btn-primary w-full text-base">📞 Call hospital</a>
            <a
              href={`https://www.openstreetmap.org/directions?to=${h.lat}%2C${h.lng}`}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary mt-2 w-full"
            >
              🧭 Get directions
            </a>
            <button
              onClick={() => setFav(toggleFavorite({ id: h.id, kind: "hospital", name: h.name, detail: h.type, city: h.city }))}
              className={`mt-2 w-full rounded-xl border px-4 py-2.5 text-sm font-semibold ${fav ? "border-rose-300 bg-rose-50 text-rose-600" : "border-slate-300 text-slate-500 hover:border-rose-300"}`}
            >
              {fav ? "♥ Saved to favorites" : "♡ Save to favorites"}
            </button>
            <p className="mt-3 text-[11px] text-slate-400">
              To book an OPD appointment with a specific doctor, find them under <Link href="/search" className="underline">Doctors</Link>.
            </p>
          </div>
          <div className="card mt-4 h-56 overflow-hidden p-0">
            <MapView center={{ lat: h.lat, lng: h.lng }} zoom={14} markers={[{ id: h.id, lat: h.lat, lng: h.lng, label: h.name, sub: h.type, featured: h.featured }]} />
          </div>
        </aside>
      </div>
    </div>
  );
}
