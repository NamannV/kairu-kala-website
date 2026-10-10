import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import ProjectForm from "@/components/admin/ProjectForm";

export const revalidate = 0;

export default async function NewProjectPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return <ProjectForm isEditing={false} />;
}
