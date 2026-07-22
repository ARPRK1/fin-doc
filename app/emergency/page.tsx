"use client";
/**
 * Emergency & Ambulance.
 * SAFETY FIRST: 108 (free government ambulance) is the most prominent action on
 * this page, above all private options. Private ambulance booking is a
 * simulation with fully transparent pricing (base fare + per-km).
 */
import { useEffect, useMemo, useState } from "react";
import { ambulances, formatINR, relevanceSort } from "@/lib/data";
import { getCity } from "@/lib/storage";
import { EmptyState, FeaturedBadge, Stars, VerifiedBadge } from "@/components/ui";
import BookingModal from "@/components/BookingModal";
import type { AmbulanceService, AmbulanceType } from "@/lib/types";

export default function EmergencyPage() {
  const [city, setCity] = useState("Mumbai");
  const [booking, setBooking] = useState<{ svc: AmbulanceService; type: AmbulanceType } | null>(null);

  useEffect(() => {
    setCity(getCity());
    const refresh = () => setCity(getCity());
    window.addEventListener("finddoc:storage", refresh);
    return () => window.removeEventListener("finddoc:storage", refresh);
  }, []);

  const services = useMemo(() => relevanceSort(ambulances.filter((a) => a.city === city)), [city]);

  return (
    <div className="animate-fadeUp">
      {/* ---------- 108 hero: always first, impossible to miss ---------- */}
      <section className="bg-red-600">
        <div className="container-page py-10 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-widest text-red-100">Medical emergency?</p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">Call 108 first</h1>
          <p className="mx-auto mt-2 max-w-xl text-red-100">
            108 is India&apos;s free, government-run emergency ambulance service. Available 24×7 in every state. No charges, no app needed.
          </p>
          <a
            href="tel:108"
            className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-4 text-2xl font-extrabold text-red-700 shadow-lg transition hover:scale-[1.02]"
          >
            📞 108
          </a>
          <p className="mt-4 text-xs text-red-200">
            Other helplines: 102 (pregnancy & child ambulance) · 112 (all-in-one emergency)
          </p>
        </div>
      </section>

      {/* ---------- Private ambulances ---------- */}
      <section className="container-page py-10">
        <h2 className="text-2xl font-bold text-slate-900">Private ambulances in {city}</h2>
        <p className="mt-1 text-sm text-slate-500">
          For planned transfers, discharges, or when you prefer a private service. Transparent pricing: base fare + per-km. Booking via FindDoc is free for patients.
        </p>

        {services.length === 0 ? (
          <div className="mt-6"><EmptyState title="No private services listed in this city yet">Call 108 for emergencies — it works everywhere in India.</EmptyState></div>
        ) : (
          <div className="mt-6 grid gap-4">
            {services.map((a) => (
              <div key={a.id} className={`card p-5 ${a.featured ? "border-amber-200" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">{a.name}</p>
                      {a.featured && <FeaturedBadge />}
                      {a.verified && <VerifiedBadge />}
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {a.coverage} · ETA ~{a.etaMinutes} min {a.gpsTracked && "· GPS tracked"} {a.available24x7 && "· 24×7"}
                    </p>
                    <div className="mt-1"><Stars rating={a.rating} count={a.reviewCount} /></div>
                  </div>
                  <a href={`tel:${a.phone.replace(/\s/g, "")}`} className="btn-danger">📞 Call now</a>
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {a.types.map((t) => (
                    <div key={t.type} className="rounded-xl border border-slate-200 p-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-800">{t.type}</p>
                        <button
                          onClick={() => setBooking({ svc: a, type: t })}
                          className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-700"
                        >
                          Book
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
                        {formatINR(t.baseFare)} base + {formatINR(t.perKm)}/km
                      </p>
                      <p className="mt-1 text-xs text-slate-400">{t.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <strong>Important:</strong> For any life-threatening situation (chest pain, unconsciousness, severe bleeding,
          difficulty breathing, stroke symptoms), call <a className="font-bold underline" href="tel:108">108</a> immediately
          instead of booking online. Private booking here is a simulation for planned, non-critical transport.
        </p>
      </section>

      {booking && (
        <BookingModal
          open={!!booking}
          onClose={() => setBooking(null)}
          kind="ambulance"
          providerId={booking.svc.id}
          providerName={booking.svc.name}
          detail={booking.type.type}
          city={booking.svc.city}
          amount={booking.type.baseFare}
          slots={["As soon as possible", "Within 1 hour", "Today evening", "Tomorrow morning"]}
        />
      )}
    </div>
  );
}
