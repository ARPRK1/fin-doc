/**
 * Local persistence for bookings, favorites and user profile.
 * Everything stays on the user's device (localStorage) — no account required.
 * A real backend (with provider commission tracking) is on the roadmap.
 */
import type { Booking, Favorite } from "./types";

const BOOKINGS_KEY = "finddoc.bookings";
const FAVORITES_KEY = "finddoc.favorites";
const PROFILE_KEY = "finddoc.profile";
const CITY_KEY = "finddoc.city";

export interface Profile {
  name: string;
  phone: string;
  city: string;
}

const isBrowser = () => typeof window !== "undefined";

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
  // Let open components (header badge, bookings page) refresh.
  window.dispatchEvent(new CustomEvent("finddoc:storage"));
}

/* ---------- bookings ---------- */
export const getBookings = (): Booking[] => read<Booking[]>(BOOKINGS_KEY, []);

export function addBooking(b: Omit<Booking, "id" | "createdAt" | "status">): Booking {
  const booking: Booking = {
    ...b,
    id: `bk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  write(BOOKINGS_KEY, [booking, ...getBookings()]);
  return booking;
}

export function cancelBooking(id: string) {
  write(
    BOOKINGS_KEY,
    getBookings().map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b))
  );
}

/* ---------- favorites ---------- */
export const getFavorites = (): Favorite[] => read<Favorite[]>(FAVORITES_KEY, []);

export const isFavorite = (id: string) => getFavorites().some((f) => f.id === id);

export function toggleFavorite(fav: Favorite): boolean {
  const list = getFavorites();
  const exists = list.some((f) => f.id === fav.id);
  write(FAVORITES_KEY, exists ? list.filter((f) => f.id !== fav.id) : [fav, ...list]);
  return !exists;
}

/* ---------- profile & city ---------- */
export const getProfile = (): Profile => read<Profile>(PROFILE_KEY, { name: "", phone: "", city: "" });
export const saveProfile = (p: Profile) => write(PROFILE_KEY, p);

export const getCity = (): string => read<string>(CITY_KEY, "Mumbai");
export const setCity = (city: string) => write(CITY_KEY, city);
