"use client";
/** Hospitals & clinics discovery with filters and map view. */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { CITIES, distanceKm, hospitals, relevanceSort } from "@/lib/data";
import { getCity } from "@/lib/storage";
import { EmptyState, FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

export default function HospitalsPage() {
  const [city, setCity] = useState("Mumbai");
  const [type, setType] = useState("all");
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [view, setView] = useState<"list" | "map">("list");

  useEffect(() => {
    setCity(getCity());
    const refresh = () => setCity(getCity());
    window.addEventListener("finddoc:storage", refresh);
    return () => window.removeEventListener("finddoc:storage", refresh);
  }, []);

  const cityCenter = CITIES.find((c) => c.name === city) ?? CITIES[0];
  const types = useMemo(() => Array.from(new Set(hospitals.map((h) => h.type))).sort(), []);

  const results = useMemo(() => {
    let list = hospitals.filter((h) => h.city === city);
    if (type !== "all") list = list.filter((h) => h.type === type);
    if (emergencyOnly) list = list.filter((h) => h.emergency24x7);
    return relevanceSort(list);
  }, [city, type, emergencyOnly]);

  return (
    <div className="container-page animate-fadeUp py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hospitals & Clinics in {city}</h1>
          <p className="text-sm text-slate-500">{results.length} found · facilities & emergency status shown upfront</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={type} onChange={(e) => setType(e.target.value)} aria-label="Filter by type" className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={emergencyOnly} onChange={(e) => setEmergencyOnly(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            24×7 Emergency
          </label>
          <div className="flex overflow-hidden rounded-lg border border-slate-300">
            <button onClick={() => setView("list")} className={`px-3 py-2 text-sm font-medium ${view === "list" ? "bg-brand-600 text-white" : "bg-white text-slate-600"}`}>List</button>
            <button onClick={() => setView("map")} className={`px-3 py-2 text-sm font-medium ${view === "map" ? "bg-brand-600 text-white" : "bg-white text-slate-600"}`}>Map</button>
          </div>
        </div>
      </div>

      {view === "map" ? (
        <div className="card mt-6 h-[560px] overflow-hidden p-0">
          <MapView
            center={cityCenter}
            markers={results.map((h) => ({ id: h.id, lat: h.lat, lng: h.lng, label: h.name, sub: h.type, href: `/hospital/${h.id}`, featured: h.featured }))}
          />
        </div>
      ) : results.length === 0 ? (
        <div className="mt-6"><EmptyState title="No hospitals match these filters" /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {results.map((h) => (
            <Link key={h.id} href={`/hospital/${h.id}`} className={`card p-5 transition hover:shadow-md ${h.featured ? "border-amber-200" : ""}`}>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-slate-900">{h.name}</p>
                {h.featured && <FeaturedBadge />}
                {h.verified && <VerifiedBadge />}
              </div>
              <p className="mt-1 text-sm text-slate-500">{h.type}{h.beds > 0 ? ` · ${h.beds} beds` : ""}</p>
              <p className="text-sm text-slate-400">{h.area} · {distanceKm(cityCenter.lat, cityCenter.lng, h.lat, h.lng)} km away</p>
              <div className="mt-2 flex items-center justify-between">
                <Stars rating={h.rating} count={h.reviewCount} />
                {h.emergency24x7 && <span className="chip bg-red-50 text-red-700 border border-red-200">24×7 Emergency</span>}
              </div>
              <p className="mt-2 line-clamp-1 text-xs text-slate-400">{h.specialties.join(" · ")}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
