import { getProjects } from "@/lib/db";
import ProjectsPortfolio from "@/components/projects/ProjectsPortfolio";

export const revalidate = 0;

export const metadata = {
  title: "Projects Portfolio — KAIRU KALA Architecture",
  description: "Browse the complete architectural catalog of KAIRU KALA. Filter by residential, cultural, commercial, and heritage restoration works.",
};

export default async function ProjectsPage() {
  const projects = await getProjects({ section: "projects" });

  return <ProjectsPortfolio initialProjects={projects} />;
}
