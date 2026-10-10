import { redirect, notFound } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProjectById } from "@/lib/db";
import ProjectForm from "@/components/admin/ProjectForm";

export const revalidate = 0;

interface EditProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    notFound();
  }

  return <ProjectForm initialProject={project} isEditing={true} />;
}
