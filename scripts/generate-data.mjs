/**
 * FindDoc India — realistic dataset generator.
 *
 * Generates deterministic (seeded) but realistic provider data for 8 major
 * Indian cities: doctors, hospitals & clinics, diagnostic labs and ambulance
 * services, with authentic specialties, fee ranges researched from real
 * Indian market pricing (Practo / Apollo 24|7 / Tata 1mg ballparks, 2025-26):
 *   - Consultation fees vary by specialty and city tier.
 *   - Diagnostic test prices reflect typical NABL lab pricing.
 *   - Ambulance pricing: base fare + per-km, by vehicle type (BLS/ALS/ICU).
 *
 * Run: npm run generate-data  (also runs automatically before build/dev)
 * Output: data/doctors.json, data/hospitals.json, data/labs.json, data/ambulances.json
 *
 * NOTE: All providers are fictional. This is simulated marketplace data for
 * the demo; a production launch would onboard real, verified providers.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "data");
mkdirSync(OUT, { recursive: true });

/* ---------- seeded PRNG for reproducible data ---------- */
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(20260722);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const between = (min, max) => min + rand() * (max - min);
const int = (min, max) => Math.round(between(min, max));
const round50 = (n) => Math.round(n / 50) * 50;
const chance = (p) => rand() < p;

/* ---------- geography ---------- */
const CITIES = [
  { name: "Mumbai", lat: 19.076, lng: 72.8777, tier: 1, areas: ["Andheri West", "Bandra", "Dadar", "Powai", "Borivali"] },
  { name: "Delhi", lat: 28.6139, lng: 77.209, tier: 1, areas: ["Saket", "Karol Bagh", "Dwarka", "Lajpat Nagar", "Rohini"] },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, tier: 1, areas: ["Indiranagar", "Koramangala", "Whitefield", "Jayanagar", "HSR Layout"] },
  { name: "Hyderabad", lat: 17.385, lng: 78.4867, tier: 1, areas: ["Banjara Hills", "Gachibowli", "Secunderabad", "Kukatpally"] },
  { name: "Chennai", lat: 13.0827, lng: 80.2707, tier: 1, areas: ["T. Nagar", "Anna Nagar", "Adyar", "Velachery"] },
  { name: "Kolkata", lat: 22.5726, lng: 88.3639, tier: 1, areas: ["Salt Lake", "Park Street", "Ballygunge", "Howrah"] },
  { name: "Pune", lat: 18.5204, lng: 73.8567, tier: 2, areas: ["Koregaon Park", "Kothrud", "Hinjewadi", "Viman Nagar"] },
  { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, tier: 2, areas: ["Navrangpura", "Satellite", "Maninagar", "Bopal"] },
];
// jitter a point within ~6km of the city centre
const nearCity = (c) => ({
  lat: +(c.lat + between(-0.05, 0.05)).toFixed(5),
  lng: +(c.lng + between(-0.05, 0.05)).toFixed(5),
});

