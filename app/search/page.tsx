"use client";
/**
 * Doctor search & discovery.
 * - Powerful filters: specialty, fee, rating, distance, gender, language, availability
 * - Sorting: Relevance (Featured may be boosted — always labeled) / rating / fee / distance
 *   User-chosen sorts are NEVER affected by paid placement.
 * - Card list + interactive map view.
 * - Symptom-aware search with a clear "not medical advice" disclaimer.
 */
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CITIES, doctors, distanceKm, formatINR, relevanceSort, SPECIALTIES } from "@/lib/data";
import { getCity, isFavorite, toggleFavorite } from "@/lib/storage";
import { EmptyState, FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";
import type { Doctor } from "@/lib/types";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

/** Symptom → specialty routing (information only, not diagnosis). */
const SYMPTOM_MAP: Record<string, string> = {
  fever: "general-physician", cold: "general-physician", cough: "general-physician", headache: "general-physician",
  skin: "dermatologist", acne: "dermatologist", rash: "dermatologist", hair: "dermatologist",
  heart: "cardiologist", chest: "cardiologist", bp: "cardiologist", "blood pressure": "cardiologist",
  child: "pediatrician", baby: "pediatrician", vaccination: "pediatrician",
  pregnancy: "gynecologist", period: "gynecologist",
  bone: "orthopedist", knee: "orthopedist", back: "orthopedist", joint: "orthopedist", fracture: "orthopedist",
  ear: "ent", throat: "ent", sinus: "ent", nose: "ent",
  eye: "ophthalmologist", vision: "ophthalmologist",
  anxiety: "psychiatrist", depression: "psychiatrist", sleep: "psychiatrist", stress: "psychiatrist",
  tooth: "dentist", teeth: "dentist", gum: "dentist",
  sugar: "diabetologist", diabetes: "diabetologist",
  stomach: "gastroenterologist", acidity: "gastroenterologist", liver: "gastroenterologist",
  migraine: "neurologist", seizure: "neurologist",
  kidney: "urologist", urine: "urologist",
};

type SortKey = "relevance" | "rating" | "feeLow" | "feeHigh" | "distance";

function SearchInner() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").toLowerCase().trim();

  const [city, setCity] = useState("Mumbai");
  const [specialty, setSpecialty] = useState<string>("all");
  const [maxFee, setMaxFee] = useState(2500);
  const [minRating, setMinRating] = useState(0);
  const [maxDist, setMaxDist] = useState(15);
  const [gender, setGender] = useState<"any" | "male" | "female">("any");
  const [language, setLanguage] = useState("any");
  const [todayOnly, setTodayOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [view, setView] = useState<"list" | "map">("list");
  const [favTick, setFavTick] = useState(0);
  const [symptomNote, setSymptomNote] = useState<string | null>(null);

  useEffect(() => {
    setCity(getCity());
    const refresh = () => setCity(getCity());
    window.addEventListener("finddoc:storage", refresh);
    return () => window.removeEventListener("finddoc:storage", refresh);
  }, []);

  // Symptom-aware routing from the query string
  useEffect(() => {
    if (!q) return;
    for (const [symptom, specKey] of Object.entries(SYMPTOM_MAP)) {
      if (q.includes(symptom)) {
        setSpecialty(specKey);
        const spec = SPECIALTIES.find((s) => s.key === specKey);
        setSymptomNote(
          `Showing ${spec?.name ?? "relevant"} results for “${q}”. This is specialty matching only — not medical advice or a diagnosis. If symptoms are severe, call 108.`
        );
        return;
      }
    }
  }, [q]);

  const cityCenter = CITIES.find((c) => c.name === city) ?? CITIES[0];

  const languages = useMemo(
    () => Array.from(new Set(doctors.filter((d) => d.city === city).flatMap((d) => d.languages))).sort(),
    [city]
  );

  const results = useMemo(() => {
    let list = doctors.filter((d) => d.city === city);
    if (specialty !== "all") list = list.filter((d) => d.specialtyKey === specialty);
    if (q && !symptomNote) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.clinicName.toLowerCase().includes(q) ||
          d.area.toLowerCase().includes(q)
      );
    }
    list = list.filter((d) => d.fee <= maxFee && d.rating >= minRating);
    list = list.filter((d) => distanceKm(cityCenter.lat, cityCenter.lng, d.lat, d.lng) <= maxDist);
    if (gender !== "any") list = list.filter((d) => d.gender === gender);
    if (language !== "any") list = list.filter((d) => d.languages.includes(language));
    if (todayOnly) list = list.filter((d) => d.availableToday);

    switch (sort) {
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      case "feeLow": return [...list].sort((a, b) => a.fee - b.fee);
      case "feeHigh": return [...list].sort((a, b) => b.fee - a.fee);
      case "distance":
        return [...list].sort(
          (a, b) =>
            distanceKm(cityCenter.lat, cityCenter.lng, a.lat, a.lng) - distanceKm(cityCenter.lat, cityCenter.lng, b.lat, b.lng)
        );
      default: return relevanceSort(list); // Featured boosted here only — and always labeled
    }
  }, [city, specialty, q, symptomNote, maxFee, minRating, maxDist, gender, language, todayOnly, sort, cityCenter]);

  return (
    <div className="container-page animate-fadeUp py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors in {city}</h1>
          <p className="text-sm text-slate-500">{results.length} result{results.length === 1 ? "" : "s"} · fees & availability shown upfront</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-sm text-slate-500">Sort</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
            <option value="relevance">Relevance</option>
            <option value="rating">Highest rated</option>
            <option value="feeLow">Fee: low → high</option>
            <option value="feeHigh">Fee: high → low</option>
            <option value="distance">Nearest first</option>
          </select>
          <div className="flex overflow-hidden rounded-lg border border-slate-300" role="tablist" aria-label="View">
            <button role="tab" aria-selected={view === "list"} onClick={() => setView("list")} className={`px-3 py-2 text-sm font-medium ${view === "list" ? "bg-brand-600 text-white" : "bg-white text-slate-600"}`}>List</button>
            <button role="tab" aria-selected={view === "map"} onClick={() => setView("map")} className={`px-3 py-2 text-sm font-medium ${view === "map" ? "bg-brand-600 text-white" : "bg-white text-slate-600"}`}>Map</button>
          </div>
        </div>
      </div>

      {symptomNote && (
        <p className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-800">{symptomNote}</p>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-[280px,1fr]">
        {/* ---------- Filters ---------- */}
        <aside className="card h-fit p-5" aria-label="Filters">
          <p className="font-bold text-slate-900">Filters</p>

          <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="f-spec">Specialty</label>
          <select id="f-spec" value={specialty} onChange={(e) => { setSpecialty(e.target.value); setSymptomNote(null); }} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
            <option value="all">All specialties</option>
            {SPECIALTIES.map((s) => (
              <option key={s.key} value={s.key}>{s.name}</option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="f-fee">Max fee: <strong>{formatINR(maxFee)}</strong></label>
          <input id="f-fee" type="range" min={200} max={2500} step={50} value={maxFee} onChange={(e) => setMaxFee(+e.target.value)} className="mt-1 w-full accent-brand-600" />

          <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="f-dist">Within: <strong>{maxDist} km</strong></label>
          <input id="f-dist" type="range" min={2} max={15} step={1} value={maxDist} onChange={(e) => setMaxDist(+e.target.value)} className="mt-1 w-full accent-brand-600" />

          <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="f-rating">Min rating</label>
          <select id="f-rating" value={minRating} onChange={(e) => setMinRating(+e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
            <option value={0}>Any</option>
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
          </select>

          <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="f-gender">Doctor gender</label>
          <select id="f-gender" value={gender} onChange={(e) => setGender(e.target.value as typeof gender)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
            <option value="any">Any</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          <label className="mt-4 block text-sm font-medium text-slate-600" htmlFor="f-lang">Language</label>
          <select id="f-lang" value={language} onChange={(e) => setLanguage(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm">
            <option value="any">Any</option>
            {languages.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <label className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-600">
            <input type="checkbox" checked={todayOnly} onChange={(e) => setTodayOnly(e.target.checked)} className="h-4 w-4 accent-brand-600" />
            Available today
          </label>
        </aside>

        {/* ---------- Results ---------- */}
        {view === "map" ? (
          <div className="card h-[560px] overflow-hidden p-0">
            <MapView
              center={cityCenter}
              markers={results.map((d) => ({
                id: d.id, lat: d.lat, lng: d.lng,
                label: d.name, sub: `${d.specialty} · ${formatINR(d.fee)}`,
                href: `/doctor/${d.id}`, featured: d.featured,
              }))}
            />
          </div>
        ) : results.length === 0 ? (
          <EmptyState title="No doctors match these filters">Try widening the fee or distance range, or switch city from the top bar.</EmptyState>
        ) : (
          <div className="grid gap-4">
            {results.map((d) => (
              <DoctorCard key={d.id} d={d} distance={distanceKm(cityCenter.lat, cityCenter.lng, d.lat, d.lng)} onFav={() => setFavTick(favTick + 1)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DoctorCard({ d, distance, onFav }: { d: Doctor; distance: number; onFav: () => void }) {
  const [fav, setFav] = useState(false);
  useEffect(() => setFav(isFavorite(d.id)), [d.id]);

  return (
    <div className={`card flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${d.featured ? "border-amber-200" : ""}`}>
      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-brand-50 text-2xl" aria-hidden>
        {d.gender === "female" ? "👩‍⚕️" : "👨‍⚕️"}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/doctor/${d.id}`} className="font-bold text-slate-900 hover:text-brand-700">{d.name}</Link>
          {d.featured && <FeaturedBadge />}
          {d.verified && <VerifiedBadge />}
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{d.specialty} · {d.qualifications} · {d.experienceYears} yrs exp</p>
        <p className="mt-0.5 text-sm text-slate-400">{d.clinicName} · {distance} km away</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <Stars rating={d.rating} count={d.reviewCount} />
          <span className="text-slate-500">Speaks: {d.languages.join(", ")}</span>
          {d.availableToday ? (
            <span className="font-medium text-emerald-700">● {d.nextSlot}</span>
          ) : (
            <span className="text-slate-400">Next: {d.nextSlot}</span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-2">
        <p className="text-lg font-extrabold text-slate-900">{formatINR(d.fee)}</p>
        <div className="flex gap-2">
          <button
            aria-label={fav ? "Remove from favorites" : "Save to favorites"}
            onClick={() => {
              const now = toggleFavorite({ id: d.id, kind: "doctor", name: d.name, detail: d.specialty, city: d.city });
              setFav(now);
              onFav();
            }}
            className={`rounded-xl border px-3 py-2 text-sm ${fav ? "border-rose-300 bg-rose-50 text-rose-600" : "border-slate-300 text-slate-500 hover:border-rose-300"}`}
          >
            {fav ? "♥" : "♡"}
          </button>
          <Link href={`/doctor/${d.id}`} className="btn-primary">View & Book</Link>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container-page py-16 text-center text-slate-500">Loading search…</div>}>
      <SearchInner />
    </Suspense>
  );
}
