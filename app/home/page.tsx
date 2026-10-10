import HomeHero from "@/components/home/HomeHero";
import FeaturedProjects from "@/components/home/FeaturedProjects";
import BrandStatement from "@/components/home/BrandStatement";
import AboutPreview from "@/components/home/AboutPreview";
import ContactCTA from "@/components/home/ContactCTA";
import { getProjects } from "@/lib/db";

export const revalidate = 0;

export const metadata = {
  title: "Studio Home — KAIRU KALA Contemporary Architecture",
  description: "Explore KAIRU KALA's architectural practice, featured spatial inquiries, and philosophy of context and light.",
};

export default async function HomePage() {
  const projects = await getProjects({ section: "home" });

  return (
    <>
      <HomeHero />
      <FeaturedProjects projects={projects} />
      <BrandStatement />
      <AboutPreview />
      <ContactCTA />
    </>
  );
}