/* ---------- specialties with realistic fee ranges (tier-1 metro, INR) ---------- */
const SPECIALTIES = [
  { key: "general-physician", name: "General Physician", hi: "सामान्य चिकित्सक", fee: [300, 700], deg: ["MBBS", "MBBS, MD (General Medicine)"] },
  { key: "pediatrician", name: "Pediatrician", hi: "बाल रोग विशेषज्ञ", fee: [400, 900], deg: ["MBBS, MD (Pediatrics)", "MBBS, DCH"] },
  { key: "gynecologist", name: "Gynecologist & Obstetrician", hi: "स्त्री रोग विशेषज्ञ", fee: [500, 1100], deg: ["MBBS, MS (Obs & Gyn)", "MBBS, DGO"] },
  { key: "dermatologist", name: "Dermatologist", hi: "त्वचा रोग विशेषज्ञ", fee: [500, 1100], deg: ["MBBS, MD (Dermatology)", "MBBS, DDVL"] },
  { key: "cardiologist", name: "Cardiologist", hi: "हृदय रोग विशेषज्ञ", fee: [800, 1800], deg: ["MBBS, MD, DM (Cardiology)", "MBBS, MD (Medicine), DNB (Cardiology)"] },
  { key: "orthopedist", name: "Orthopedic Surgeon", hi: "हड्डी रोग विशेषज्ञ", fee: [600, 1300], deg: ["MBBS, MS (Orthopedics)", "MBBS, D.Ortho"] },
  { key: "ent", name: "ENT Specialist", hi: "कान-नाक-गला विशेषज्ञ", fee: [400, 900], deg: ["MBBS, MS (ENT)", "MBBS, DLO"] },
  { key: "ophthalmologist", name: "Ophthalmologist", hi: "नेत्र रोग विशेषज्ञ", fee: [400, 900], deg: ["MBBS, MS (Ophthalmology)", "MBBS, DOMS"] },
  { key: "psychiatrist", name: "Psychiatrist", hi: "मनोचिकित्सक", fee: [800, 1600], deg: ["MBBS, MD (Psychiatry)"] },
  { key: "dentist", name: "Dentist", hi: "दंत चिकित्सक", fee: [300, 800], deg: ["BDS", "BDS, MDS"] },
  { key: "neurologist", name: "Neurologist", hi: "तंत्रिका रोग विशेषज्ञ", fee: [900, 1800], deg: ["MBBS, MD, DM (Neurology)"] },
  { key: "gastroenterologist", name: "Gastroenterologist", hi: "पेट रोग विशेषज्ञ", fee: [800, 1500], deg: ["MBBS, MD, DM (Gastroenterology)"] },
  { key: "diabetologist", name: "Diabetologist", hi: "मधुमेह विशेषज्ञ", fee: [500, 1100], deg: ["MBBS, MD (Medicine), Fellowship in Diabetology"] },
  { key: "urologist", name: "Urologist", hi: "मूत्र रोग विशेषज्ञ", fee: [700, 1400], deg: ["MBBS, MS, MCh (Urology)"] },
];

/* ---------- Indian name pools ---------- */
const MALE = ["Rajesh", "Amit", "Suresh", "Vikram", "Arjun", "Karthik", "Sanjay", "Rahul", "Aditya", "Manoj", "Pranav", "Nikhil", "Ramesh", "Deepak", "Harish", "Srinivas", "Anand", "Rohit", "Gaurav", "Mohit"];
const FEMALE = ["Priya", "Ananya", "Kavita", "Sunita", "Meera", "Divya", "Sneha", "Pooja", "Lakshmi", "Ritu", "Neha", "Swati", "Anjali", "Shalini", "Aparna", "Nandini", "Rekha", "Vidya", "Ishita", "Sarita"];
const SURNAMES = ["Sharma", "Verma", "Iyer", "Reddy", "Patel", "Gupta", "Nair", "Rao", "Mehta", "Kulkarni", "Chatterjee", "Banerjee", "Desai", "Joshi", "Menon", "Krishnan", "Agarwal", "Bhat", "Singh", "Choudhary", "Mukherjee", "Pillai", "Shah", "Kapoor"];
const LANG_POOLS = {
  Mumbai: ["Hindi", "Marathi", "English", "Gujarati"],
  Delhi: ["Hindi", "English", "Punjabi"],
  Bengaluru: ["Kannada", "English", "Hindi", "Tamil", "Telugu"],
  Hyderabad: ["Telugu", "Hindi", "English", "Urdu"],
  Chennai: ["Tamil", "English", "Hindi"],
  Kolkata: ["Bengali", "Hindi", "English"],
  Pune: ["Marathi", "Hindi", "English"],
  Ahmedabad: ["Gujarati", "Hindi", "English"],
};
const CLINIC_WORDS = ["Care", "Wellness", "Health", "Life", "Arogya", "Sanjeevani", "Shree", "City", "Family", "Prime"];

