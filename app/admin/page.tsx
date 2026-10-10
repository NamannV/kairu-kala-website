import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProjects, getCarouselSettings, getInquiries } from "@/lib/db";
import {
  FolderOpen,
  Sliders,
  Mail,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Calendar
} from "lucide-react";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const projects = await getProjects();
  const settings = await getCarouselSettings();
  const inquiries = await getInquiries();

  const publishedCount = projects.filter((p) => p.is_published).length;
  const featuredCount = projects.filter((p) => p.is_featured).length;

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-[#DCC8A0]/15">
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#DCC8A0] block mb-1">
            Studio Management
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#F7E9C7] font-light">
            Overview Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F7E9C7] text-[#4B1718] font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-[#DCC8A0] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Project</span>
          </Link>
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#DCC8A0]/30 text-xs uppercase tracking-[0.2em] font-medium text-[#F7E9C7] hover:border-[#F7E9C7] transition-colors"
          >
            <Eye className="w-4 h-4" />
            <span>View Site</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#DCC8A0]">
            <span className="text-xs uppercase tracking-widest">Total Projects</span>
            <FolderOpen className="w-4 h-4" />
          </div>
          <p className="font-serif text-4xl text-[#F7E9C7]">{projects.length}</p>
          <p className="text-[11px] text-[#DCC8A0]/60">{publishedCount} currently public</p>
        </div>

        <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#DCC8A0]">
            <span className="text-xs uppercase tracking-widest">Carousel Items</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="font-serif text-4xl text-[#F7E9C7]">{featuredCount}</p>
          <p className="text-[11px] text-[#DCC8A0]/60">Featured in 3D carousel</p>
        </div>

        <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#DCC8A0]">
            <span className="text-xs uppercase tracking-widest">Autoplay State</span>
            <Sliders className="w-4 h-4" />
          </div>
          <p className="font-serif text-3xl text-[#F7E9C7]">
            {settings.autoplay_enabled ? "Active" : "Disabled"}
          </p>
          <p className="text-[11px] text-[#DCC8A0]/60">
            {settings.autoplay_interval ? `${settings.autoplay_interval / 1000}s interval` : "Standard pace"}
          </p>
        </div>

        <div className="bg-[#220809] border border-[#DCC8A0]/15 p-6 space-y-2">
          <div className="flex items-center justify-between text-[#DCC8A0]">
            <span className="text-xs uppercase tracking-widest">Client Inquiries</span>
            <Mail className="w-4 h-4" />
          </div>
          <p className="font-serif text-4xl text-[#F7E9C7]">{inquiries.length}</p>
          <p className="text-[11px] text-[#DCC8A0]/60">Logged through contact form</p>
        </div>
      </div>

      {/* Projects Table Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#F7E9C7]">Recent Projects</h2>
          <Link
            href="/admin/projects"
            className="text-xs uppercase tracking-widest text-[#DCC8A0] hover:text-[#F7E9C7] transition-colors"
          >
            Manage All ({projects.length}) →
          </Link>
        </div>

        <div className="bg-[#220809] border border-[#DCC8A0]/15 overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-[#300E0F] text-[#DCC8A0] uppercase tracking-wider border-b border-[#DCC8A0]/15">
              <tr>
                <th className="p-4">Project</th>
                <th className="p-4">Typology</th>
                <th className="p-4">Location</th>
                <th className="p-4">Status</th>
                <th className="p-4">Carousel</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCC8A0]/10 text-[#F7E9C7]/90">
              {projects.slice(0, 5).map((project) => (
                <tr key={project.id} className="hover:bg-[#300E0F]/50 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-[#300E0F] shrink-0 overflow-hidden border border-[#DCC8A0]/20">
                      <Image
                        src={project.cover_image_url}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-[#F7E9C7]">{project.title}</p>
                      <p className="text-[10px] text-[#DCC8A0]/70">{project.slug}</p>
                    </div>
                  </td>
                  <td className="p-4 text-[#DCC8A0]">{project.category}</td>
                  <td className="p-4">{project.location} · {project.year}</td>
                  <td className="p-4">
                    {project.is_published ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                      </span>
                    ) : (
                      <span className="text-amber-400">Draft</span>
                    )}
                  </td>
                  <td className="p-4">
                    {project.is_featured ? (
                      <span className="text-[#DCC8A0] font-medium">★ Featured</span>
                    ) : (
                      <span className="text-[#DCC8A0]/40">—</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-3">
                    <Link
                      href={`/admin/projects/${project.id}/edit`}
                      className="text-[#DCC8A0] hover:text-[#F7E9C7] underline decoration-[#DCC8A0]/30"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      className="text-[#DCC8A0]/70 hover:text-[#F7E9C7]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiries Section */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl text-[#F7E9C7]">Recent Inquiries</h2>
        {inquiries.length === 0 ? (
          <div className="p-8 bg-[#220809] border border-[#DCC8A0]/15 text-center text-xs text-[#DCC8A0]/60">
            No inquiries recorded yet. Contact form submissions will appear here.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inquiries.slice(0, 4).map((inq) => (
              <div key={inq.id} className="p-5 bg-[#220809] border border-[#DCC8A0]/15 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#F7E9C7]">{inq.name}</span>
                  <span className="text-[#DCC8A0]/60 text-[10px]">
                    {new Date(inq.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-[11px] text-[#DCC8A0] flex items-center gap-2">
                  <span>{inq.email}</span>
                  {inq.phone && <span>· {inq.phone}</span>}
                  <span>· {inq.inquiry_type}</span>
                </div>
                <p className="text-xs text-[#F7E9C7]/80 line-clamp-2 pt-1 font-light italic">
                  &ldquo;{inq.message}&rdquo;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
