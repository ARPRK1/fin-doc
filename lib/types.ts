/** Shared domain types for FindDoc India. */

export interface Review {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  gender: "male" | "female";
  specialty: string;
  specialtyKey: string;
  specialtyHi: string;
  qualifications: string;
  experienceYears: number;
  languages: string[];
  city: string;
  area: string;
  clinicName: string;
  address: string;
  lat: number;
  lng: number;
  fee: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  timings: { days: string; slots: string };
  availableToday: boolean;
  nextSlot: string;
  verified: boolean;
  /** Paid visibility placement — always shown with a "Featured" label in the UI. */
  featured: boolean;
  about: string;
}

export interface Hospital {
  id: string;
  name: string;
  type: string;
  city: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  beds: number;
  specialties: string[];
  emergency24x7: boolean;
  opdTimings: string;
  phone: string;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  facilities: string[];
  verified: boolean;
  featured: boolean;
  opdFeeRange: number[];
}

export interface LabTest {
  name: string;
  price: number;
  mrp: number | null;
}

export interface Lab {
  id: string;
  name: string;
  city: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  nablAccredited: boolean;
  homeCollection: boolean;
  homeCollectionFee: number;
  reportTime: string;
  timings: string;
  phone: string;
  verified: boolean;
  featured: boolean;
  tests: LabTest[];
}

export interface AmbulanceType {
  type: string;
  baseFare: number;
  perKm: number;
  note: string;
}

export interface AmbulanceService {
  id: string;
  name: string;
  city: string;
  coverage: string;
  lat: number;
  lng: number;
  phone: string;
  etaMinutes: number;
  available24x7: boolean;
  gpsTracked: boolean;
  rating: number;
  reviewCount: number;
  verified: boolean;
  featured: boolean;
  types: AmbulanceType[];
}

/** A simulated booking stored locally on the user's device. */
export interface Booking {
  id: string;
  kind: "doctor" | "diagnostic" | "ambulance";
  providerId: string;
  providerName: string;
  detail: string; // e.g. specialty / test name / ambulance type
  city: string;
  slot: string;
  amount: number | null;
  status: "confirmed" | "cancelled";
  createdAt: string;
}

export interface Favorite {
  id: string; // provider id
  kind: "doctor" | "hospital" | "lab";
  name: string;
  detail: string;
  city: string;
}
