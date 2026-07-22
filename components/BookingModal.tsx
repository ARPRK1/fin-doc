"use client";
/**
 * Booking simulation modal (no real payment yet — see README roadmap for
 * Razorpay integration). Bookings are stored locally on the device.
 *
 * Monetization transparency: the small facilitation fee note is shown to the
 * patient, and the provider-side commission model is explained on /partners.
 */
import { useState } from "react";
import { addBooking } from "@/lib/storage";
import { formatINR } from "@/lib/data";
import type { Booking } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  kind: Booking["kind"];
  providerId: string;
  providerName: string;
  detail: string;
  city: string;
  amount: number | null;
  slots: string[];
}

export default function BookingModal({ open, onClose, kind, providerId, providerName, detail, city, amount, slots }: Props) {
  const [slot, setSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  function confirm() {
    if (!slot) return setError("Please pick a slot.");
    if (name.trim().length < 2) return setError("Please enter the patient's name.");
    if (!/^[6-9]\d{9}$/.test(phone.trim())) return setError("Please enter a valid 10-digit Indian mobile number.");
    addBooking({ kind, providerId, providerName, detail, city, slot, amount });
    setDone(true);
    setError(null);
  }

  function close() {
    setDone(false);
    setSlot(null);
    setError(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" role="dialog" aria-modal="true" aria-label="Booking">
      <div className="card w-full max-w-md animate-fadeUp p-6">
        {done ? (
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-3xl">✓</span>
            <h3 className="mt-4 text-lg font-bold text-slate-900">Booking confirmed (simulation)</h3>
            <p className="mt-2 text-sm text-slate-500">
              {providerName} · {detail}
              <br />
              {slot}
            </p>
            <p className="mt-3 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
              This is a demo booking saved on your device. In production you would receive an SMS confirmation, and the
              provider would confirm the slot.
            </p>
            <button onClick={close} className="btn-primary mt-5 w-full">Done — view in My Bookings</button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Book: {providerName}</h3>
                <p className="text-sm text-slate-500">{detail} · {city}</p>
              </div>
              <button onClick={close} aria-label="Close" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">✕</button>
            </div>

            <p className="mt-4 text-sm font-semibold text-slate-700">Choose a slot</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {slots.map((s) => (
                <button
                  key={s}
                  onClick={() => setSlot(s)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    slot === s ? "border-brand-600 bg-brand-50 font-semibold text-brand-700" : "border-slate-300 text-slate-600 hover:border-brand-400"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3">
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Patient name" aria-label="Patient name" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Mobile number (10 digits)" aria-label="Mobile number" inputMode="numeric" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            </div>

            {amount !== null && (
              <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 p-3 text-sm">
                <span className="text-slate-600">Payable at {kind === "diagnostic" ? "lab" : kind === "ambulance" ? "pickup" : "clinic"}</span>
                <span className="font-bold text-slate-900">{formatINR(amount)}</span>
              </div>
            )}
            {/* Transparent facilitation-fee note (platform revenue) */}
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              Booking via FindDoc is free for you today. Providers pay a small facilitation fee on confirmed bookings —
              this keeps the platform free and unbiased for patients. <a href="/partners" className="underline">Learn how we make money</a>.
            </p>

            {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}

            <button onClick={confirm} className="btn-primary mt-4 w-full">Confirm booking</button>
          </>
        )}
      </div>
    </div>
  );
}
