import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProjects } from "@/lib/db";
import ProjectListManager from "@/components/admin/ProjectListManager";

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const projects = await getProjects();

  return <ProjectListManager initialProjects={projects} />;
}