const REVIEW_SNIPPETS = [
  "Very patient and explained everything clearly. Didn't feel rushed at all.",
  "Clinic was clean and the wait time was short. Prescription worked well.",
  "Listens carefully and doesn't push unnecessary tests. Highly recommend.",
  "Good experience overall, though the waiting area gets crowded in evenings.",
  "Took time to answer all my questions. Staff was courteous.",
  "Accurate diagnosis when two other doctors couldn't figure it out.",
  "Fees are reasonable for the quality of consultation.",
  "Follow-up was smooth and they answered my call for a doubt later.",
  "Very good with kids — my daughter wasn't scared at all.",
  "Explained the reports in simple language. Felt genuinely cared for.",
];
const REVIEWERS = ["Rohan M.", "Sneha K.", "Amit T.", "Farida S.", "Joseph V.", "Kiran P.", "Divya R.", "Sameer L.", "Anita G.", "Vivek N."];

const timingsPool = [
  { days: "Mon – Sat", slots: "10:00 AM – 1:00 PM, 5:00 PM – 8:30 PM" },
  { days: "Mon – Fri", slots: "9:30 AM – 1:30 PM, 4:00 PM – 7:00 PM" },
  { days: "Mon – Sat", slots: "11:00 AM – 2:00 PM, 6:00 PM – 9:00 PM" },
  { days: "Tue – Sun", slots: "9:00 AM – 12:30 PM, 5:30 PM – 8:00 PM" },
];

function makeReviews(rating) {
  const n = int(2, 3);
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      author: pick(REVIEWERS),
      rating: Math.min(5, Math.max(3, Math.round(rating + between(-1, 0.6)))),
      text: pick(REVIEW_SNIPPETS),
      date: `${pick(["Jan", "Feb", "Mar", "Apr", "May", "Jun"])} 2026`,
    });
  }
  return out;
}

/* ================= DOCTORS ================= */
const doctors = [];
let did = 1;
for (const city of CITIES) {
  // 11 doctors per city → 88 doctors, covering all specialties over the set
  for (let i = 0; i < 11; i++) {
    const spec = SPECIALTIES[(did - 1) % SPECIALTIES.length];
    const gender = chance(0.45) ? "female" : "male";
    const first = gender === "female" ? pick(FEMALE) : pick(MALE);
    const name = `Dr. ${first} ${pick(SURNAMES)}`;
    const exp = int(4, 32);
    const [lo, hi] = spec.fee;
    const tierMul = city.tier === 1 ? 1 : 0.8; // tier-2 cities ~20% cheaper
    const fee = round50(between(lo, hi) * tierMul * (1 + exp / 120));
    const rating = +between(3.7, 4.9).toFixed(1);
    const area = pick(city.areas);
    const langs = [...new Set([pick(LANG_POOLS[city.name]), pick(LANG_POOLS[city.name]), "English"])];
    const featured = chance(0.16); // paid "Featured" placement — always labeled in UI
    doctors.push({
      id: `doc-${did}`,
      name,
      gender,
      specialty: spec.name,
      specialtyKey: spec.key,
      specialtyHi: spec.hi,
      qualifications: pick(spec.deg),
      experienceYears: exp,
      languages: langs,
      city: city.name,
      area,
      clinicName: `${pick(CLINIC_WORDS)} ${pick(["Clinic", "Medical Centre", "Polyclinic", "Speciality Clinic"])}, ${area}`,
      address: `${int(1, 240)}, ${area} Main Road, ${city.name}`,
      ...nearCity(city),
      fee,
      rating,
      reviewCount: int(24, 940),
      reviews: makeReviews(rating),
      timings: pick(timingsPool),
      availableToday: chance(0.7),
      nextSlot: pick(["Today 11:30 AM", "Today 5:00 PM", "Today 6:30 PM", "Tomorrow 10:00 AM", "Tomorrow 12:30 PM"]),
      verified: chance(0.85), // registration verified against state medical council (simulated)
      featured,
      about: `${name.split(" ")[1]} is a ${spec.name.toLowerCase()} with ${exp} years of experience, practising in ${area}, ${city.name}. Known for clear communication and evidence-based care.`,
    });
    did++;
  }
}

