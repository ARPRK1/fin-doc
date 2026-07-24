"use client";
/**
 * "For Healthcare Partners" — the transparent monetization page.
 * Explains exactly how FindDoc sustains itself without compromising patients:
 *  1. Free basic listings for every provider.
 *  2. Optional Featured placement (always labeled to patients).
 *  3. Small facilitation fee / commission on confirmed bookings.
 * Payment/dashboard flows are placeholders — see README roadmap (Razorpay etc.).
 */
import { useState } from "react";
import { SectionTitle } from "@/components/ui";

const PLANS = [
  {
    name: "Basic Listing",
    price: "Free forever",
    highlight: false,
    features: [
      "Full profile: qualifications, fees, timings, photos",
      "Appear in all relevant patient searches",
      "Receive bookings and calls",
      "Patient reviews & ratings",
    ],
    cta: "List your practice",
  },
  {
    name: "Featured",
    price: "₹1,999 / month",
    highlight: true,
    features: [
      "Everything in Basic",
      "Priority placement in relevant searches (always labeled “Featured”)",
      "Featured strip on the city homepage",
      "Profile analytics: views, calls & booking leads",
    ],
    cta: "Get Featured",
  },
  {
    name: "Clinic Suite",
    price: "₹4,999 / month",
    highlight: false,
    features: [
      "Everything in Featured, for up to 5 practitioners",
      "Appointment management dashboard (coming soon)",
      "Bulk listing management for chains",
      "Priority support",
    ],
    cta: "Talk to us",
  },
];

/**
 * Lead capture destination. No backend / no form service needed: the form
 * opens the sender's email client pre-filled to this address. Reliable
 * everywhere; the rep or doctor just taps send. Change this one constant to
 * re-route leads (e.g. to a dedicated ops inbox later).
 */
const LEADS_EMAIL = "rp271187@gmail.com";

