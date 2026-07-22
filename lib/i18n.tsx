"use client";
/**
 * Lightweight multi-language foundation (English + Hindi).
 * Structure is ready for more Indian languages — add a dictionary and it works.
 */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "hi";

const dict = {
  en: {
    tagline: "Find the right care, near you",
    subtitle: "Compare verified doctors, hospitals, labs and ambulances across India — with transparent fees and real availability.",
    searchPlaceholder: "Search doctors, specialties, hospitals, tests…",
    doctors: "Doctors",
    hospitals: "Hospitals & Clinics",
    diagnostics: "Diagnostics & Labs",
    emergency: "Emergency & Ambulance",
    howItWorks: "How it works",
    myBookings: "My Bookings",
    favorites: "Favorites",
    featured: "Featured",
    verified: "Verified",
    bookNow: "Book Appointment",
    viewProfile: "View Profile",
    call108: "Call 108 — Free Government Ambulance",
    emergencyNote: "In any medical emergency, call 108 first. It is free, 24×7, across India.",
    disclaimer:
      "FindDoc is an information and discovery platform only. It does not provide medical advice, diagnosis, or treatment. Always verify details directly with providers. In emergencies, call 108 immediately.",
    partners: "For Healthcare Partners",
    freeAlways: "Always free for patients",
  },
  hi: {
    tagline: "सही इलाज, आपके पास",
    subtitle: "भारत भर में सत्यापित डॉक्टर, अस्पताल, लैब और एम्बुलेंस की तुलना करें — पारदर्शी फीस और वास्तविक उपलब्धता के साथ।",
    searchPlaceholder: "डॉक्टर, विशेषज्ञता, अस्पताल, जाँच खोजें…",
    doctors: "डॉक्टर",
    hospitals: "अस्पताल और क्लिनिक",
    diagnostics: "जाँच और लैब",
    emergency: "आपातकाल और एम्बुलेंस",
    howItWorks: "यह कैसे काम करता है",
    myBookings: "मेरी बुकिंग",
    favorites: "पसंदीदा",
    featured: "विशेष रुप से प्रदर्शित",
    verified: "सत्यापित",
    bookNow: "अपॉइंटमेंट बुक करें",
    viewProfile: "प्रोफ़ाइल देखें",
    call108: "108 पर कॉल करें — मुफ़्त सरकारी एम्बुलेंस",
    emergencyNote: "किसी भी मेडिकल इमरजेंसी में पहले 108 पर कॉल करें। यह पूरे भारत में 24×7 मुफ़्त है।",
    disclaimer:
      "FindDoc केवल एक जानकारी और खोज प्लेटफ़ॉर्म है। यह चिकित्सा सलाह, निदान या उपचार प्रदान नहीं करता। हमेशा प्रदाता से सीधे विवरण सत्यापित करें। आपात स्थिति में तुरंत 108 पर कॉल करें।",
    partners: "स्वास्थ्य सेवा पार्टनर के लिए",
    freeAlways: "मरीज़ों के लिए हमेशा मुफ़्त",
  },
} as const;

export type TKey = keyof (typeof dict)["en"];

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const Ctx = createContext<LangCtx>({ lang: "en", setLang: () => {}, t: (k) => dict.en[k] });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("finddoc.lang") as Lang | null;
    if (saved === "en" || saved === "hi") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("finddoc.lang", l);
  };

  const t = (key: TKey) => dict[lang][key] ?? dict.en[key];

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);
