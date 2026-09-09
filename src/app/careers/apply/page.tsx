import { redirect } from "next/navigation";
import { getRole } from "@/lib/careers";

/** /careers/apply has no role of its own. Old ?role= links forward to the role's page; anything else goes to the list. */
export default async function ApplyIndex({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role } = await searchParams;
  if (role && getRole(role)) redirect(`/careers/apply/${role}`);
  redirect("/careers#roles");
}
