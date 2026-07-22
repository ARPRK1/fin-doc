/** Server wrapper: pre-renders every hospital page for static export. */
import { hospitals } from "@/lib/data";
import HospitalProfile from "./ProfileClient";

export function generateStaticParams() {
  return hospitals.map((h) => ({ id: h.id }));
}

export default function Page() {
  return <HospitalProfile />;
}
