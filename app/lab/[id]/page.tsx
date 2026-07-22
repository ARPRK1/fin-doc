/** Server wrapper: pre-renders every lab page for static export. */
import { labs } from "@/lib/data";
import LabProfile from "./ProfileClient";

export function generateStaticParams() {
  return labs.map((l) => ({ id: l.id }));
}

export default function Page() {
  return <LabProfile />;
}
