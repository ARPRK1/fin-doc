/**
 * Server wrapper for the doctor profile route.
 * generateStaticParams pre-renders every doctor page for static export
 * (`output: "export"` in next.config.mjs).
 */
import { doctors } from "@/lib/data";
import DoctorProfile from "./ProfileClient";

export function generateStaticParams() {
  return doctors.map((d) => ({ id: d.id }));
}

export default function Page() {
  return <DoctorProfile />;
}
