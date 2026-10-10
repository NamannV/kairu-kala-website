import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getSiteContent, getFounders } from "@/lib/db";
import SiteContentManager from "@/components/admin/SiteContentManager";

export const revalidate = 0;

export default async function AdminContentPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();
  const founders = await getFounders();

  return <SiteContentManager initialContent={content} initialFounders={founders} />;
}
