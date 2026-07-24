# FindDoc India — Hyderabad Pilot Playbook

The one job of the pilot: get **real doctors, clinics, diagnostic centres and ambulance services in Hyderabad to list themselves (for free)**, then get real Hyderabad patients using the site. Everything else (Featured plans, commissions, Razorpay, expansion) waits until this works in one city.

Live site: https://finddoc-india.netlify.app · Provider signup: https://finddoc-india.netlify.app/partners

---

## Why Hyderabad only (not all-India)

- Ground outreach (medical reps, sales agents) only works locally — a rep can visit 10 clinics in Banjara Hills, not 10,000 across India.
- A national site built from bulk/scraped data = thousands of thin, near-duplicate pages → Google SEO penalty → ranks for nothing.
- We can actually verify and support 50–200 providers in one city. We can't for the whole country.
- Win Hyderabad → prove patients book → then copy-paste the playbook to Pune, Bengaluru, etc.

---

## The legal/trust guardrail (non-negotiable)

**We do not scrape Google, Google Maps, Practo, or JustDial and republish provider data.** Reasons: it violates their terms (enforced), it breaches India's DPDP Act 2023 (publishing personal data without consent), and stale scraped data on a health site is a real-harm + trust problem.

**Every listing is consent-based.** The doctor (or a rep with their permission) submits details through the signup form, which records consent. That makes the data real, current, legally clean — and genuinely "verified," which is our whole promise.

Legitimate seed data (optional, to make the site look less empty early): openly-licensed government datasets on **data.gov.in** (health facilities) and **state Clinical Establishments registries**. These are public-hospital / facility lists, not private-doctor contact scraping — mark them clearly as "public listing, unclaimed."

---

## Supply: getting the first 30–50 real providers

### Target order (easiest yes → hardest)
1. **Solo GPs, dentists, dermatologists, physios** in mid-tier localities — hungry for visibility, decide instantly, no committee.
2. **Standalone diagnostic labs & collection centres** — footfall-driven, love a free lead channel.
3. **Private ambulance operators** — almost never have a web presence; easy win.
4. **Small/mid multi-speciality clinics** — a few practitioners, one decision-maker.
5. (Later) big hospitals — long sales cycles, skip for the pilot.

### Rep script — WhatsApp first touch (send in English or Telugu/Hindi)
> Namaste Dr. [Name], I'm [Rep] from FindDoc India — a free platform helping Hyderabad patients find and book nearby doctors. We'd like to list your clinic **free of cost** so patients searching in [Area] can find you, see your timings, and call/book directly. No charge, no commitment. Can I take 2 minutes to add you? You can also self-list here: finddoc-india.netlify.app/partners

### Rep script — in-person / phone (30 seconds)
> "We run FindDoc — think of it like a cleaner, free version of Practo focused on Hyderabad. Patients nearby search for a [specialty] and your clinic shows up with your timings and fees. Listing is completely free. All I need is your name, clinic address, timings, and consultation fee, and you're live today. Later, if it sends you patients, there's an optional paid 'Featured' spot — but the listing itself is always free."

### Handling the three objections
- **"Is it really free?"** → "Yes — free listing forever. We only ever charge for optional extra visibility, and only if you choose it after you see it works."
- **"I already have Practo."** → "Great — this is an extra, free channel, no exclusivity. More patients find you, costs you nothing."
- **"What's the catch / my data?"** → "We only publish what you give us with your consent — never scraped. You can ask us to remove it anytime."

### What the rep must collect per provider (paste into the signup form)
Name · Specialty/qualifications · Clinic/lab name · Full address + area · Consultation fee · Timings · Mobile · Languages · Consent (checkbox on the form). One provider = one form submission → lands in your Netlify → Forms inbox + email.

### Rep incentive idea (keeps it honest)
Pay per **verified, consented** listing that goes live (e.g. ₹30–60 each), with a small bonus for listings that later receive a patient call/booking. Never pay for raw scraped rows — that reintroduces the fake-data problem.

---

## Demand: getting real Hyderabad patients

Only start this once ~30+ real providers are live, so early users find something useful.

- **Hyperlocal social:** Instagram/Facebook pages "FindDoc Hyderabad" posting useful local content — "Top-rated pediatricians in Kukatpally," "Sunday-open diagnostic labs in Gachibowli," clinic spotlights. Boost ₹200–500/post to Hyderabad pincodes.
- **WhatsApp/Telegram community seeding:** share the site in Hyderabad resident/apartment/parenting groups where it's genuinely helpful (not spam).
- **The reps double as demand:** every clinic that lists tells its own patients "find me / book me on FindDoc" — supply and demand from the same visit.
- **Local SEO:** one city = winnable. Pages like `/search?city=Hyderabad`, real area names, real providers → Google actually ranks you for "dermatologist in Banjara Hills."
- **Google Business + directories** for FindDoc itself (not scraping others).

---

## When to switch on money (your step 3 & 4)

Trigger: a provider is visibly getting **patient calls/bookings through the site** and asks "how do I get more / show up higher." That's when Featured (₹1,999/mo) and booking commission become an easy yes. Rough readiness signal: ~1,000+ monthly Hyderabad visitors and a handful of providers reporting inbound. You already have a Razorpay account — when we hit this, I wire up checkout in the code (½ day of work) and you flip it on. Not before.

---

## Division of labour

**You / your reps (offline, human, identity-bound):**
- Approach and sign up real Hyderabad providers (calls, visits, WhatsApp) using the scripts above.
- Run the social pages and ground marketing.
- Register a business entity + hand me Razorpay keys *when* we reach the money stage.

**Me (anything on the site/code):**
- Provider signup form is now live and captures real leads (done).
- Ingest the real providers you collect into the site, city by city.
- Build Featured/commission checkout with your Razorpay keys when the time comes.
- Add a provider dashboard, real-availability, WhatsApp booking confirmations as we grow.
- Write the honest "FindDoc is live in Hyderabad" launch post once real supply exists.

---

## This week's concrete checklist
1. [ ] You: confirm Hyderabad pilot, pick 2–3 target localities (e.g. Banjara Hills, Gachibowli, Kukatpally).
2. [ ] Me: partner signup form live + lands in your Netlify Forms inbox (done — verify a test submission).
3. [ ] You: set up email notifications in Netlify → Forms so every signup pings you.
4. [ ] You / rep: sign up the first 10 real providers using the scripts.
5. [ ] Me: replace demo data with those 10 real Hyderabad providers as they come in.
6. [ ] Then: repeat to ~30, start demand-side social, review together before any paid features.
