import { getProjects, getCarouselSettings } from "@/lib/db";
import LandingCarousel from "@/components/landing/LandingCarousel";

export const revalidate = 0; // Dynamic server fetch for real-time CMS updates

export default async function LandingPage() {
  // Fetch only published projects marked for the 3D perspective landing carousel
  const carouselProjects = await getProjects({ section: "carousel" });
  const settings = await getCarouselSettings();

  return <LandingCarousel projects={carouselProjects} settings={settings} />;
}