export default function PartnersPage() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    org: "",
    phone: "",
    city: "Hyderabad",
    area: "",
    type: "Doctor / Clinic",
    consent: false,
  });

  function submitLead(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setErr("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    if (!form.consent) {
      setErr("Please tick the consent box so we can list your practice.");
      return;
    }
    // Build a pre-filled email with the lead details.
    const subject = `New FindDoc listing: ${form.org || form.name} (${form.city})`;
    const body = [
      `New provider listing request via FindDoc India`,
      ``,
      `Name: ${form.name}`,
      `Practice / hospital / lab: ${form.org}`,
      `Type: ${form.type}`,
      `City: ${form.city}`,
      `Area / locality: ${form.area || "-"}`,
      `Mobile: ${form.phone}`,
      `Consent to list & be contacted: Yes`,
      ``,
      `— Sent from finddoc-india.netlify.app/partners`,
    ].join("\n");
    window.location.href = `mailto:${LEADS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <div className="container-page animate-fadeUp py-10">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">For Healthcare Partners</h1>
        <p className="mt-3 text-slate-600">
          FindDoc is free for patients — always. The platform is funded by healthcare providers who choose optional
          visibility and get bookings through us. Here is exactly how it works, in plain language.
        </p>
      </div>

      {/* How we make money — plain and honest */}
      <section className="card mx-auto mt-8 max-w-3xl p-6">
        <SectionTitle>How FindDoc makes money</SectionTitle>
        <ol className="grid gap-4 text-sm text-slate-600">
          <li className="rounded-xl bg-slate-50 p-4">
            <strong className="text-slate-900">1. Featured placements.</strong> Providers can pay for higher visibility in
            relevant searches. Every paid placement carries a visible <span className="chip bg-amber-100 text-amber-800 border border-amber-200">★ Featured</span> label,
            and it never changes ratings, reviews, or any sort order the patient explicitly chooses (price, rating, distance).
          </li>
          <li className="rounded-xl bg-slate-50 p-4">
            <strong className="text-slate-900">2. Booking facilitation fee.</strong> When a patient books through FindDoc,
            the provider pays a small fee — a flat ₹50–₹200 per confirmed appointment (or 5–10% of the consultation fee for
            higher-value services). Patients never pay extra for booking through us.
          </li>
          <li className="rounded-xl bg-slate-50 p-4">
            <strong className="text-slate-900">3. Subscriptions (roadmap).</strong> Clinic tools — analytics, appointment
            management, bulk listings — as an optional monthly plan.
          </li>
        </ol>
        <p className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-800">
          <strong>Our neutrality promise:</strong> money never buys a better rating, hides a cheaper alternative, or removes
          a competitor. Critical information — fees, timings, emergency numbers — is never behind a paywall.
        </p>
      </section>

      {/* Plans */}
      <section className="mt-10">
        <h2 className="text-center text-2xl font-bold text-slate-900">Partner plans</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div key={p.name} className={`card p-6 ${p.highlight ? "border-brand-400 ring-1 ring-brand-400" : ""}`}>
              {p.highlight && <p className="mb-2 w-fit rounded-full bg-brand-600 px-3 py-0.5 text-xs font-bold text-white">Most popular</p>}
              <p className="text-lg font-bold text-slate-900">{p.name}</p>
              <p className="mt-1 text-2xl font-extrabold text-brand-700">{p.price}</p>
              <ul className="mt-4 grid gap-2 text-sm text-slate-600">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><span className="text-brand-600">✓</span>{f}</li>
                ))}
              </ul>
              <button onClick={() => document.getElementById("partner-form")?.scrollIntoView({ behavior: "smooth" })} className={`mt-5 w-full ${p.highlight ? "btn-primary" : "btn-secondary"}`}>
                {p.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-slate-400">Prices are placeholders for the demo. Online payment (Razorpay) and a provider dashboard are on the roadmap.</p>
      </section>

      {/* Lead form — live capture via Netlify Forms (name: provider-signup) */}
      <section id="partner-form" className="card mx-auto mt-10 max-w-xl p-6">
        <h2 className="text-xl font-bold text-slate-900">List your practice</h2>
        <p className="mt-1 text-sm text-slate-500">
          Free to join. Tell us about your practice and our team will verify your registration
          (medical council / NABH / NABL) and set up your listing.
        </p>
        {sent ? (
          <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            ✓ Almost done! Your email app should have opened with your details filled in — just press <strong>Send</strong>.
            If nothing opened, email us directly at{" "}
            <a href={`mailto:${LEADS_EMAIL}`} className="underline">{LEADS_EMAIL}</a>. We&apos;ll verify and set up your
            free listing within 2 working days.
          </div>
        ) : (
          <form className="mt-4 grid gap-3" onSubmit={submitLead}>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" aria-label="Your name" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            <input required value={form.org} onChange={(e) => setForm({ ...form, org: e.target.value })} placeholder="Practice / hospital / lab name" aria-label="Organisation" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Mobile number (10 digits)" aria-label="Mobile number" inputMode="numeric" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            <div className="grid grid-cols-2 gap-3">
              <input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" aria-label="City" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
              <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Area / locality" aria-label="Area" className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm" />
            </div>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} aria-label="Provider type" name="provider_type" className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm">
              <option>Doctor / Clinic</option>
              <option>Hospital</option>
              <option>Diagnostic Lab</option>
              <option>Ambulance Service</option>
            </select>
            <label className="flex items-start gap-2 text-xs text-slate-500">
              <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} className="mt-0.5 h-4 w-4 accent-brand-600" />
              I&apos;m authorised to list this practice and consent to FindDoc contacting me and publishing these
              details (name, specialty, address, fees, timings) on the platform.
            </label>
            {err && <p className="text-sm font-medium text-red-600">{err}</p>}
            <button type="submit" className="btn-primary">Request free listing</button>
            <p className="text-xs text-slate-400">
              We only ever publish practice/professional details you provide with consent — never scraped data.
            </p>
          </form>
        )}
      </section>
    </div>
  );
}
