"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { CITIES } from "@/lib/data";
import { getBookings, getCity, setCity } from "@/lib/storage";
import { useLang } from "@/lib/i18n";

export default function Header() {
  const pathname = usePathname();
  const { lang, setLang, t } = useLang();
  const [city, setCityState] = useState("Mumbai");
  const [bookingCount, setBookingCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setCityState(getCity());
      setBookingCount(getBookings().filter((b) => b.status === "confirmed").length);
    };
    refresh();
    window.addEventListener("finddoc:storage", refresh);
    return () => window.removeEventListener("finddoc:storage", refresh);
  }, []);

  const nav: { href: string; label: string; danger?: boolean }[] = [
    { href: "/search", label: t("doctors") },
    { href: "/hospitals", label: t("hospitals") },
    { href: "/diagnostics", label: t("diagnostics") },
    { href: "/emergency", label: t("emergency"), danger: true },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2" aria-label="FindDoc India — home">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-lg font-bold text-white">+</span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            FindDoc <span className="text-brand-600">India</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname.startsWith(n.href)
                  ? "bg-brand-50 text-brand-700"
                  : n.danger
                    ? "text-red-600 hover:bg-red-50"
                    : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* City selector (location detection fallback lives on the homepage) */}
          <label className="sr-only" htmlFor="city-select">
            Select city
          </label>
          <select
            id="city-select"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              setCityState(e.target.value);
            }}
            className="hidden rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm sm:block"
          >
            {CITIES.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
            aria-label="Switch language"
          >
            {lang === "en" ? "हिं" : "EN"}
          </button>

          <Link href="/bookings" className="relative rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
            {t("myBookings")}
            {bookingCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {bookingCount}
              </span>
            )}
          </Link>

          <button
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-slate-200 bg-white px-4 py-2 md:hidden" aria-label="Mobile navigation">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              onClick={() => setMenuOpen(false)}
              className={`block rounded-lg px-3 py-2.5 text-sm font-medium ${n.danger ? "text-red-600" : "text-slate-700"} hover:bg-slate-50`}
            >
              {n.label}
            </Link>
          ))}
          <div className="px-3 py-2">
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                setCityState(e.target.value);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm"
              aria-label="Select city"
            >
              {CITIES.map((c) => (
                <option key={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </nav>
      )}
    </header>
  );
}
