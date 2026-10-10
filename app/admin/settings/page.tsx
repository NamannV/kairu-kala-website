import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCarouselSettings, getProjects } from "@/lib/db";
import CarouselSettingsManager from "@/components/admin/CarouselSettingsManager";

export const revalidate = 0;

export default async function AdminCarouselSettingsPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const settings = await getCarouselSettings();
  const projects = await getProjects();

  return <CarouselSettingsManager initialSettings={settings} projects={projects} />;
}
