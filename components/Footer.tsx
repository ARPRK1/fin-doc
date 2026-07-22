"use client";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      {/* Safety disclaimer — always visible, non-negotiable */}
      <div className="border-b border-slate-100 bg-slate-50">
        <p className="container-page py-4 text-center text-xs leading-relaxed text-slate-500">{t("disclaimer")}</p>
      </div>

      <div className="container-page grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-slate-900">
            FindDoc <span className="text-brand-600">India</span>
          </p>
          <p className="mt-2 text-sm text-slate-500">
            A calm, trustworthy way to discover and connect with healthcare near you. {t("freeAlways")}.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">Discover</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link className="hover:text-brand-700" href="/search">Find Doctors</Link></li>
            <li><Link className="hover:text-brand-700" href="/hospitals">Hospitals & Clinics</Link></li>
            <li><Link className="hover:text-brand-700" href="/diagnostics">Diagnostics & Labs</Link></li>
            <li><Link className="hover:text-red-600" href="/emergency">Emergency & Ambulance</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">You</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li><Link className="hover:text-brand-700" href="/bookings">My Bookings & Favorites</Link></li>
            <li><Link className="hover:text-brand-700" href="/#how-it-works">How it works</Link></li>
          </ul>
        </div>

        {/* Transparency: how the platform sustains itself */}
        <div>
          <p className="text-sm font-semibold text-slate-900">How we make money</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            FindDoc is free for patients — always. We earn from healthcare providers: optional{" "}
            <span className="font-medium text-amber-700">Featured</span> placements (always labeled) and a small,
            transparent fee on bookings made through the platform. Paid placement never changes ratings, reviews, or
            the order you choose to sort by.
          </p>
          <Link href="/partners" className="mt-3 inline-block text-sm font-semibold text-brand-700 hover:underline">
            {t("partners")} →
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-slate-400 sm:flex-row">
          <p>© 2026 FindDoc India. Demo project — all providers are fictional.</p>
          <p>
            Medical emergency? <a href="tel:108" className="font-bold text-red-600">Call 108</a> (free, 24×7, all-India)
          </p>
        </div>
      </div>
    </footer>
  );
}
