import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "FindDoc India — Find doctors, hospitals, labs & ambulances near you",
    template: "%s | FindDoc India",
  },
  description:
    "Discover and compare verified doctors, hospitals, diagnostic labs and ambulance services across India with transparent fees, ratings and real-time availability. Free for patients.",
  manifest: "/manifest.json",
  keywords: ["doctors near me", "hospitals India", "book doctor appointment", "diagnostic tests", "ambulance", "108"],
};

export const viewport: Viewport = {
  themeColor: "#0d9488",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <LanguageProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
