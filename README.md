# FindDoc India 🩺

**A calm, trustworthy, one-stop healthcare discovery platform for India.**

FindDoc helps any patient or caregiver instantly discover, compare and connect with nearby doctors, hospitals & clinics, diagnostic labs and ambulance services — with transparent fees, real availability, genuine reviews and one-tap emergency access. Fast, empathetic, and **completely free for patients**.

> ⚠️ **Medical disclaimer (non-negotiable):** FindDoc is an information and discovery platform only. It does **not** provide medical advice, diagnosis, or treatment. Always verify details directly with providers. **In emergencies, call 108 immediately** — it is India's free, 24×7 government ambulance service.

---

## ✨ Features

### For patients (100% free, forever)
- **Premium calming homepage** — location detection (nearest supported city), smart search with symptom-to-specialty routing (with a clear "not a diagnosis" disclaimer), category cards, trust bar, and "How it works".
- **Doctor search & discovery** — 88+ doctors across 8 major cities (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad) with powerful filters: specialty, max fee, distance, rating, gender, language, available-today. Sort by relevance, rating, fee, or distance. Card list **and interactive Leaflet/OpenStreetMap view**.
- **Rich profiles** — qualifications, experience, transparent consultation fees (realistic Indian market pricing by specialty & city tier), clinic timings, simulated real-time availability, patient reviews, mini-map, directions, call and booking CTAs.
- **Hospitals & clinics** — type and 24×7-emergency filters, bed counts, facilities, specialties, map view.
- **Diagnostics** — test search across labs, price comparison (with MRP strike-throughs), NABL badges, home sample collection, slot booking simulation.
- **Emergency & ambulance** — **108 is always the most prominent action**, followed by private ambulance listings with fully transparent pricing (base fare + per-km) by type (BLS / ALS / ICU / patient transport), ETA, and booking simulation.
- **My Bookings & Favorites** — booking simulation with validation, cancellations, favorites, and a basic patient profile. All stored privately in `localStorage`; no account needed.
- **Polish** — mobile-first responsive UI, subtle animations, accessible focus states and ARIA labels, English + Hindi language toggle (i18n foundation ready for more languages), PWA manifest, healthcare color system (teal = trust, amber = sponsored only, red = emergency only).

### For providers (how the platform sustains itself)
- Free basic listings, clearly-labeled **★ Featured** paid placements, and a small facilitation fee on confirmed bookings. Full details below and on the in-app **[/partners](./app/partners/page.tsx)** page.

---

## 🚀 Run locally

```bash
npm install
npm run dev        # data is auto-generated before dev/build
# open http://localhost:3000
```

Production build:

```bash
npm run build
npm start
```

**Deploy** — the app is a standard Next.js 15 project:
- **Vercel (recommended):** import the GitHub repo → framework auto-detected → Deploy. Zero config.
- **Netlify:** build command `npm run build`, uses the official Next runtime automatically.

### Dataset
Realistic provider data (88 doctors, 24 hospitals, 16 labs, 16 ambulance services) is generated deterministically into `data/*.json` by `scripts/generate-data.mjs` (runs automatically via `predev`/`prebuild`, or manually with `npm run generate-data`). Fees reflect researched Indian market ranges (e.g., General Physician ₹300–700, Cardiologist ₹800–1,800 in tier-1 metros; CBC ₹250–400; BLS ambulance ₹800–1,500 base + ₹20–35/km). **All providers are fictional** — production would onboard real, verified providers.

---

## 💰 Business model & monetization (sustainable + ethical)

Modeled on what works for Indian healthtech (Practo's provider subscriptions & booking commissions, Tata 1mg's lab partnerships) **minus the aggressive tactics**. The core rule: *the patient experience stays free, complete, and neutral.*

### Revenue streams (implemented in UI today)
1. **Featured placements (primary)** — providers pay for higher visibility. Every paid placement carries a visible **★ Featured** badge (amber — a color reserved exclusively for sponsorship). Paid placement only affects the default "Relevance" order; **user-chosen sorts (price / rating / distance) are never altered**, and ratings/reviews can never be bought.
2. **Booking facilitation fee (commission)** — a flat ₹50–₹200 per confirmed appointment or 5–10% of consultation fee, paid by the provider. Patients pay nothing extra; this is disclosed inside the booking flow itself.
3. **Partner plans** — Basic (free) / Featured (₹1,999/mo) / Clinic Suite (₹4,999/mo, multi-practitioner + analytics + appointment tools). See `/partners`.

### Future streams (planned, in order of probability of revenue)
- Clinic/hospital SaaS subscriptions: profile analytics, lead management, appointment tooling.
- Diagnostic-lab and pharmacy partnerships (test bundles, medicine delivery — revenue share).
- Optional patient premium (ad-free, health-record storage, priority support) — **only after** core value is established; never gating existing free features.

### Transparency & trust rules (enforced in code)
- All sponsored content is explicitly labeled (`FeaturedBadge` component + amber map pins).
- "How we make money" is in the footer of every page and detailed on `/partners`.
- No paywalled information, no pay-to-hide-competitors, no bought ratings.
- Emergency features (108) are always free, prominent, and ahead of any monetized option.

---

## 🗺️ Roadmap
1. **Real backend** — PostgreSQL + Prisma, provider onboarding with medical-council / NABH / NABL verification.
2. **Payments** — Razorpay for provider subscriptions & booking commissions (Stripe for international cards).
3. **Provider dashboard** — listings, slots, leads, analytics.
4. **Real-time availability** — provider-updated slot inventory; SMS/WhatsApp confirmations.
5. **ABDM integration** — Ayushman Bharat Digital Mission health IDs & linked health records.
6. **More languages** — the i18n layer already supports adding dictionaries (Tamil, Telugu, Bengali, Marathi next).
7. **Live ambulance tracking** and verified partner SLAs.

---

## 🧱 Tech stack
Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS · Leaflet + OpenStreetMap (no API key) · localStorage persistence · PWA manifest. No backend required to run the demo.

```
app/            pages (home, search, doctor/[id], hospitals, hospital/[id],
                diagnostics, lab/[id], emergency, bookings, partners)
components/     Header, Footer, MapView, BookingModal, ui primitives
lib/            types, data access, storage, i18n (EN + HI)
data/           generated JSON datasets
scripts/        deterministic data generator
```

---

## ⚖️ Ethics & safety notes
- Strong disclaimers on every medical surface; symptom search routes to specialties only — it never diagnoses.
- 108/102/112 helplines surfaced prominently; the emergency page instructs users to call 108 for anything life-threatening rather than book online.
- Monetization never compromises neutrality — see the "neutrality promise" on `/partners`.
- This repository is a demo: all providers, reviews, and prices are simulated. Do not use it to make real healthcare decisions.