/* ================= HOSPITALS & CLINICS ================= */
const HOSPITAL_NAMES = ["Lotus", "Ashwini", "Sparsh", "Medicare", "Jeevan", "Sunrise", "Nirmal", "Kaveri", "Vatsalya", "Global", "Trinity", "Sahyadri"];
const H_TYPES = [
  { type: "Multi-speciality Hospital", beds: [120, 600] },
  { type: "Super-speciality Hospital", beds: [200, 800] },
  { type: "Community Clinic", beds: [0, 0] },
  { type: "Children's Hospital", beds: [60, 200] },
  { type: "Maternity & Women's Hospital", beds: [40, 150] },
];
const FACILITIES = ["24×7 Emergency", "ICU", "Pharmacy", "Ambulance", "Blood Bank", "Operation Theatres", "Cashless Insurance", "Diagnostics Lab", "Physiotherapy", "Daycare Surgery"];
const hospitals = [];
let hid = 1;
for (const city of CITIES) {
  for (let i = 0; i < 3; i++) {
    const ht = pick(H_TYPES);
    const rating = +between(3.8, 4.8).toFixed(1);
    const area = pick(city.areas);
    const specCount = int(4, 8);
    const specs = [...new Set(Array.from({ length: specCount }, () => pick(SPECIALTIES).name))];
    hospitals.push({
      id: `hos-${hid}`,
      name: `${pick(HOSPITAL_NAMES)} ${ht.type.includes("Clinic") ? "Clinic" : "Hospital"}, ${area}`,
      type: ht.type,
      city: city.name,
      area,
      address: `${int(1, 200)}, ${area}, ${city.name}`,
      ...nearCity(city),
      beds: ht.beds[1] ? int(ht.beds[0], ht.beds[1]) : 0,
      specialties: specs,
      emergency24x7: ht.type.includes("Clinic") ? chance(0.2) : chance(0.9),
      opdTimings: "OPD: Mon – Sat, 9:00 AM – 8:00 PM",
      phone: `+91 ${int(70000, 99999)} ${int(10000, 99999)}`,
      rating,
      reviewCount: int(80, 2400),
      reviews: makeReviews(rating),
      facilities: [...new Set(Array.from({ length: int(4, 7) }, () => pick(FACILITIES)))],
      verified: chance(0.9),
      featured: chance(0.15),
      opdFeeRange: [round50(between(300, 500)), round50(between(700, 1200))],
    });
    hid++;
  }
}

/* ================= DIAGNOSTIC LABS ================= */
const LAB_NAMES = ["Precision", "TruPath", "HealthScan", "Metro", "Accura", "LifeCell", "Prognosis", "CityLab"];
const TESTS = [
  { name: "Complete Blood Count (CBC)", price: [250, 400] },
  { name: "Lipid Profile", price: [400, 700] },
  { name: "HbA1c (Diabetes)", price: [300, 550] },
  { name: "Thyroid Profile (T3, T4, TSH)", price: [400, 650] },
  { name: "Liver Function Test (LFT)", price: [450, 800] },
  { name: "Kidney Function Test (KFT)", price: [450, 800] },
  { name: "Vitamin D (25-OH)", price: [900, 1500] },
  { name: "Vitamin B12", price: [600, 1000] },
  { name: "Urine Routine & Microscopy", price: [150, 300] },
  { name: "Chest X-Ray (PA view)", price: [300, 600] },
  { name: "Ultrasound — Whole Abdomen", price: [900, 1800] },
  { name: "ECG (Resting)", price: [200, 400] },
  { name: "Full Body Health Checkup (Basic)", price: [1500, 2800] },
  { name: "Full Body Health Checkup (Advanced)", price: [3000, 5500] },
  { name: "CT Scan — Head (Plain)", price: [2500, 4500] },
  { name: "MRI — Knee (Single Joint)", price: [4500, 8000] },
];
const labs = [];
let lid = 1;
for (const city of CITIES) {
  for (let i = 0; i < 2; i++) {
    const rating = +between(3.9, 4.8).toFixed(1);
    const area = pick(city.areas);
    const testCount = int(10, TESTS.length);
    const shuffled = [...TESTS].sort(() => rand() - 0.5).slice(0, testCount);
    labs.push({
      id: `lab-${lid}`,
      name: `${pick(LAB_NAMES)} Diagnostics, ${area}`,
      city: city.name,
      area,
      address: `${int(1, 180)}, ${area}, ${city.name}`,
      ...nearCity(city),
      rating,
      reviewCount: int(60, 1600),
      nablAccredited: chance(0.75),
      homeCollection: chance(0.85),
      homeCollectionFee: chance(0.5) ? 0 : 100,
      reportTime: pick(["Same day", "Within 6 hours", "Within 24 hours"]),
      timings: "Mon – Sun, 6:30 AM – 9:00 PM",
      phone: `+91 ${int(70000, 99999)} ${int(10000, 99999)}`,
      verified: chance(0.9),
      featured: chance(0.15),
      tests: shuffled.map((t) => {
        const p = round50(between(t.price[0], t.price[1]));
        return { name: t.name, price: p, mrp: chance(0.6) ? round50(p * between(1.15, 1.4)) : null };
      }),
    });
    lid++;
  }
}

