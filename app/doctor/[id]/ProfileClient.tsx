"use client";
/** Rich doctor profile: qualifications, fees, timings, availability, reviews, map, booking. */
import Link from "next/link";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatINR, getDoctor } from "@/lib/data";
import { isFavorite, toggleFavorite } from "@/lib/storage";
import { EmptyState, FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";
import BookingModal from "@/components/BookingModal";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const SLOTS = ["Today 11:30 AM", "Today 5:00 PM", "Today 6:30 PM", "Tomorrow 10:00 AM", "Tomorrow 12:30 PM", "Tomorrow 6:00 PM"];

export default function DoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const d = getDoctor(id);
  const [open, setOpen] = useState(false);
  const [fav, setFav] = useState(false);
  useEffect(() => {
    if (d) setFav(isFavorite(d.id));
  }, [d]);

  if (!d) {
    return (
      <div className="container-page py-16">
        <EmptyState title="Doctor not found">
          <Link href="/search" className="text-brand-700 underline">Back to search</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="container-page animate-fadeUp py-8">
      <nav className="text-sm text-slate-400" aria-label="Breadcrumb">
        <Link href="/search" className="hover:text-brand-700">Doctors</Link> / <span className="text-slate-600">{d.name}</span>
      </nav>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1fr,340px]">
        <div className="grid gap-6">
          {/* Header card */}
          <section className={`card p-6 ${d.featured ? "border-amber-200" : ""}`}>
            <div className="flex flex-wrap items-start gap-4">
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-brand-50 text-4xl" aria-hidden>
                {d.gender === "female" ? "👩‍⚕️" : "👨‍⚕️"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{d.name}</h1>
                  {d.featured && <FeaturedBadge />}
                  {d.verified && <VerifiedBadge />}
                </div>
                <p className="mt-1 text-slate-600">{d.specialty} <span className="text-slate-400">({d.specialtyHi})</span></p>
                <p className="text-sm text-slate-500">{d.qualifications} · {d.experienceYears} years experience</p>
                <div className="mt-2"><Stars rating={d.rating} count={d.reviewCount} /></div>
              </div>
              <button
                aria-label={fav ? "Remove from favorites" : "Save to favorites"}
                onClick={() => setFav(toggleFavorite({ id: d.id, kind: "doctor", name: d.name, detail: d.specialty, city: d.city }))}
                className={`rounded-xl border px-3 py-2 ${fav ? "border-rose-300 bg-rose-50 text-rose-600" : "border-slate-300 text-slate-400 hover:border-rose-300"}`}
              >
                {fav ? "♥ Saved" : "♡ Save"}
              </button>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{d.about}</p>
            <p className="mt-3 text-xs text-slate-400">
              Information is provided by the clinic and verified periodically. Always confirm details when booking. This
              profile is not medical advice.
            </p>
          </section>

          {/* Details */}
          <section className="card grid gap-5 p-6 sm:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-slate-900">Clinic</p>
              <p className="mt-1 text-sm text-slate-600">{d.clinicName}</p>
              <p className="text-sm text-slate-500">{d.address}</p>
              <a
                href={`https://www.openstreetmap.org/directions?to=${d.lat}%2C${d.lng}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Get directions →
              </a>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Timings</p>
              <p className="mt-1 text-sm text-slate-600">{d.timings.days}</p>
              <p className="text-sm text-slate-500">{d.timings.slots}</p>
              <p className="mt-2 text-sm">
                {d.availableToday ? (
                  <span className="font-semibold text-emerald-700">● Available today — next slot {d.nextSlot}</span>
                ) : (
                  <span className="text-slate-500">Next available: {d.nextSlot}</span>
                )}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Languages</p>
              <p className="mt-1 text-sm text-slate-600">{d.languages.join(", ")}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Consultation fee</p>
              <p className="mt-1 text-xl font-extrabold text-slate-900">{formatINR(d.fee)}</p>
              <p className="text-xs text-slate-400">Payable at the clinic. No advance payment via FindDoc.</p>
            </div>
          </section>

          {/* Reviews */}
          <section className="card p-6">
            <h2 className="font-bold text-slate-900">Patient reviews</h2>
            <div className="mt-4 grid gap-4">
              {d.reviews.map((r, i) => (
                <div key={i} className="rounded-xl bg-slate-50 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-800">{r.author}</p>
                    <span className="text-xs text-slate-400">{r.date}</span>
                  </div>
                  <p className="text-xs text-amber-500" aria-label={`${r.rating} out of 5`}>{"★".repeat(r.rating)}</p>
                  <p className="mt-1 text-sm text-slate-600">{r.text}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-400">Reviews are from patients who booked via the platform (simulated for demo). Paid placement never affects reviews or ratings.</p>
          </section>
        </div>

        {/* Sticky booking column */}
        <aside className="h-fit lg:sticky lg:top-20">
          <div className="card p-6">
            <p className="text-sm text-slate-500">Consultation fee</p>
            <p className="text-3xl font-extrabold text-slate-900">{formatINR(d.fee)}</p>
            <button onClick={() => setOpen(true)} className="btn-primary mt-4 w-full text-base">Book Appointment</button>
            <a href={`tel:+911234567890`} className="btn-secondary mt-2 w-full">📞 Call clinic</a>
            <p className="mt-3 text-[11px] leading-relaxed text-slate-400">
              Booking is free for patients. Clinics pay a small facilitation fee on confirmed bookings — it keeps
              FindDoc free and neutral.
            </p>
          </div>
          <div className="card mt-4 h-56 overflow-hidden p-0">
            <MapView center={{ lat: d.lat, lng: d.lng }} zoom={14} markers={[{ id: d.id, lat: d.lat, lng: d.lng, label: d.name, sub: d.clinicName, featured: d.featured }]} />
          </div>
        </aside>
      </div>

      <BookingModal
        open={open}
        onClose={() => setOpen(false)}
        kind="doctor"
        providerId={d.id}
        providerName={d.name}
        detail={d.specialty}
        city={d.city}
        amount={d.fee}
        slots={SLOTS}
      />
    </div>
  );
}
