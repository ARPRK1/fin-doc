"use client";
/**
 * My Bookings, Favorites and a basic patient profile.
 * All data stays on the user's device (localStorage) — private by default.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatINR } from "@/lib/data";
import {
  cancelBooking, getBookings, getFavorites, getProfile, saveProfile, toggleFavorite, type Profile,
} from "@/lib/storage";
import { EmptyState, SectionTitle } from "@/components/ui";
import type { Booking, Favorite } from "@/lib/types";

const KIND_ICON: Record<Booking["kind"], string> = { doctor: "🩺", diagnostic: "🧪", ambulance: "🚑" };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [profile, setProfile] = useState<Profile>({ name: "", phone: "", city: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setBookings(getBookings());
      setFavorites(getFavorites());
    };
    refresh();
    setProfile(getProfile());
    window.addEventListener("finddoc:storage", refresh);
    return () => window.removeEventListener("finddoc:storage", refresh);
  }, []);

  const favHref = (f: Favorite) => (f.kind === "doctor" ? `/doctor/${f.id}` : f.kind === "hospital" ? `/hospital/${f.id}` : `/lab/${f.id}`);

  return (
    <div className="container-page animate-fadeUp py-8">
      <SectionTitle sub="Everything here is stored privately on your device — no account needed.">My Bookings</SectionTitle>

      {bookings.length === 0 ? (
        <EmptyState title="No bookings yet">
          Find a <Link href="/search" className="text-brand-700 underline">doctor</Link>, book a{" "}
          <Link href="/diagnostics" className="text-brand-700 underline">test</Link>, or arrange an{" "}
          <Link href="/emergency" className="text-brand-700 underline">ambulance</Link>.
        </EmptyState>
      ) : (
        <div className="grid gap-3">
          {bookings.map((b) => (
            <div key={b.id} className={`card flex flex-wrap items-center justify-between gap-3 p-4 ${b.status === "cancelled" ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-xl" aria-hidden>{KIND_ICON[b.kind]}</span>
                <div>
                  <p className="font-semibold text-slate-900">{b.providerName}</p>
                  <p className="text-sm text-slate-500">{b.detail} · {b.city} · {b.slot}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {b.amount !== null && <span className="text-sm font-bold text-slate-800">{formatINR(b.amount)}</span>}
                {b.status === "confirmed" ? (
                  <>
                    <span className="chip bg-emerald-50 text-emerald-700 border border-emerald-200">Confirmed</span>
                    <button onClick={() => cancelBooking(b.id)} className="text-sm font-medium text-red-600 hover:underline">Cancel</button>
                  </>
                ) : (
                  <span className="chip bg-slate-100 text-slate-500">Cancelled</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12">
        <SectionTitle>Favorites</SectionTitle>
        {favorites.length === 0 ? (
          <EmptyState title="No favorites saved">Tap the ♡ on any doctor, hospital or lab to save it here.</EmptyState>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((f) => (
              <div key={f.id} className="card flex items-center justify-between gap-2 p-4">
                <Link href={favHref(f)} className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 hover:text-brand-700">{f.name}</p>
                  <p className="truncate text-sm text-slate-500">{f.detail} · {f.city}</p>
                </Link>
                <button
                  onClick={() => toggleFavorite(f)}
                  aria-label="Remove favorite"
                  className="shrink-0 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-sm text-rose-600"
                >
                  ♥
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 max-w-md">
        <SectionTitle sub="Used to pre-fill bookings. Never leaves your device in this demo.">Patient profile</SectionTitle>
        <div className="card grid gap-3 p-5">
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Full name" aria-label="Full name" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
          <input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="Mobile number" aria-label="Mobile number" inputMode="numeric" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
          <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="City" aria-label="City" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
          <button
            onClick={() => {
              saveProfile(profile);
              setSaved(true);
              setTimeout(() => setSaved(false), 2000);
            }}
            className="btn-primary"
          >
            {saved ? "✓ Saved" : "Save profile"}
          </button>
        </div>
      </div>
    </div>
  );
}