/* ================= AMBULANCE SERVICES ================= */
const AMB_NAMES = ["Lifeline", "Rapid Response", "MedRush", "Sanjeevani", "CityMed", "Guardian"];
const AMB_TYPES = [
  { type: "Basic Life Support (BLS)", baseFare: [800, 1500], perKm: [20, 35], note: "Oxygen, stretcher, trained attendant. For stable patient transfer." },
  { type: "Advanced Life Support (ALS)", baseFare: [2000, 3500], perKm: [40, 60], note: "Ventilator, defibrillator, cardiac monitor, paramedic on board." },
  { type: "ICU Ambulance", baseFare: [3500, 6000], perKm: [60, 90], note: "Mobile ICU with critical-care equipment and ICU-trained staff." },
  { type: "Patient Transport (Non-emergency)", baseFare: [500, 900], perKm: [15, 25], note: "For discharges, dialysis visits and check-ups. No emergency gear." },
];
const ambulances = [];
let aid = 1;
for (const city of CITIES) {
  for (let i = 0; i < 2; i++) {
    const rating = +between(3.8, 4.9).toFixed(1);
    const nTypes = int(2, 4);
    const types = [...AMB_TYPES].sort(() => rand() - 0.5).slice(0, nTypes).map((t) => ({
      type: t.type,
      baseFare: round50(between(t.baseFare[0], t.baseFare[1])),
      perKm: int(t.perKm[0], t.perKm[1]),
      note: t.note,
    }));
    ambulances.push({
      id: `amb-${aid}`,
      name: `${pick(AMB_NAMES)} Ambulance Services`,
      city: city.name,
      coverage: `${city.name} & suburbs (up to 50 km)`,
      ...nearCity(city),
      phone: `+91 ${int(70000, 99999)} ${int(10000, 99999)}`,
      etaMinutes: int(8, 25),
      available24x7: true,
      gpsTracked: chance(0.8),
      rating,
      reviewCount: int(40, 800),
      verified: chance(0.9),
      featured: chance(0.12),
      types,
    });
    aid++;
  }
}

/* ---------- write ---------- */
writeFileSync(join(OUT, "doctors.json"), JSON.stringify(doctors, null, 2));
writeFileSync(join(OUT, "hospitals.json"), JSON.stringify(hospitals, null, 2));
writeFileSync(join(OUT, "labs.json"), JSON.stringify(labs, null, 2));
writeFileSync(join(OUT, "ambulances.json"), JSON.stringify(ambulances, null, 2));
console.log(`Generated ${doctors.length} doctors, ${hospitals.length} hospitals, ${labs.length} labs, ${ambulances.length} ambulance services.`);
