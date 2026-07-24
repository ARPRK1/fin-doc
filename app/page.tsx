"use client";
/**
 * Homepage — calm, premium, mobile-first.
 * Free core experience: search, categories, emergency access, trust signals.
 * Monetization on this page is limited to a clearly-labeled "Featured" strip.
 */
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CITIES, doctors, distanceKm, formatINR } from "@/lib/data";
import { getCity, setCity } from "@/lib/storage";
import { useLang } from "@/lib/i18n";
import { FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";

const CATEGORIES = [
  { href: "/search", icon: "🩺", key: "doctors", desc: "Compare fees, experience & availability", color: "bg-brand-50" },
  { href: "/hospitals", icon: "🏥", key: "hospitals", desc: "Multi-speciality to neighbourhood clinics", color: "bg-sky-50" },
  { href: "/diagnostics", icon: "🧪", key: "diagnostics", desc: "Book tests & home sample collection", color: "bg-violet-50" },
  { href: "/emergency", icon: "🚑", key: "emergency", desc: "108 + private ambulances, transparent pricing", color: "bg-red-50" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const { t } = useLang();
  const [query, setQuery] = useState("");
  const [city, setCityState] = useState("Mumbai");
  const [locating, setLocating] = useState(false);
  const [locMsg, setLocMsg] = useState<string | null>(null);

  useEffect(() => {
    setCityState(getCity());
    const refresh = () => setCityState(getCity());
    window.addEventListener("finddoc:storage", refresh);
    return () => window.removeEventListener("finddoc:storage", refresh);
  }, []);

  /** Detect nearest supported city from browser geolocation. */
  function detectLocation() {
    if (!navigator.geolocation) {
      setLocMsg("Location not supported on this device — please pick your city.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const nearest = [...CITIES].sort(
          (a, b) => distanceKm(latitude, longitude, a.lat, a.lng) - distanceKm(latitude, longitude, b.lat, b.lng)
        )[0];
        setCity(nearest.name);
        setCityState(nearest.name);
        setLocMsg(`Showing results for ${nearest.name} (nearest supported city).`);
        setLocating(false);
      },
      () => {
        setLocMsg("Couldn't access location — please pick your city from the menu.");
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
  }

  const featured = useMemo(() => doctors.filter((d) => d.featured && d.city === city).slice(0, 3), [city]);

  return (
    <div className="animate-fadeUp">
      {/* ---------- Hero ---------- */}
      <section className="bg-gradient-to-b from-brand-50 via-white to-slate-50">
        <div className="container-page py-14 text-center sm:py-20">
          <p className="mx-auto mb-4 w-fit rounded-full border border-brand-200 bg-white px-4 py-1 text-xs font-semibold text-brand-700">
            {t("freeAlways")} · No hidden charges · No paywalled information
          </p>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            {t("tagline")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg">{t("subtitle")}</p>

          {/* Smart search */}
          <form onSubmit={submitSearch} className="mx-auto mt-8 flex max-w-2xl gap-2" role="search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              aria-label="Search"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm shadow-sm placeholder:text-slate-400"
            />
            <button type="submit" className="btn-primary shrink-0 px-6">Search</button>
          </form>
          <p className="mx-auto mt-2 max-w-2xl text-xs text-slate-400">
            Searching by symptom? We only match you to relevant specialties — we never diagnose. {t("emergencyNote")}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-sm">
            <button onClick={detectLocation} className="btn-secondary" disabled={locating}>
              {locating ? "Detecting…" : `📍 Use my location`}
            </button>
            <span className="text-slate-500">
              Currently browsing: <strong className="text-slate-800">{city}</strong>
            </span>
          </div>
          {locMsg && <p className="mt-2 text-xs text-brand-700">{locMsg}</p>}
        </div>
      </section>

      {/* ---------- Category cards ---------- */}
      <section className="container-page -mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`card group p-5 transition hover:-translate-y-0.5 hover:shadow-md ${c.key === "emergency" ? "border-red-200" : ""}`}
          >
            <span className={`grid h-12 w-12 place-items-center rounded-xl text-2xl ${c.color}`} aria-hidden>{c.icon}</span>
            <p className={`mt-3 font-bold ${c.key === "emergency" ? "text-red-700" : "text-slate-900"}`}>{t(c.key)}</p>
            <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
            <p className="mt-3 text-sm font-semibold text-brand-700 opacity-0 transition group-hover:opacity-100">Explore →</p>
          </Link>
        ))}
      </section>

      {/* ---------- Trust bar ---------- */}
      {/* Honesty note: this is a demo build. Counts describe the sample dataset,
          not a live, verified provider network — never claim "Verified" here. */}
      <section className="container-page mt-12">
        <div className="card grid grid-cols-2 gap-6 p-6 text-center sm:grid-cols-4">
          {[
            ["88+", "Sample doctor profiles"],
            ["24", "Sample hospitals & clinics"],
            ["16", "Sample diagnostic labs"],
            ["24×7", "Real: 108 emergency access"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="text-2xl font-extrabold text-brand-700">{n}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{l}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">
          This is a product demo. Provider listings are illustrative sample data, not a live directory of real,
          verified doctors — only the 108 emergency number is real. Details on{" "}
          <Link href="/partners" className="underline">/partners</Link>.
        </p>
      </section>

      {/* ---------- Featured (paid, labeled) ---------- */}
      {featured.length > 0 && (
        <section className="container-page mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Featured doctors in {city}</h2>
            <span className="text-xs text-slate-400">Providers pay for this placement · always labeled</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {featured.map((d) => (
              <Link key={d.id} href={`/doctor/${d.id}`} className="card p-5 transition hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">{d.name}</p>
                    <p className="text-sm text-slate-500">{d.specialty} · {d.experienceYears} yrs</p>
                  </div>
                  <FeaturedBadge />
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <Stars rating={d.rating} count={d.reviewCount} />
                  <span className="font-semibold text-slate-800">{formatINR(d.fee)}</span>
                </div>
                <p className="mt-2 text-xs text-slate-400">{d.area}, {d.city}</p>
                {d.verified && <div className="mt-2"><VerifiedBadge /></div>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className="container-page mt-14">
        <h2 className="text-center text-2xl font-bold text-slate-900">{t("howItWorks")}</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["1", "Search & compare", "Filter by distance, fee, rating, language and availability — all information is free and open."],
            ["2", "Check real details", "Qualifications, transparent fees, timings and genuine patient reviews on every profile."],
            ["3", "Book or call", "Book a slot in seconds or call the clinic directly. Emergency? One tap to 108."],
            ["4", "Manage everything", "Your bookings and favorite providers, saved privately on your device."],
          ].map(([n, title, desc]) => (
            <div key={n} className="card p-5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">{n}</span>
              <p className="mt-3 font-bold text-slate-900">{title}</p>
              <p className="mt-1 text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Emergency band ---------- */}
      <section className="container-page mt-14">
        <div className="card flex flex-col items-center justify-between gap-4 border-red-200 bg-red-50 p-6 sm:flex-row">
          <div>
            <p className="text-lg font-bold text-red-800">Medical emergency?</p>
            <p className="text-sm text-red-700">{t("emergencyNote")}</p>
          </div>
          <div className="flex gap-3">
            <a href="tel:108" className="btn-danger text-base">📞 Call 108 now</a>
            <Link href="/emergency" className="btn-secondary border-red-300 text-red-700 hover:bg-red-100">Private ambulances</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
